// pages/FreeSessionConfirmed.jsx
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

const FreeSessionConfirmed = () => {
  const { t, i18n } = useTranslation();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center">
        {/* Success Icon */}
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

        {/* Success Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-green-600 mb-4">
          {t("bookingConfirmed")}
        </h1>

        {/* Success Message */}
        <div className="space-y-4 mb-8">
          <p className="text-lg text-[var(--SubText)] leading-relaxed">
            {name
              ? t("bookingConfirmedFor", { name })
              : t("bookingConfirmedGeneric")}
          </p>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <svg
                className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="text-green-800 font-medium">{t("allSet")}</p>
                <p className="text-green-600 text-sm mt-1">
                  {t("seeYouAtSession")}
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-6">
            <h3 className="font-semibold text-blue-800 mb-3">
              {t("whatsNext")}
            </h3>
            <ul className="text-blue-700 text-sm space-y-2 list-disc list-inside">
              {/* <li>{t("receiveReminder")}</li> */}
              <li>{t("joinOnTime")}</li>
              {/* <li>{t("bringMaterials")}</li> */}
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={handleBackToHome}
            className="px-8 py-3 rounded-2xl bg-green-600 text-white hover:bg-green-700 transition-colors font-medium"
          >
            {t("backToHome")}
          </button>
        </div>

        {/* Support Contact */}
        {/* <div className="mt-8 pt-6 border-t border-[var(--Input)]">
          <p className="text-sm text-[var(--SubText)]">
            {t("questionsAboutSession")}{" "}
            <a
              href="mailto:support@yourcompany.com"
              className="text-green-600 hover:underline font-medium"
            >
              {t("contactSupport")}
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default FreeSessionConfirmed;
