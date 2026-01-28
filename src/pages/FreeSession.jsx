import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import { useI18n } from "../hooks/useI18n";
import { useCreateBooking } from "@/hooks/Actions/free-sessions/useFreeSessionBookingCruds";
import { freeSessionPersonalSchema, freeSessionValidationSchema } from "@/Validation";
import cntris from "@/data/Countries.json";
import { formatDate } from "@/utilities/formatDateForApi";
import FreeSessionCalendar from "@/Components/FreeSessionCalendar";
import SEO from "@/Components/SEO";
import { useAuth } from "@/context/AuthContext";

const FreeSessionForm = () => {
  const { t, currentLocale, initialize, loading: i18nLoading, localizePath } = useI18n();
  const navigate = useNavigate();
  const AR = currentLocale === "ar";

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState(1);
  const [loadingIp, setLoadingIp] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const { mutate: createBooking } = useCreateBooking();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoadingIp(true);
        const res = await axios.get("https://ipapi.co/json/");
        const { country_name } = res.data;

        if (country_name) {
          const matched = cntris.find(
            (c) => c.nameEn.toLowerCase() === country_name.toLowerCase()
          );
          if (matched) {
            formik.setFieldValue("country", matched.nameEn);
          }
        }
      } catch (err) {
        console.error("Failed to fetch IP country", err);
      } finally {
        setLoadingIp(false);
      }
    };
    fetchCountry();
  }, [currentLocale]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    formik.setFieldValue("freeSessionSlotId", slot._id);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: user?.phoneNumber || "",
      country: "",
      age: "",
      password: "",
      freeSessionSlotId: "",
    },
    validationSchema: step === 1 ? freeSessionPersonalSchema(t) : freeSessionValidationSchema(t),
    onSubmit: async (values) => {
      if (step === 1) {
        setStep(2);
        return;
      }

      const userData = { ...values };
      const selectedCountry = countries.find(c => c.nameEn === values.country);
      if (selectedCountry && selectedCountry.code) {
        const localNumber = values.phoneNumber.startsWith("0") ? values.phoneNumber.substring(1) : values.phoneNumber;
        userData.phoneNumber = `${selectedCountry.code}${localNumber}`;
      }

      createBooking(
        { data: userData },
        {
          onSuccess: () => {
            navigate(localizePath("/free-session/success"));
          },
        }
      );
    },
  });

  const countries = cntris;

  const formatTimeSlot = (slot) => {
    const startDate = new Date(slot.startTime);
    const endDate = new Date(slot.endTime);
    const locale = AR ? "ar-EG" : undefined;
    const dateLabel = AR
      ? startDate.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      })
      : formatDate(startDate);
    const startTime = startDate.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTime = endDate.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateLabel}   --  ( ${startTime} - ${endTime} )`;
  };

  if (i18nLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--Yellow)]"></div>
      </div>
    );
  }

  return (
    <section className="md:px-40 px-4 py-8">
      <SEO
        title={t("free-session", "bookFreeSession", "Book a Free Session")}
        description="Join a free trial English session with our expert instructors. Experience our teaching style and start your journey today."
      />
      <h2 className="text-3xl font-bold mb-2  text-[var(--Main)]">
        {t("free-session", "bookFreeSession", "Book a Free Session")}
      </h2>
      <p className="mb-8">{t("free-session", "bookFreeSessionDesc")}</p>

      {step === 1 && (
        <form
          onSubmit={formik.handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-2">
            <label htmlFor="name" className="block text-lg font-bold text-[var(--Main)]">
              {t("free-session", "name", "Name")}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className={`mt-1 block w-full px-3 py-2 bg-[var(--Input)] rounded-md border ${formik.touched.name && formik.errors.name ? "border-red-500" : "border-transparent"}`}
              placeholder={t("free-session", "enterName", "Enter your name")}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-lg font-bold text-[var(--Main)]">
              {t("free-session", "email", "Email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`mt-1 block w-full px-3 py-2 bg-[var(--Input)] rounded-md border ${formik.touched.email && formik.errors.email ? "border-red-500" : "border-transparent"}`}
              placeholder={t("free-session", "enterEmail", "Enter your email")}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="country" className="block text-lg font-bold text-[var(--Main)]">
              {t("free-session", "country", "Country")}
            </label>
            <select
              id="country"
              name="country"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.country}
              disabled={loadingIp}
              className={`mt-1 appearance-none block w-full px-3 py-2 bg-[var(--Input)] rounded-md border ${formik.touched.country && formik.errors.country ? "border-red-500" : "border-transparent"}`}
            >
              <option value="">{loadingIp ? t("general", "loading") : t("free-session", "chooseCountry", "Choose your country")}</option>
              {countries
                .sort((a, b) => a.nameEn.localeCompare(b.nameEn))
                .map((country, index) => (
                  <option key={index} value={country.nameEn}>
                    {AR ? country.nameAr : country.nameEn}
                  </option>
                ))}
            </select>
            {formik.touched.country && formik.errors.country && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.country}</div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="block text-lg font-bold text-[var(--Main)]">
              {t("free-session", "phoneNumber", "Phone Number")}
            </label>
            <div dir="ltr" className="flex gap-2">
              <div className="w-24 flex-shrink-0 bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center text-gray-600 font-bold select-none cursor-not-allowed">
                {(() => {
                  const c = countries.find(cnt => cnt.nameEn === formik.values.country);
                  return c ? c.code : "+..";
                })()}
              </div>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phoneNumber}
                className={`flex-1 block w-full px-3 py-2 bg-[var(--Input)] rounded-md border ${formik.touched.phoneNumber && formik.errors.phoneNumber ? "border-red-500" : "border-transparent"}`}
                placeholder={t("free-session", "enterPhoneNumber", "Enter your phone number")}
              />
            </div>
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.phoneNumber}</div>
            )}
            <p className="text-xs text-gray-400">
              {t("free-session", "enterNumberWithoutPrefix", "Enter number without country code")}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="age" className="block text-lg font-bold text-[var(--Main)]">
              {t("free-session", "age", "Age")}
            </label>
            <select
              id="age"
              name="age"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.age}
              className={`mt-1 block w-full px-3 py-2 bg-[var(--Input)] rounded-md border ${formik.touched.age && formik.errors.age ? "border-red-500" : "border-transparent"}`}
            >
              <option value="">{t("free-session", "chooseAge", "Choose your age")}</option>
              <option value="kid">{t("free-session", "kid", "Kid (6-12)")}</option>
              <option value="teen">{t("free-session", "teen", "Teen (13-17)")}</option>
              <option value="adult">{t("free-session", "adult", "Adult (18+)")}</option>
            </select>
            {formik.touched.age && formik.errors.age && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.age}</div>
            )}
          </div>

          {!isLoggedIn && (
            <div className="space-y-2">
              <label htmlFor="password" className="block text-lg font-bold text-[var(--Main)]">
                {t("free-session", "password", "Create Password")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={`mt-1 block w-full px-3 py-2 bg-[var(--Input)] rounded-md border ${formik.touched.password && formik.errors.password ? "border-red-500" : "border-transparent"}`}
                placeholder={t("free-session", "enterPassword", "Min 6 characters")}
              />
              <p className="text-xs text-gray-500">Provided password will be used to create your account.</p>
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center md:col-span-2 mt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 font-bold rounded-3xl border-2 border-[var(--Yellow)] text-[var(--Main)] hover:bg-[var(--Light)] transition-colors"
            >
              {t("general", "back", "Back")}
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-3xl bg-[var(--Yellow)] text-white hover:bg-opacity-90 transition-colors"
            >
              {t("free-session", "nextStep", "Show Available Sessions")}
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="mb-8 fade-in">
          <div className="mb-6 p-4 bg-[var(--Light)] rounded-lg flex justify-between items-center">
            <div>
              <p className="text-[var(--Main)] font-bold">{formik.values.name}</p>
              <p className="text-sm text-[var(--SubText)]">{formik.values.email}</p>
            </div>
            <button onClick={() => setStep(1)} className="text-[var(--Yellow)] underline text-sm">
              {t("free-session", "edit", "Edit")}
            </button>
          </div>

          {!selectedSlot && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[var(--Main)] mb-4">
                {t("free-session", "selectDateAndTime", "Select Date & Time")}
              </h3>
              <FreeSessionCalendar onSlotSelect={handleSlotSelect} />
            </div>
          )}

          {selectedSlot && (
            <div className="bg-[var(--Light)] p-6 rounded-xl shadow-sm mb-6 border border-[var(--Input)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[var(--Main)] ">
                  {t("free-session", "selectedSlot", "Selected Slot")}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedSlot(null)}
                  className="px-4 py-2 text-base underline underline-offset-8 font-bold text-[var(--Main)] hover:text-[var(--Yellow)] transition-colors duration-200"
                >
                  {t("free-session", "changeSlot", "Change Slot")}
                </button>
              </div>
              <div className="flex items-center justify-center gap-3 bg-[var(--Main)] text-white rounded-lg px-4 py-2">
                <p className="font-medium" dir="ltr">
                  {formatTimeSlot(selectedSlot)}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(1)}
              className="px-8 py-3 font-bold rounded-3xl border-2 border-[var(--Yellow)] text-[var(--Main)] hover:bg-[var(--Light)] transition-colors"
            >
              {t("general", "back", "Back")}
            </button>
            <button
              disabled={!selectedSlot || formik.isSubmitting}
              onClick={formik.handleSubmit}
              className="px-8 py-3 rounded-3xl bg-[var(--Yellow)] text-white hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? t("free-session", "booking", "Booking...") : t("free-session", "confirmBooking", "Confirm Booking")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default FreeSessionForm;
