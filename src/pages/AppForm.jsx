import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { FaApple } from "react-icons/fa";
import { IoCardSharp } from "react-icons/io5";
import Option from "../Components/Option";
import { useI18n } from "../hooks/useI18n";
import { useGetpackageById } from "@/hooks/Actions/packages/usePackageCruds";
import { useCreatePayment } from "@/hooks/Actions/payment/useCurdsPayment";
import { useGetUserProfile } from "@/hooks/Actions/users/useCurdsUsers";
import useCurrencyExchange from "@/hooks/useCurrencyExchange";
import { bookingApplicationValidationSchema } from "@/Validation";

import { useAuth } from "../context/AuthContext";

const AppForm = () => {
  const { id: packageId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, initialize, loading: i18nLoading, currentLocale } = useI18n();
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();

  // Fetch fresh user profile to ensure we have all data (especially email)
  const { data: userProfileData, isPending: profileLoading } = useGetUserProfile();

  // Determine the active user object
  // API response structure seems to be { success: true, user: { ... } } based on logs
  // We check data.user first, then data.data (standard convention), then fallback to auth user
  const activeUser = userProfileData?.data?.user || userProfileData?.data?.data || user;

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate(`/${currentLocale}/login`, {
        state: { from: location.pathname },
      });
    }
  }, [authLoading, isLoggedIn, navigate, currentLocale, location]);

  const { convert } = useCurrencyExchange();

  const { data: packData, isLoading: packLoading } = useGetpackageById({
    id: packageId,
  });
  const coursePackage = packData?.data || {};
  const priceUSD = coursePackage?.priceAfter;
  const priceEGP = convert(priceUSD, "egp");

  const { mutate: createPayment, isPending: createPaymentPending } =
    useCreatePayment();

  const formik = useFormik({
    initialValues: {
      name: activeUser?.name || "",
      email: activeUser?.email || "",
      phoneNumber: activeUser?.phoneNumber || "01000000000",
      package: coursePackage?.category?._id || "",
      country: activeUser?.country || "EG",
      paymentMethod: "card",
    },
    enableReinitialize: true,
    validateOnMount: false,
    onSubmit: (values) => {
      const bookingData = {
        name: activeUser?.name || values.name,
        email: activeUser?.email || values.email,
        phoneNumber: activeUser?.phoneNumber || "01000000000",
        country: activeUser?.country || "EG",
        packageId: coursePackage._id,
        paymentMethod: values.paymentMethod || "card",
        priceEGP: priceEGP,
      };
      // Debug log to verify data being sent
      console.log("Submitting booking data:", bookingData);
      console.log("Active user data:", activeUser);

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

  if (i18nLoading || packLoading || authLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--Yellow)]"></div>
      </div>
    );
  }

  // If not logged in, we are redirecting, so return null or spinner
  if (!isLoggedIn) return null;

  return (
    <section className="md:px-20 lg:px-40 px-4 py-8 flex flex-col items-center gap-8">
      <div className="w-full max-w-md">
        <Option option={coursePackage} isBooking={true} />
      </div>

      <div className="w-full max-w-md">
        <form onSubmit={formik.handleSubmit} className="w-full">
          <div className="flex flex-col items-center gap-6 pt-4">
            <div className="text-center w-full space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {t("free-session", "payment", "Payment")}
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  disabled={createPaymentPending}
                  onClick={handleApplePay}
                  className="disabled:opacity-50 lg:hidden disabled:pointer-events-none p-4 rounded-xl bg-[var(--Yellow)] text-white hover:bg-yellow-600 transition-colors shadow-md hover:shadow-lg"
                >
                  <FaApple size={24} />
                </button>
                <button
                  type="submit"
                  disabled={createPaymentPending}
                  onClick={handleCardPay}
                  className="disabled:opacity-50 disabled:pointer-events-none px-8 py-3 rounded-xl bg-[var(--Yellow)] text-white font-medium hover:bg-yellow-600 transition-colors flex items-center gap-3 shadow-md hover:shadow-lg"
                >
                  <IoCardSharp size={24} />
                  <span>{t("general", "payNow", "Pay Now")}</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              className="px-6 py-2 rounded-lg text-gray-500 hover:text-gray-700 font-medium transition-colors"
              onClick={() => window.history.back()}
            >
              {t("general", "back", "Back")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AppForm;
