import React, { useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import cntris from "../data/Countries.json";
import { freeSessionValidationSchema } from "@/Validation";
import FreeSessionCalendar from "@/Components/FreeSessionCalendar";
import { formatDate } from "@/utilities/formatDateForApi";
import { useCreateBooking } from "@/hooks/Actions/free-sessions/useFreeSessionBookingCruds";

const FreeSessionForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [selectedSlot, setSelectedSlot] = useState(null);
  const { mutate: createBooking, isPending: isBookingPending } =
    useCreateBooking();

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    formik.setFieldValue("freeSessionSlotId", slot._id);
  };

  const handleSubmit = (data) => {
    createBooking(data, {
      onSuccess: () => {
        // navigate("/free-session/success");
      },
    });
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
    validationSchema: freeSessionValidationSchema(t),
    onSubmit: async (values) => {
      const userData = {
        ...values,
      };

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
    return `${formatDate(startDate)}   --   ${startDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${endDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <section className="md:px-40 px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-[var(--Main)]">
        {t("bookFreeSession")}
      </h2>

      {/* Step 1: Calendar View */}
      {!selectedSlot && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-[var(--Main)] mb-4">
            {t("selectDateAndTime")}
          </h3>
          <FreeSessionCalendar onSlotSelect={handleSlotSelect} />
        </div>
      )}

      {/* Step 2: Booking Form */}
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
            className={`mt-1 block w-full px-3 py-2 bg-[var(--Input)] rounded-md border ${
              formik.touched.name && formik.errors.name
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
            className={`mt-1 block w-full px-3 py-2 bg-[var(--Input)] rounded-md border ${
              formik.touched.email && formik.errors.email
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

        {/* Phone Number Field */}
        <div className="space-y-2">
          <label
            htmlFor="phoneNumber"
            className="block text-lg font-bold text-[var(--Main)]"
          >
            {t("phoneNumber")}
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phoneNumber}
            className={`mt-1 block w-full px-3 py-2 bg-[var(--Input)] rounded-md border ${
              formik.touched.phoneNumber && formik.errors.phoneNumber
                ? "border-red-500"
                : "border-transparent"
            }`}
            placeholder={t("enterPhoneNumber")}
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.phoneNumber}
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.country}
            className={`mt-1 appearance-none block w-full px-3 py-2 bg-[var(--Input)] rounded-md border ${
              formik.touched.country && formik.errors.country
                ? "border-red-500"
                : "border-transparent"
            }`}
          >
            <option value="">{t("chooseCountry")}</option>
            {i18n.language === "ar"
              ? countries.sort().map((country, index) => (
                  <option key={index} value={country.nameEn}>
                    {country.nameAr}
                  </option>
                ))
              : countries
                  .map((cnt) => cnt.nameEn)
                  .sort()
                  .map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
          </select>
          {formik.touched.country && formik.errors.country && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.country}
            </div>
          )}
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
            className={`mt-1 block w-full px-3 py-2 bg-[var(--Input)] rounded-md border ${
              formik.touched.age && formik.errors.age
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
            disabled={formik.isSubmitting}
            className="px-8 py-3 rounded-3xl bg-[var(--Yellow)] text-white hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? t("booking") : t("bookSession")}
          </button>
        </div>
      </form>
    </section>
  );
};

export default FreeSessionForm;
