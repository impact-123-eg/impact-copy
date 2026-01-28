import { useEffect, useState } from "react";
import { useTranslation } from "../../node_modules/react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import cntris from "../data/Countries.json";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { db, collection, addDoc } from "../data/firebaseConfig";
import { serverTimestamp } from "firebase/firestore";
import vector from "../assets/arrowvector.png";
import { Toaster } from "react-hot-toast";

const FreeTest = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    country: "",
    option: "",
  });

  useEffect(() => {
    if (location.state) {
      setFormData((prevState) => ({
        ...prevState,
        option: location.state.option || "",
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // const textAlignment = i18n.language === 'ar' ? 'text-right' : 'text-left';
  const countries = cntris;
  const countriesAr = countries.map((cnt) => cnt.nameAr);
  const countriesEn = countries.map((cnt) => cnt.nameEn);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.option ||
      !formData.phoneNumber ||
      !formData.country
    ) {
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: t("pleaseFillAllFields"),
        timer: 1000,
        showConfirmButton: false,
      });
      return;
    }
    setIsSubmitting(true); // Disable the button while submitting

    try {
      const docRef = await addDoc(collection(db, "Requests"), {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        country: formData.country,
        option: formData.option,
        status: "success",
        createdAt: serverTimestamp(), // Adds a timestamp
      });

      toast.success(t("applicationSuccess"), {
        duration: 2000,
        position: "top-center",
        style: {
          background: "var(--Light)",
          color: "black",
          padding: "16px",
          width: "auto",
          borderRadius: "9999px",
          maxWidth: "80%",
          textAlign: "center",
        },
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
      window.scroll(0, 0);
    } catch (e) {
      console.error("Error adding document: ", e);
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: t("somethingwrong"),
        timer: 1000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <section className="md:px-40 px-4">
      <Toaster />
      <h2 className="text-3xl font-bold mb-10 my-4">{t("applicationForm")}</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Name Field */}
        <div
          data-aos="fade-right"
          data-aos-duration="2000"
          className="space-y-2"
        >
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
        <div
          data-aos="fade-left"
          data-aos-duration="2000"
          className="space-y-2"
        >
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

        {/* Phone Number Field */}
        <div
          data-aos="fade-right"
          data-aos-duration="2000"
          className="space-y-2"
        >
          <label className="block text-lg font-bold text-black">
            {t("phoneNumber")}
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 bg-[var(--Input)] rounded-md `}
            placeholder={t("enterPhoneNumber")}
          />
        </div>

        {/* Country Selection */}
        <div
          data-aos="fade-left"
          data-aos-duration="2000"
          className="space-y-2"
        >
          <label className="block text-lg font-bold text-black">
            {t("country")}
          </label>
          <select
            name="country"
            value={formData.countriesEn}
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
              : countriesEn
                .sort()
                .map((cntry, index) => <option key={index}>{cntry}</option>)}
            <option value="other">{t("other")}</option>
          </select>
        </div>

        {/* Option Field */}
        <div
          data-aos="fade-right"
          data-aos-duration="2000"
          className="space-y-2"
        >
          <label className="block text-lg font-bold text-black">
            {t("option")}
          </label>
          <select
            name="option"
            value={formData.option}
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
              {t("chooseOption")}
            </option>
            <option value="Free Session">{t("freeSess")}</option>
            <option value="Free Test">{t("freeTest")}</option>
          </select>
        </div>

        {/* Submit and Back buttons */}
        <div className="flex gap-y-6 items-end justify-between mt-12 col-span-1 md:col-span-2">
          <button
            data-aos="fade-up-right"
            type="button"
            className="p-4 px-8 rounded-3xl border-2 border-[var(--Yellow)]"
            onClick={() => {
              navigate(-1);
              window.scroll(0, 0);
            }}
          >
            {t("back")}
          </button>
          <button
            data-aos="fade-up-left"
            type="submit"
            className="p-4 px-8 rounded-3xl bg-[var(--Yellow)]"
            disabled={isSubmitting} // Disable the button when isSubmitting is true
          >
            {isSubmitting ? t("submit") : t("submit")}
          </button>
        </div>
      </form>
    </section>
  );
};

export default FreeTest;
