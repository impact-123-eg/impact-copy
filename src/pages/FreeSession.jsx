import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useTranslation } from "../../node_modules/react-i18next";
import { useNavigate } from "react-router-dom";
import cntris from "../data/Countries.json";
import axios from "axios";
import { freeSessionValidationSchema, freeSessionPersonalSchema } from "@/Validation";
import FreeSessionCalendar from "@/Components/FreeSessionCalendar";
import { formatDate } from "@/utilities/formatDateForApi";
import { useCreateBooking } from "@/hooks/Actions/free-sessions/useFreeSessionBookingCruds";

const FreeSessionForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const AR = i18n.language === "ar";

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState(1); // 1: Form, 2: Calendar
  const [loadingIp, setLoadingIp] = useState(false);
  const { mutate: createBooking } = useCreateBooking();

  // Fetch Country & Code on Mount
  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoadingIp(true);
        const res = await axios.get("https://ipapi.co/json/");
        const { country_name, country_calling_code } = res.data;

        if (country_name) {
          // Try to find exact match in our list
          const matched = cntris.find(
            (c) => c.nameEn.toLowerCase() === country_name.toLowerCase()
          );
          if (matched) {
            formik.setFieldValue(
              "country",
              i18n.language === "ar" ? matched.nameAr : matched.nameEn
            );
          }
        }



      } catch (err) {
        console.error("Failed to fetch IP country", err);
      } finally {
        setLoadingIp(false);
      }
    };
    fetchCountry();
  }, [i18n.language]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    formik.setFieldValue("freeSessionSlotId", slot._id);
  };

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      country: "",
      age: "",
      freeSessionSlotId: "",
      // freeTest: "", // Optional free test reference
    },
    validationSchema: step === 1 ? freeSessionPersonalSchema(t) : freeSessionValidationSchema(t),
    onSubmit: async (values) => {
      // If Step 1, validate and move to Step 2
      if (step === 1) {
        setStep(2);
        return;
      }

      const userData = {
        ...values,
      };
      const selectedCountry = countries.find(c => c.nameEn === values.country);
      if (selectedCountry && selectedCountry.code) {
        // Remove leading 0 if present in local number to avoid +20010...
        const localNumber = values.phoneNumber.startsWith("0") ? values.phoneNumber.substring(1) : values.phoneNumber;
        userData.phoneNumber = `${selectedCountry.code}${localNumber}`;
      }

      createBooking(
        { data: userData },
        {
          onSuccess: () => {
            navigate("/free-session/success");
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

  return (
    <section className="md:px-40 px-4 py-8">
      <h2 className="text-3xl font-bold mb-2  text-[var(--Main)]">
        {t("bookFreeSession")}
      </h2>
      <p className="mb-8">{t("bookFreeSessionDesc")}</p>

      {/* Step 1: Form (Visible if step === 1 or we want to show it always and hide calendar? Requirements say reorder flow) */}
      {/* Design Update: Show Form First. If Step 1, Show Form. If Step 2, Show Calendar but maybe keep Form visible read-only or hidden? 
         "Lead Data Form" -> "Calendar: Show dates after form is valid" implies sequential.
      */}

      {step === 1 && (
        <form
          onSubmit={formik.handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Name Field */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-lg font-bold text-[var(--Main)]"
            >
              {t("name")}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className={`mt-1 block w-full px-3 py-2 bg-[var(--Input)] rounded-md border ${formik.touched.name && formik.errors.name
                ? "border-red-500"
                : "border-transparent"
                }`}
              placeholder={t("enterName")}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.name}
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-lg font-bold text-[var(--Main)]"
            >
              {t("email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`mt-1 block w-full px-3 py-2 bg-[var(--Input)] rounded-md border ${formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "border-transparent"
                }`}
              placeholder={t("enterEmail")}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Country Selection */}
          <div className="space-y-2">
            <label
              htmlFor="country"
              className="block text-lg font-bold text-[var(--Main)]"
            >
              {t("country")}
            </label>
            <select
              id="country"
              name="country"
              onChange={(e) => {
                formik.handleChange(e);
                const matched = countries.find(c => c.nameEn === e.target.value);
                if (matched && matched.code) {
                  // Update the phone input prefix automatically logic can be handled here or just in render
                  // But formik.values.phoneNumber holds the FULL number usually?
                  // User asked for "prefix not editable".
                  // Let's assume we store JUST the local part in a separate field? 
                  // Or we can just update the code?
                  // Let's look up the code for the selected country
                }
              }}
              onBlur={formik.handleBlur}
              value={formik.values.country}
              disabled={loadingIp}
              className={`mt-1 appearance-none block w-full px-3 py-2 bg-[var(--Input)] rounded-md border ${formik.touched.country && formik.errors.country
                ? "border-red-500"
                : "border-transparent"
                }`}
            >
              <option value="">{loadingIp ? t("loading...") : t("chooseCountry")}</option>
              {countries
                .sort((a, b) => a.nameEn.localeCompare(b.nameEn))
                .map((country, index) => (
                  <option key={index} value={country.nameEn}>
                    {i18n.language === "ar" ? country.nameAr : country.nameEn}
                  </option>
                ))}
            </select>
            {formik.touched.country && formik.errors.country && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.country}
              </div>
            )}
          </div>

          {/* Age Selection (Moved up to match grid better maybe? No keeping order) */}

          {/* Phone Number Field - SPLIT */}
          <div className="space-y-2">
            <label
              htmlFor="phoneNumber"
              className="block text-lg font-bold text-[var(--Main)]"
            >
              {t("phoneNumber")}
            </label>
            <div dir="ltr" className="flex gap-2">
              {/* Prefix Box */}
              <div className="w-24 flex-shrink-0 bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center text-gray-600 font-bold select-none cursor-not-allowed">
                {(() => {
                  const c = countries.find(cnt => cnt.nameEn === formik.values.country);
                  return c ? c.code : "+..";
                })()}
              </div>
              {/* Local Number Input */}
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phoneNumber}
                className={`flex-1 block w-full px-3 py-2 bg-[var(--Input)] rounded-md border ${formik.touched.phoneNumber && formik.errors.phoneNumber
                  ? "border-red-500"
                  : "border-transparent"
                  }`}
                placeholder={t("enterPhoneNumber") || "123456789"}
              />
            </div>
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.phoneNumber}
              </div>
            )}
            <p className="text-xs text-gray-400">
              {t("enterNumberWithoutPrefix", { defaultValue: "Enter number without country code" })}
            </p>
          </div>

          {/* Age Selection */}
          <div className="space-y-2">
            <label
              htmlFor="age"
              className="block text-lg font-bold text-[var(--Main)]"
            >
              {t("age")}
            </label>
            <select
              id="age"
              name="age"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.age}
              className={`mt-1 block w-full px-3 py-2 bg-[var(--Input)] rounded-md border ${formik.touched.age && formik.errors.age
                ? "border-red-500"
                : "border-transparent"
                }`}
            >
              <option value="">{t("chooseAge")}</option>
              <option value="kid">{t("kid")}</option>
              <option value="teen">{t("teen")}</option>
              <option value="adult">{t("adult")}</option>
            </select>
            {formik.touched.age && formik.errors.age && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.age}</div>
            )}
          </div>

          {/* Submit and Back buttons - Full Width */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center md:col-span-2 mt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 font-bold rounded-3xl border-2 border-[var(--Yellow)] text-[var(--Main)] hover:bg-[var(--Light)] transition-colors"
            >
              {t("back")}
            </button>
            <button
              type="submit"
              // disabled={formik.isSubmitting} // Removing disabled so we can trigger validation
              className="px-8 py-3 rounded-3xl bg-[var(--Yellow)] text-white hover:bg-opacity-90 transition-colors"
            >
              {t("nextStep") || "Show Available Sessions"}
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Calendar View */}
      {step === 2 && (
        <div className="mb-8 fade-in">
          {/* Summary of Data */}
          <div className="mb-6 p-4 bg-[var(--Light)] rounded-lg flex justify-between items-center">
            <div>
              <p className="text-[var(--Main)] font-bold">{formik.values.name}</p>
              <p className="text-sm text-[var(--SubText)]">{formik.values.email}</p>
            </div>
            <button onClick={() => setStep(1)} className="text-[var(--Yellow)] underline text-sm">
              {t("edit")}
            </button>
          </div>

          {!selectedSlot && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[var(--Main)] mb-4">
                {t("selectDateAndTime")}
              </h3>
              <FreeSessionCalendar onSlotSelect={handleSlotSelect} />
            </div>
          )}

          {selectedSlot && (
            <div className="bg-[var(--Light)] p-6 rounded-xl shadow-sm mb-6 border border-[var(--Input)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[var(--Main)] ">
                  {t("selectedSlot")}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedSlot(null)}
                  className="px-4 py-2 text-base underline underline-offset-8 font-bold text-[var(--Main)] hover:text-[var(--Yellow)] transition-colors duration-200"
                >
                  {t("changeSlot")}
                </button>
              </div>
              <div className="flex items-center justify-center gap-3 bg-[var(--Main)] text-white rounded-lg px-4 py-2">
                <p className="font-medium" dir="ltr">
                  {formatTimeSlot(selectedSlot)}
                </p>
              </div>
            </div>
          )}

          {/* Final Submit and Back Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(1)}
              className="px-8 py-3 font-bold rounded-3xl border-2 border-[var(--Yellow)] text-[var(--Main)] hover:bg-[var(--Light)] transition-colors"
            >
              {t("back")}
            </button>
            <button
              disabled={!selectedSlot || formik.isSubmitting}
              onClick={formik.handleSubmit}
              className="px-8 py-3 rounded-3xl bg-[var(--Yellow)] text-white hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? t("booking") : t("confirmBooking")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default FreeSessionForm;
