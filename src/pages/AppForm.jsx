import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { FaApple } from "react-icons/fa";
import { IoCardSharp } from "react-icons/io5";
import Option from "../Components/Option";
import { useI18n } from "../hooks/useI18n";
import { useGetpackageById } from "@/hooks/Actions/packages/usePackageCruds";
import { useCreatePayment } from "@/hooks/Actions/payment/useCurdsPayment";
import useCurrencyExchange from "@/hooks/useCurrencyExchange";
import { bookingApplicationValidationSchema } from "@/Validation";

const AppForm = () => {
  const { id: packageId } = useParams();
  const { t, initialize, loading: i18nLoading } = useI18n();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const { convert } = useCurrencyExchange();

  const { data: packData, isLoading: packLoading } = useGetpackageById({ id: packageId });
  const coursePackage = packData?.data || {};
  const priceUSD = coursePackage?.priceAfter;
  const priceEGP = convert(priceUSD, "egp");

  const { mutate: createPayment, isPending: createPaymentPending } =
    useCreatePayment();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      package: coursePackage?.category?._id || "",
      country: "EG",
      paymentMethod: "card",
    },
    validationSchema: bookingApplicationValidationSchema(t),
    enableReinitialize: true,
    validateOnMount: true,
    onSubmit: (values) => {
      const bookingData = {
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        country: values.country || "EG",
        packageId: coursePackage._id,
        paymentMethod: values.paymentMethod || "card",
        priceEGP: priceEGP,
      };
      createPayment(
        { data: bookingData },
        {
          onSuccess: (res) => {
            const url = res?.data?.checkoutUrl;
            if (url) window.location.href = url;
          },
        }
      );
    },
  });

  const handleCardPay = () => {
    formik.setFieldValue("paymentMethod", "card");
  };

  const handleApplePay = async (e) => {
    e.preventDefault();
    formik.setFieldValue("paymentMethod", "apple");
    formik.handleSubmit();
  };

  if (i18nLoading || packLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--Yellow)]"></div>
      </div>
    );
  }

  return (
    <section className="md:px-20 lg:px-40 px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        <div className="flex-1">
          <form onSubmit={formik.handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-gray-700">
                    {t("free-session", "name", "Name")} *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)] transition-colors ${(formik.touched.name || formik.submitCount > 0) &&
                      formik.errors.name
                      ? "border-red-500"
                      : "border-gray-200"
                      }`}
                    placeholder={t("free-session", "enterName", "Enter your name")}
                  />
                  {(formik.touched.name || formik.submitCount > 0) &&
                    formik.errors.name ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.name}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label className="block text-base font-semibold text-gray-700">
                    {t("free-session", "email", "Email")} *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)] transition-colors ${(formik.touched.email || formik.submitCount > 0) &&
                      formik.errors.email
                      ? "border-red-500"
                      : "border-gray-200"
                      }`}
                    placeholder={t("free-session", "enterEmail", "Enter your email")}
                  />
                  {(formik.touched.email || formik.submitCount > 0) &&
                    formik.errors.email ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-gray-700">
                    {t("free-session", "phoneNumber", "Phone Number")} *
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phoneNumber}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)] transition-colors ${(formik.touched.phoneNumber || formik.submitCount > 0) &&
                      formik.errors.phoneNumber
                      ? "border-red-500"
                      : "border-gray-200"
                      }`}
                    placeholder={
                      t("free-session", "enterPhoneNumber", "Enter your phone number")
                    }
                  />
                  {(formik.touched.phoneNumber || formik.submitCount > 0) &&
                    formik.errors.phoneNumber ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.phoneNumber}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label className="block text-base font-semibold text-gray-700">
                    {t("free-session", "country", "Country")} *
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.country}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)] transition-colors border-gray-200`}
                    placeholder={t("free-session", "enterCountry", "Egypt")}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-200">
              <button
                type="button"
                className="px-8 py-3 rounded-xl border-2 border-[var(--Yellow)] text-[var(--Yellow)] font-medium hover:bg-[var(--Yellow)] hover:text-white transition-colors"
                onClick={() => window.history.back()}
              >
                {t("general", "back", "Back")}
              </button>

              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {t("free-session", "payment", "Payment")}
                </h3>
                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    disabled={
                      !formik.isValid || !formik.dirty || createPaymentPending
                    }
                    onClick={handleApplePay}
                    className="disabled:opacity-50 lg:hidden disabled:pointer-events-none p-3 rounded-xl bg-[var(--Yellow)] text-white hover:bg-yellow-600 transition-colors"
                  >
                    <FaApple size={22} />
                  </button>
                  <button
                    type="submit"
                    disabled={
                      !formik.isValid || !formik.dirty || createPaymentPending
                    }
                    onClick={handleCardPay}
                    className="disabled:opacity-50 disabled:pointer-events-none px-6 py-3 rounded-xl bg-[var(--Yellow)] text-white font-medium hover:bg-yellow-600 transition-colors flex items-center gap-2"
                  >
                    <IoCardSharp size={20} />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="lg:w-96">
          <Option option={coursePackage} isBooking={true} />
        </div>
      </div>
    </section>
  );
};

export default AppForm;
