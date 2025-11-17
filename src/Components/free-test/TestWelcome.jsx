// components/free-test/TestWelcome.jsx (UPDATED)
import React from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import cntris from "@/data/Countries.json";

const TestWelcome = ({
  onStartTest,
  isLoading,
  error,
  clearError,
  existingTest,
}) => {
  const { t, i18n } = useTranslation();

  const validationSchema = Yup.object({
    name: Yup.string().required(t("freeTest.errors.nameRequired")),
    email: Yup.string()
      .email(t("freeTest.errors.invalidEmail"))
      .required(t("freeTest.errors.emailRequired")),
    phoneNumber: Yup.string().required(t("freeTest.errors.phoneRequired")),
    country: Yup.string().required(t("freeTest.errors.countryRequired")),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      country: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await onStartTest(values);
    },
  });

  React.useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formik.values, error, clearError]);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-[var(--Yellow)] rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">{existingTest ? "↻" : "🎯"}</span>
        </div>
        <h1 className="text-3xl font-bold text-[var(--Main)] mb-4">
          {existingTest
            ? t("freeTest.welcome.continueTest")
            : t("freeTest.welcome.title")}
        </h1>
        <p className="text-lg text-[var(--SubText)] leading-relaxed">
          {existingTest
            ? t("freeTest.welcome.continueTestDescription")
            : t("freeTest.welcome.description")}
        </p>

        {existingTest && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              {t("freeTest.welcome.continueTestNote")}
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-red-700 text-sm">{error}</p>
              {error.includes("already completed") && (
                <div className="mt-2">
                  <button
                    onClick={() => (window.location.href = "/contact")}
                    className="text-red-600 hover:text-red-800 text-sm underline"
                  >
                    {t("freeTest.welcome.contactSupport")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Benefits - Only show for new tests */}
      {!existingTest && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">⏱️</div>
            <h3 className="font-semibold text-[var(--Main)] mb-1">
              {t("freeTest.welcome.quick")}
            </h3>
            <p className="text-sm text-[var(--SubText)]">
              {t("freeTest.welcome.minutes")}
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-[var(--Main)] mb-1">
              {t("freeTest.welcome.accurate")}
            </h3>
            <p className="text-sm text-[var(--SubText)]">
              {t("freeTest.welcome.levelDetection")}
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-2">🎁</div>
            <h3 className="font-semibold text-[var(--Main)] mb-1">
              {t("freeTest.welcome.free")}
            </h3>
            <p className="text-sm text-[var(--SubText)]">
              {t("freeTest.welcome.noCost")}
            </p>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              {t("freeTest.form.name")} *
            </label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--Yellow)] focus:border-transparent ${
                formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : "border-[var(--Input)]"
              }`}
              placeholder={t("freeTest.form.enterName")}
              disabled={existingTest}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.name}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              {t("freeTest.form.email")} *
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--Yellow)] focus:border-transparent ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-[var(--Input)]"
              }`}
              placeholder={t("freeTest.form.enterEmail")}
              disabled={existingTest}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              {t("freeTest.form.phoneNumber")} *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--Yellow)] focus:border-transparent ${
                formik.touched.phoneNumber && formik.errors.phoneNumber
                  ? "border-red-500"
                  : "border-[var(--Input)]"
              }`}
              placeholder={t("freeTest.form.enterPhoneNumber")}
              disabled={existingTest}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.phoneNumber}
              </div>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              {t("freeTest.form.country")} *
            </label>
            <select
              name="country"
              value={formik.values.country}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--Yellow)] focus:border-transparent ${
                formik.touched.country && formik.errors.country
                  ? "border-red-500"
                  : "border-[var(--Input)]"
              }`}
              disabled={existingTest}
            >
              <option value="">{t("freeTest.form.chooseCountry")}</option>
              {cntris.map((country) => (
                <option key={country.nameEn} value={country.nameEn}>
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
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={formik.isSubmitting || isLoading}
          className="w-full py-4 bg-[var(--Yellow)] text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? t("freeTest.welcome.startingTest")
            : existingTest
            ? t("freeTest.welcome.continueTest")
            : t("freeTest.welcome.startTestNow")}
        </button>

        {/* Privacy Note */}
        <p className="text-center text-sm text-[var(--SubText)]">
          {t("freeTest.welcome.privacyNote")}
        </p>
      </form>
    </div>
  );
};

export default TestWelcome;
