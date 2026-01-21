import { useTranslation } from "../../node_modules/react-i18next";
import { useParams } from "react-router-dom";
import { FaApple } from "react-icons/fa";
import { IoCardSharp } from "react-icons/io5";
import { useGetpackageById } from "@/hooks/Actions/packages/usePackageCruds";
import Option from "@/Components/Option";
import { useFormik } from "formik";
import { bookingApplicationValidationSchema } from "@/Validation";
import { useCreatePayment } from "@/hooks/Actions/payment/useCurdsPayment";
import useCurrencyExchange from "@/hooks/useCurrencyExchange";

const AppForm = () => {
  const { id: packageId, clientCurrency } = useParams();
  const { t, i18n } = useTranslation();
  const EN = i18n.language === "en";

  const { convert } = useCurrencyExchange();

  const { data: packData } = useGetpackageById({ id: packageId });
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
      // takenTest: false,
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
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)] transition-colors ${(formik.touched.name || formik.submitCount > 0) &&
                        formik.errors.name
                        ? "border-red-500"
                        : "border-gray-200"
                      }`}
                    placeholder={t("enterName") || "Enter your name"}
                  />
                  {(formik.touched.name || formik.submitCount > 0) &&
                    formik.errors.name ? (
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
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)] transition-colors ${(formik.touched.email || formik.submitCount > 0) &&
                        formik.errors.email
                        ? "border-red-500"
                        : "border-gray-200"
                      }`}
                    placeholder={t("enterEmail") || "Enter your email"}
                  />
                  {(formik.touched.email || formik.submitCount > 0) &&
                    formik.errors.email ? (
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
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)] transition-colors ${(formik.touched.phoneNumber || formik.submitCount > 0) &&
                        formik.errors.phoneNumber
                        ? "border-red-500"
                        : "border-gray-200"
                      }`}
                    placeholder={
                      t("enterPhoneNumber") || "Enter your phone number"
                    }
                  />
                  {(formik.touched.phoneNumber || formik.submitCount > 0) &&
                    formik.errors.phoneNumber ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.phoneNumber}
                    </div>
                  ) : null}
                </div>

                {/* Country Field */}
                <div className="space-y-2">
                  <label className="block text-base font-semibold text-gray-700">
                    {t("country")} *
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.country}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)] transition-colors border-gray-200`}
                    placeholder={t("enterCountry") || "Egypt"}
                  />
                </div>
              </div>
            </div>

            {/* Checkbox Section */}
            {/* <div className="flex items-start gap-3 pt-4">
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
            </div> */}

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
