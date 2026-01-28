import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import visa from "../assets/visa.png";
import mastercard from "../assets/Mastercard.png";
import pp from "../assets/pp.png";
import { db } from "../data/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useI18n } from "../hooks/useI18n";

function Checkout() {
  const { t, currentLocale, initialize, loading, localizePath } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData;
  const AR = currentLocale === "ar";
  const [paymentUrl, setPaymentUrl] = useState("");

  useEffect(() => {
    initialize();
  }, [initialize]);

  const [course, setCourse] = useState({
    Options: [{ duration: 'N/A', Hours: 'N/A', priceAfter: 'N/A' }],
  });
  const [price, setPrice] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const send = async () => {
    if (latitude && longitude) {
      try {
        const dataAfter = await fetch("https://impact-backend-ten.vercel.app/get-currency", {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            latitude,
            longitude,
            priceUSD: course?.Options[0]?.priceAfter,
          })
        });
        const finalDataAfter = await dataAfter.json();
        if (finalDataAfter) {
          setPrice(finalDataAfter);
        }
      } catch (error) {
        console.error("Error fetching currency data:", error);
      }
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      send();
    }
  }, [latitude, longitude]);

  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [ccv, setCcv] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!formData?.option || !formData?.number) return;

      try {
        const courseRef = doc(db, 'courses', formData.option);
        const courseSnap = await getDoc(courseRef);

        if (courseSnap.exists()) {
          const courseData = courseSnap.data();
          const courseLangData = courseData[currentLocale] || courseData.en;

          const filteredOptions = courseLangData.Options.filter(opt => opt.id === formData.number);
          setFiltered(filteredOptions);
          setCourse(courseLangData);
        } else {
          console.error('Course not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        Swal.fire({
          title: t('free-session', 'error', 'Error'),
          text: t('general', 'errorFetchingCourseData', 'Error fetching course data'),
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };

    fetchCourseData();
  }, [formData, currentLocale, t]);

  const initiatePayment = async () => {
    try {
      const authResponse = await fetch("https://accept.paymob.com/api/auth/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: import.meta.env.VITE_PAYMOB_API_KEY }),
      });
      const authData = await authResponse.json();
      const authToken = authData.token;

      const orderResponse = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_token: authToken,
          amount_cents: "10000",
          currency: "EGP",
          delivery_needed: false,
          items: [],
        }),
      });
      const orderData = await orderResponse.json();
      const orderId = orderData.id;

      const paymentKeyResponse = await fetch("https://accept.paymob.com/api/acceptance/payment_keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_token: authToken,
          amount_cents: "10000",
          expiration: 3600,
          order_id: orderId,
          currency: "EGP",
          integration_id: import.meta.env.VITE_PAYMOB_IFRAME_ID,
        }),
      });
      const paymentKeyData = await paymentKeyResponse.json();
      const paymentKey = paymentKeyData.token;

      const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${import.meta.env.VITE_PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
      setPaymentUrl(iframeUrl);
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedOption.trim().length === 0) {
      Swal.fire({
        title: t('free-session', 'error', 'Error'),
        text: t('general', 'selectPaymentMethod', 'Please select a payment method'),
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    if (!cardholderName || !cardNumber || !expirationDate || !ccv) {
      Swal.fire({
        title: t('free-session', 'error', 'Error'),
        text: t('general', 'pleaseFillAllFields', 'Please fill all fields'),
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    if (cardNumber.length !== 16) {
      Swal.fire({
        title: t('free-session', 'error', 'Error'),
        text: t('general', 'invalidCardNumber', 'Invalid card number'),
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const currentDate = new Date();
    const [year, month] = expirationDate.split('-');
    const expiryDate = new Date(year, month - 1);

    if (expiryDate < currentDate) {
      Swal.fire({
        title: t('free-session', 'error', 'Error'),
        text: t('general', 'invalidExpiryDate', 'Invalid expiry date'),
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    if (ccv.length !== 3) {
      Swal.fire({
        title: t('free-session', 'error', 'Error'),
        text: t('general', 'invalidCcv', 'Invalid CCV'),
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    Swal.fire({
      title: t('free-session', 'success', 'Success'),
      text: t('general', 'paymentDoneSuccessfully', 'Payment done successfully'),
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });

    window.scroll(0, 0);
    navigate(localizePath('/'));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--Yellow)]"></div>
      </div>
    );
  }

  return (
    <main className="space-y-8 md:px-40 px-4">
      <h2 className="text-2xl font-bold my-4">{t('course-details', 'checkout', 'Checkout')}</h2>

      <section className="grid text-start grid-cols-1 lg:grid-cols-2 gap-8">
        <article data-aos="fade-right" data-aos-duration="2000" className="p-10 space-y-8 bg-[var(--Input)] rounded-4xl">
          <h1 className="text-4xl font-bold">{filtered[0]?.levelno}</h1>
          <h2 className="text-2xl font-bold">{t('course-details', 'courseDetails', 'Course Details')}</h2>
          <ul className="space-y-2 list-disc px-4 text-2xl">
            <li>
              <span className="font-bold">{t('course-details', 'duration', 'Duration')}: </span> {filtered[0]?.totalTime}
            </li>
            <li>
              <span className="font-bold">{t('course-details', 'sessionLength', 'Session Length')}: </span> {filtered[0]?.Hours} {t('course-details', 'hours', 'hours')}
            </li>
            <li>
              <span className="font-bold">{t('course-details', 'mode', 'Mode')}: </span> {t('course-details', 'online', 'online')}
            </li>
          </ul>
          <div>
            <h2 className="text-xl font-bold my-2">{t('course-details', 'price', 'Price')}</h2>
            <h2 className="text-5xl text-[var(--Yellow)] font-bold my-2">{price ? price.finalPrice : course?.Options[0]?.priceAfter}</h2>
          </div>
        </article>

        <article data-aos="fade-left" data-aos-duration="2000" className="p-10 space-y-5 bg-[var(--Input)] rounded-4xl">
          <h1 className="text-2xl font-bold">{t('course-details', 'chooseYourOption', 'Choose Your Option')}</h1>
          <div className="grid grid-cols-6 md:grid-cols-8 gap-6">
            <div
              className={`rounded-lg h-full col-span-2 p-3 cursor-pointer ${selectedOption === 'visa' ? 'bg-[#0D5CAE4D]' : ''} flex justify-center items-center`}
              onClick={() => handleOptionClick('visa')}
            >
              <img src={visa} alt="Visa" className="h-full w-full drop-shadow-xl" />
            </div>
            <div
              className={`rounded-lg h-full col-span-2 p-3 cursor-pointer ${selectedOption === 'mastercard' ? 'bg-[#0D5CAE4D]' : ''} flex justify-center items-center`}
              onClick={() => handleOptionClick('mastercard')}
            >
              <img src={mastercard} alt="Mastercard" className="h-full w-full drop-shadow-xl" />
            </div>
            <div
              className={`rounded-lg h-full col-span-2 p-3 cursor-pointer ${selectedOption === 'pp' ? 'bg-[#0D5CAE4D]' : ''} flex justify-center items-center`}
              onClick={() => handleOptionClick('pp')}
            >
              <img src={pp} alt="PayPal" className="h-full w-full drop-shadow-xl" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <section>
              <label className="block text-[var(--SubText)]">{t('course-details', 'cardholderName', 'Cardholder Name')}</label>
              <input
                type="text"
                value={cardholderName}
                required
                onChange={(e) => setCardholderName(e.target.value)}
                className="border-2 border-[var(--SubTextBorder)] p-2 mt-2 rounded-lg w-full"
              />
            </section>
            <section>
              <label className="block text-[var(--SubText)]">{t('course-details', 'cardNumber', 'Card Number')}</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength="16"
                required
                className="border-2 border-[var(--SubTextBorder)] p-2 mt-2 rounded-lg w-full"
              />
            </section>
            <section>
              <label className="block text-[var(--SubText)]">{t('course-details', 'expirationDate', 'Expiration Date')}</label>
              <input
                type="month"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                required
                className="border-2 border-[var(--SubTextBorder)] p-2 mt-2 rounded-lg w-full"
              />
            </section>
            <section>
              <label className="block text-[var(--SubText)]">{t('course-details', 'ccv', 'CCV')}</label>
              <input
                type="text"
                value={ccv}
                onChange={(e) => setCcv(e.target.value)}
                maxLength="3"
                required
                className="border-2 border-[var(--SubTextBorder)] p-2 mt-2 rounded-lg w-full"
              />
            </section>
            <section data-aos="fade-up" data-aos-duration="2000" className="flex justify-between mt-12 col-span-1 md:col-span-2">
              <button type="button" className="p-4 px-8 rounded-4xl border-2 border-[var(--Yellow)]" onClick={() => window.history.back()}>
                {t('general', 'back', 'Back')}
              </button>
              <button type="submit" className="p-4 px-8 rounded-4xl bg-[var(--Yellow)]">
                {t('general', 'submit', 'Submit')}
              </button>
            </section>
          </form>
        </article>
      </section>
    </main>
  );
}

export default Checkout;
