import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useI18n } from "../hooks/useI18n";

const FreeSessionSuccess = () => {
  const { t, currentLocale, initialize, loading, localizePath } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    initialize();
    window.scrollTo(0, 0);
  }, [initialize]);

  const handleBackToHome = () => {
    navigate(localizePath("/"));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--Yellow)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--Light)] to-white flex items-center justify-center px-4 py-8">
      <Toaster />

      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-12 h-12 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--Main)] mb-4">
          {t("free-session", "bookingSubmitted", "Booking Submitted Successfully!")}
        </h1>

        <div className={`space-y-4 mb-8`}>
          <p className="text-lg text-[var(--SubText)] leading-relaxed">
            {t("free-session", "bookingPendingConfirmation")}
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <svg
                className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <div className={`flex-1`}>
                <p className="text-blue-800 font-medium">
                  {t("free-session", "checkYourEmail", "Check your email")}
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  {t("free-session", "confirmationEmailSent")}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mt-6`}
          >
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <svg
                className="w-6 h-6 text-yellow-500 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1 text-start">
                <p className="text-yellow-800 font-medium mb-2">
                  {t("free-session", "important", "Important")}
                </p>
                <ul className="text-yellow-700 text-sm space-y-1 list-disc list-inside">
                  <li>{t("free-session", "checkSpamFolder")}</li>
                  <li>{t("free-session", "confirmWithin24Hours")}</li>
                  <li>{t("free-session", "contactSupportIfNoEmail")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleBackToHome}
            className="px-8 py-3 rounded-2xl border-2 border-[var(--Yellow)] text-[var(--Main)] hover:bg-[var(--Light)] transition-colors font-medium"
          >
            {t("free-session", "backToHome", "Back to Home")}
          </button>

          <button
            onClick={() => navigate(localizePath("/free-test"))}
            className="px-8 py-3 rounded-2xl bg-[var(--Yellow)] text-white hover:bg-opacity-90 transition-colors font-medium"
          >
            {t("navbar", "BookFreeTest", "Book Free Test")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeSessionSuccess;
