import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import cntris from "../data/Countries.json";
import { db } from "../data/firebaseConfig";
import { useParams } from "react-router-dom";

import vector from "../assets/arrowvector.png";
import { FaApple } from "react-icons/fa";
import { IoCardSharp } from "react-icons/io5";
import { useGetpackageById } from "@/hooks/Actions/packages/usePackageCruds";
import Option from "@/Components/Option";
import { useFormik } from "formik";
import { bookingApplicationValidationSchema } from "@/Validation";

const AppForm = () => {
  const { id: packageId, clientCurrency } = useParams();
  const { t, i18n } = useTranslation();
  const EN = i18n.language === "en";

  const { data: packData } = useGetpackageById({ id: packageId });
  const coursePackage = packData?.data || {};

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      package: coursePackage?.category?._id || "",
      takenTest: false,
    },
    validationSchema: bookingApplicationValidationSchema(t),
    enableReinitiate: true,
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
      // Payment logic will be implemented here later
      const bookingData = {
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        package: coursePackage._id,
      };
      handleInitiatePayment();
    },
  });

  const handleInitiatePayment = () => {
    // Payment initiation logic will go here
  };

  const handleApplePay = async (e) => {
    e.preventDefault();
    // Implement Apple Pay logic here
  };

  return (
    <section className="md:px-20 lg:px-40 px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Form Section */}
        <div className="flex-1">
          {/* <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
            {t("applicationForm") || "Application Form"}
          </h2> */}

          <form onSubmit={formik.handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-gray-700">
                    {t("name")} *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)] transition-colors ${
                      formik.touched.name && formik.errors.name
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                    placeholder={t("enterName") || "Enter your name"}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.name}
                    </div>
                  ) : null}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-gray-700">
                    {t("email")} *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)] transition-colors ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                    placeholder={t("enterEmail") || "Enter your email"}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Phone Number Field */}
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-gray-700">
                    {t("phoneNumber")} *
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phoneNumber}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)] transition-colors ${
                      formik.touched.phoneNumber && formik.errors.phoneNumber
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                    placeholder={
                      t("enterPhoneNumber") || "Enter your phone number"
                    }
                  />
                  {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.phoneNumber}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Checkbox Section */}
            <div className="flex items-start gap-3 pt-4">
              <input
                type="checkbox"
                id="takenTest"
                name="takenTest"
                checked={formik.values.takenTest}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="cursor-pointer mt-1 w-5 h-5 text-[var(--Yellow)] bg-gray-100 border-gray-300 rounded focus:ring-[var(--Yellow)]"
              />
              <label htmlFor="takenTest" className="text-gray-700 text-base">
                {t("takenTest") || "I have taken the test"}
              </label>
            </div>

            {/* Button Section */}
            <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-200">
              <button
                type="button"
                className="px-8 py-3 rounded-xl border-2 border-[var(--Yellow)] text-[var(--Yellow)] font-medium hover:bg-[var(--Yellow)] hover:text-white transition-colors"
                onClick={() => window.history.back()}
              >
                {t("back") || "Back"}
              </button>

              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {t("payment") || "Payment"}
                </h3>
                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    disabled={!formik.isValid}
                    onClick={handleApplePay}
                    className="disabled:opacity-50 lg:hidden disabled:pointer-events-none p-3 rounded-xl bg-[var(--Yellow)] text-white hover:bg-yellow-600 transition-colors"
                  >
                    <FaApple size={22} />
                  </button>
                  <button
                    type="submit"
                    disabled={!formik.isValid}
                    className="disabled:opacity-50 disabled:pointer-events-none px-6 py-3 rounded-xl bg-[var(--Yellow)] text-white font-medium hover:bg-yellow-600 transition-colors flex items-center gap-2"
                  >
                    <IoCardSharp size={20} />
                    {/* <span>{t("payNow") || "Pay Now"}</span> */}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Option/Course Package Summary */}
        <div className="lg:w-96">
          <Option option={coursePackage} isBooking={true} />
        </div>
      </div>
    </section>
  );
};

export default AppForm;
