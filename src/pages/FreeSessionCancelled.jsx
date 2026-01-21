import React, { useEffect } from "react";
import { useTranslation } from "../../node_modules/react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

const FreeSessionCancelled = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get booking details from URL parameters
  const bookingId = searchParams.get("bookingId");
  const name = searchParams.get("name");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleBookAgain = () => {
    navigate("/free-session");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center">
        {/* Cancellation Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-12 h-12 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Cancellation Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-600 mb-4">
          {t("bookingCancelled")}
        </h1>

        {/* Cancellation Message */}
        <div className="space-y-4 mb-8">
          <p className="text-lg text-[var(--SubText)] leading-relaxed">
            {name
              ? t("bookingCancelledFor", { name })
              : t("bookingCancelledGeneric")}
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <svg
                className="w-6 h-6 text-gray-500 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">
                  {t("cancellationComplete")}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {t("slotAvailableForOthers")}
                </p>
              </div>
            </div>
          </div>

          {/* We Miss You Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mt-6">
            <h3 className="font-semibold text-yellow-800 mb-3">
              {t("weMissYou")}
            </h3>
            <p className="text-yellow-700 text-sm">{t("hopeToSeeYouAgain")}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleBackToHome}
            className="px-8 py-3 rounded-2xl border-2 border-gray-400 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            {t("backToHome")}
          </button>

          <button
            onClick={handleBookAgain}
            className="px-8 py-3 rounded-2xl bg-[var(--Yellow)] text-white hover:bg-opacity-90 transition-colors font-medium"
          >
            {t("bookAnotherSession")}
          </button>
        </div>

        {/* Support Contact */}
        {/* <div className="mt-8 pt-6 border-t border-[var(--Input)]">
          <p className="text-sm text-[var(--SubText)]">
            {t("changeYourMind")}{" "}
            <a
              href="mailto:support@yourcompany.com"
              className="text-[var(--Yellow)] hover:underline font-medium"
            >
              {t("contactSupport")}
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default FreeSessionCancelled;
