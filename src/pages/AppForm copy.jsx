import { useState, useEffect } from "react";
import { useTranslation } from "../../node_modules/react-i18next";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import cntris from "../data/Countries.json";
import { db } from "../data/firebaseConfig";
import { useParams } from "react-router-dom";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import vector from "../assets/arrowvector.png";
import { FaApple } from "react-icons/fa";
import { IoCardSharp } from "react-icons/io5";
import { useGetpackageById } from "@/hooks/Actions/packages/usePackageCruds";
const AppForm = () => {
  const { id: packageId } = useParams();
  const { t, i18n } = useTranslation();

  const { data: packData } = useGetpackageById(packageId);
  const coursePackage = packData?.data || {};
  // const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    courseCategory: "",
    phoneNumber: "",
    country: "",
    option: "",
    takenTest: false,
    type: "",
    priceAfter: "",
  });
  const [course, setCourse] = useState([]);
  const [Scourse, setSCourse] = useState([]);
  const [options, setOptions] = useState("");
  // const [paymentUrl, setPaymentUrl] = useState("");
  const [courseDetails, setCourseDetails] = useState("");
  const [level, setLevel] = useState("");
  const [levelAr, setLevelAr] = useState("");
  // const {price , realprice} = useContext(GlobalContext)
  // const realprice = localStorage.getItem("pricereal");
  const removeText = localStorage.getItem("price"); // Get price from localStorage
  const fixedprice = Number(removeText?.replace(/[^\d.]/g, "")); // Remove non-numeric characters
  const formattedPrice = fixedprice.toFixed(0); // Round to integer
  (">>>>>>>>>>>>>>>>>>>>");
  formattedPrice;
  const currentLanguage = i18n.language;
  // const textAlignment = i18n.language === 'ar' ? 'text-right' : 'text-left';

  const countries = cntris;
  // const countriesAr = countries.map((cnt) => cnt.nameAr);
  const countriesEn = countries.map((cnt) => cnt.nameEn);

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      courseCategory: Scourse.Tab || "",
      option: i18n.language === "en" ? Scourse.Name : Scourse.NameAr,
      type: i18n.language === "en" ? Scourse.Name : Scourse.NameAr || "",
      number: id || "",
    }));
  }, [location.state, Scourse]);
  // useEffect(() => {
  //   const fetchCourse = async () => {
  //     try {
  //       const docRef = doc(db, "courses", formData.option);
  //       const docSnap = await getDoc(docRef);

  //       if (docSnap.exists()) {
  //         const courseData = docSnap.data()?.[currentLanguage];

  //         if (courseData) {
  //           // Filter based on the course ID (number)
  //           const filteredCourse = courseData.Options.filter(
  //             (data) => data.id === formData.number
  //           );
  //           setCourse(filteredCourse);
  //           setOptions(courseData.Options.map((opt) => opt.levelno));
  //         } else {
  //           ("No options data found.");
  //         }
  //       } else {
  //         console.error("No such document!");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching course: ", error);
  //     }
  //   };
  //   setCourseDetails(Scourse.Tab);
  //   fetchCourse();
  // }, [formData.option, formData.number, currentLanguage]);
  // const pricereal = Scourse.PriceAfter;
  // const courseID = id;

  const [userCountry, setUserCountry] = useState(null);

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        if (data && data.country) {
          setUserCountry(data.country);
        } else {
          console.error("Could not determine user country");
        }
      } catch (error) {
        console.error("Error fetching user location:", error);
      }
    };
    setLevel(Scourse.Name);
    setLevelAr(Scourse.NameAr);
    fetchUserLocation();
  }, [Scourse]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };
  const initiatePayment = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.courseCategory ||
      !formData.phoneNumber ||
      !formData.country ||
      !formData.option ||
      !formData.type
    ) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: t("pleaseFillAllFields"),
        timer: 1000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      // Step 1: Create Firebase records
      const newCourseRef = await addDoc(collection(db, "payments"), {
        Name: formData.name,
        Email: formData.email,
        Money: pricereal,
        Option: formData.option,
        category: formData.courseCategory,
        phone: formData.phoneNumber,
        country: formData.country,
        test: formData.takenTest,
        Time: new Date(),
        status: "pending",
        courseData: "",
        courseTime: "",
        type: formData.type,
        Date: new Date(),
        createdAt: serverTimestamp(),
      });

      const newCourse = await addDoc(collection(db, "Requests"), {
        Name: formData.name,
        Email: formData.email,
        Money: pricereal,
        Option: formData.option,
        category: formData.courseCategory,
        phone: formData.phoneNumber,
        country: formData.country,
        test: formData.takenTest,
        Time: new Date(),
        courseData: "",
        courseTime: "",
        option: "course request",
        status: "pending",
        type: formData.type,
        Date: new Date(),
        createdAt: serverTimestamp(),
      });

      // Step 2: Call payment backend with Firebase document IDs
      const response = await fetch(
        "https://impact-backend-ebon.vercel.app/api/initiate-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            courseCategory: formData.courseCategory,
            phoneNumber: formData.phoneNumber,
            country: formData.country,
            option: formData.option,
            type: formData.type,
            takenTest: formData.takenTest,
            userCountry: userCountry,
            realprice: pricereal,
            id: courseID,
            orderId: newCourseRef.id,
            itemId: newCourse.id,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Redirect to payment page
        setLoading(false);
        window.location.href = data.checkoutUrl;
      } else {
        setLoading(false);
        // Handle payment initialization error
        console.error("Payment initialization failed:", data.message);
        Swal.fire({
          icon: "error",
          title: t("error"),
          text: t("paymentInitializationFailed"),
          timer: 2000,
          showConfirmButton: false,
        });

        // Optionally update Firebase documents to reflect failure
        await updateDoc(doc(db, "payments", newCourseRef.id), {
          status: "payment_failed",
        });

        await updateDoc(doc(db, "Requests", newCourse.id), {
          status: "payment_failed",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: t("paymentProcessingError"),
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };
  const applePay = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.courseCategory ||
      !formData.phoneNumber ||
      !formData.country ||
      !formData.option ||
      !formData.type
    ) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: t("pleaseFillAllFields"),
        timer: 1000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      // Step 1: Create Firebase records
      const newCourseRef = await addDoc(collection(db, "payments"), {
        Name: formData.name,
        Email: formData.email,
        Money: pricereal,
        Option: formData.option,
        category: formData.courseCategory,
        phone: formData.phoneNumber,
        country: formData.country,
        test: formData.takenTest,
        Time: new Date(),
        status: "pending",
        courseData: "",
        courseTime: "",
        type: formData.type,
        Date: new Date(),
        createdAt: serverTimestamp(),
      });

      const newCourse = await addDoc(collection(db, "Requests"), {
        Name: formData.name,
        Email: formData.email,
        Money: pricereal,
        Option: formData.option,
        category: formData.courseCategory,
        phone: formData.phoneNumber,
        country: formData.country,
        test: formData.takenTest,
        Time: new Date(),
        courseData: "",
        courseTime: "",
        option: "course request",
        status: "pending",
        type: formData.type,
        Date: new Date(),
        createdAt: serverTimestamp(),
      });

      // Step 2: Call payment backend with Firebase document IDs
      const response = await fetch(
        "https://impact-backend-ebon.vercel.app/api/initiate-payment-apple",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            courseCategory: formData.courseCategory,
            phoneNumber: formData.phoneNumber,
            country: formData.country,
            option: formData.option,
            type: formData.type,
            takenTest: formData.takenTest,
            userCountry: userCountry,
            realprice: pricereal,
            id: courseID,
            orderId: newCourseRef.id,
            itemId: newCourse.id,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Redirect to payment page
        setLoading(false);
        window.location.href = data.checkoutUrl;
      } else {
        setLoading(false);
        // Handle payment initialization error
        console.error("Payment initialization failed:", data.message);
        Swal.fire({
          icon: "error",
          title: t("error"),
          text: t("paymentInitializationFailed"),
          timer: 2000,
          showConfirmButton: false,
        });

        // Optionally update Firebase documents to reflect failure
        await updateDoc(doc(db, "payments", newCourseRef.id), {
          status: "payment_failed",
        });

        await updateDoc(doc(db, "Requests", newCourse.id), {
          status: "payment_failed",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: t("paymentProcessingError"),
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <section className="md:px-40 px-4">
      <form
        onSubmit={initiatePayment}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <article
          data-aos="fade-right"
          data-aos-duration="2000"
          className="space-y-10"
        >
          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-lg font-bold text-black">
              {t("name")}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-[var(--Input)] rounded-md"
              placeholder={t("enterName")}
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-lg font-bold text-black">
              {t("email")}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-[var(--Input)] rounded-md"
              placeholder={t("enterEmail")}
            />
          </div>

          {/* Type Selection */}
          <div className="space-y-2">
            <label className="block text-lg font-bold text-black">
              {t("type")}
            </label>
            <div
              style={{
                backgroundPosition:
                  i18n.language === "en"
                    ? "right 20px center"
                    : "left 20px center",
                backgroundSize: "10px",
                backgroundRepeat: "no-repeat",
              }}
              className="mt-1 pointer-events-none opacity-70  border border-black cursor-not-allowed appearance-none block w-full px-3 py-2 bg-[var(--Input)] rounded-md"
            >
              {i18n.language === "en" ? level : levelAr}
            </div>
          </div>
        </article>

        <article
          data-aos="fade-left"
          data-aos-duration="2000"
          className="space-y-10"
        >
          {/* Phone Number Field */}
          <div className="space-y-2">
            <label className="block text-lg font-bold text-black">
              {t("phoneNumber")}
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 bg-[var(--Input)] rounded-md`}
              placeholder={t("enterPhoneNumber")}
            />
          </div>

          {/* Country Selection */}
          <div className="space-y-2">
            <label className="block text-lg font-bold text-black">
              {t("country")}
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              style={{
                backgroundImage: `url(${vector})`,
                backgroundPosition:
                  i18n.language == "en"
                    ? "right 20px center"
                    : "left 20px center",
                backgroundSize: "10px",
                backgroundRepeat: "no-repeat",
              }}
              className="mt-1 appearance-none block w-full px-3 py-2 bg-[var(--Input)] rounded-md"
            >
              <option disabled value="">
                {t("chooseCountry")}
              </option>
              {i18n.language === "ar"
                ? countries.sort().map((cntry, index) => (
                  <option key={index} value={cntry.nameEn}>
                    {cntry.nameAr}
                  </option>
                ))
                : countriesEn.sort().map((cntry, index) => (
                  <option key={index} value={cntry}>
                    {cntry}
                  </option>
                ))}
              <option value="other">{t("other")}</option>
            </select>
          </div>

          {/* Option Selection */}
          <div className="space-y-2">
            <label className="block text-lg font-bold text-black">
              {t("option")}
            </label>
            <div
              style={{
                backgroundPosition:
                  i18n.language === "en"
                    ? "right 20px center"
                    : "left 20px center",
                backgroundSize: "10px",
                backgroundRepeat: "no-repeat",
              }}
              className="mt-1 opacity-70 pointer-events-none border border-black cursor-not-allowed appearance-none block w-full px-3 py-2 bg-[var(--Input)] rounded-md"
            >
              {courseDetails === "Group" ? t("group") : t("private")}
            </div>
          </div>
        </article>

        {/* takenTest Field */}
        <div className="flex gap-4">
          <input
            type="checkbox"
            id="taken"
            name="takenTest"
            checked={formData.takenTest}
            onChange={handleChange}
          />
          <label htmlFor="taken">{t("takenTest")}</label>
        </div>
        {/* Submit and Back buttons */}
        <div className="flex flex-col gap-y-6 items-end md:flex-row md:justify-between mt-12 col-span-1 md:col-span-2">
          <button
            data-aos="fade-up-right"
            type="button"
            className="p-4 px-8 rounded-3xl border-2 border-[var(--Yellow)]"
            onClick={() => {
              window.history.back();
              window.scroll(0, 0);
            }}
          >
            {t("back")}
          </button>
          <div className="">
            <h1 className=" text-center  text-xl mb-2">{t("payment")}</h1>
            <div className="flex gap-2">
              <button
                data-aos="fade-up-left"
                type="button"
                disabled={loading}
                onClick={applePay}
                className={` disabled:opacity-50 disabled:pointer-events-none lg:hidden p-4 px-9 rounded-3xl bg-[var(--Yellow)]`}
              >
                <FaApple size={25} />
              </button>
              <button
                data-aos="fade-up-left"
                type="button"
                disabled={loading}
                onClick={initiatePayment}
                className={` disabled:opacity-50 disabled:pointer-events-none p-4 px-9 rounded-3xl bg-[var(--Yellow)]`}
              >
                <IoCardSharp size={25} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default AppForm;
