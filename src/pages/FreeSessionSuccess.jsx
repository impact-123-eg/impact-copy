// pages/FreeSessionSuccess.jsx
import React, { useEffect } from "react";
import { useTranslation } from "../../node_modules/react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const FreeSessionSuccess = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Get booking details from location state (if available)
  const bookingDetails = location.state?.booking || {};

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleBackToHome = () => {
    navigate("/");
  };

  // const handleViewBookings = () => {
  //   // Navigate to user's bookings page if you have one
  //   navigate("/my-bookings");
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--Light)] to-white flex items-center justify-center px-4 py-8">
      <Toaster />

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
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--Main)] mb-4">
          {t("bookingSubmitted")}
        </h1>

        {/* Success Message */}
        <div className={`space-y-4 mb-8`}>
          <p className="text-lg text-[var(--SubText)] leading-relaxed">
            {t("bookingPendingConfirmation")}
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
                  {t("checkYourEmail")}
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  {t("confirmationEmailSent")}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Details (if available) */}
          {/* {bookingDetails && (
            <div className="bg-[var(--Light)] rounded-2xl p-6 mt-6">
              <h3 className="font-semibold text-[var(--Main)] mb-3">
                {t("bookingDetails")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {bookingDetails.name && (
                  <div>
                    <span className="text-[var(--SubText)]">{t("name")}: </span>
                    <span className="font-medium text-[var(--Main)]">
                      {bookingDetails.name}
                    </span>
                  </div>
                )}
                {bookingDetails.email && (
                  <div>
                    <span className="text-[var(--SubText)]">
                      {t("email")}:{" "}
                    </span>
                    <span className="font-medium text-[var(--Main)]">
                      {bookingDetails.email}
                    </span>
                  </div>
                )}
                {bookingDetails.sessionTime && (
                  <div className={`sm:col-span-2 `}>
                    <span className="text-[var(--SubText)]">
                      {t("sessionTime")}:{" "}
                    </span>
                    <span className="font-medium text-[var(--Main)]">
                      {bookingDetails.sessionTime}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )} */}

          {/* Important Notes */}
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
              <div className="flex-1">
                <p className="text-yellow-800 font-medium mb-2">
                  {t("important")}
                </p>
                <ul className="text-yellow-700 text-sm space-y-1 list-disc list-inside">
                  <li>{t("checkSpamFolder")}</li>
                  <li>{t("confirmWithin24Hours")}</li>
                  <li>{t("contactSupportIfNoEmail")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleBackToHome}
            className="px-8 py-3 rounded-2xl border-2 border-[var(--Yellow)] text-[var(--Main)] hover:bg-[var(--Light)] transition-colors font-medium"
          >
            {t("backToHome")}
          </button>

          <button
            onClick={() => navigate("/free-test")}
            className="px-8 py-3 rounded-2xl bg-[var(--Yellow)] text-white hover:bg-opacity-90 transition-colors font-medium"
          >
            {t("BookFreeTest")}
          </button>
        </div>

        {/* Support Contact */}
        {/* <div className={`mt-8 pt-6 border-t border-[var(--Input)]`}>
          <p className="text-sm text-[var(--SubText)]">
            {t("needHelp")}{" "}
            <a
              href="mailto:support@youcompany.com"
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

export default FreeSessionSuccess;
