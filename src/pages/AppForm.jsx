import { useEffect } from "react";
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

import { useAuth } from "../context/AuthContext";
import { useValidatePromoCode, useGetAffiliateStats } from "@/hooks/Actions/affiliate/useAffiliate";
import { FaTag, FaWallet } from "react-icons/fa";
import { useState } from "react";
import Swal from "sweetalert2";

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

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [useBalance, setUseBalance] = useState(false);
  const { mutate: validatePromo, isPending: isValidatingPromo } = useValidatePromoCode();
  const { data: affiliateData } = useGetAffiliateStats();
  const balance = affiliateData?.data?.affiliateBalance || 0;

  const priceAfterPromo = appliedPromo
    ? priceEGP - (priceEGP * appliedPromo.discountPercentage / 100)
    : priceEGP;

  const balanceToUse = useBalance ? Math.min(balance, priceAfterPromo) : 0;
  const finalPriceEGP = priceAfterPromo - balanceToUse;

  const handleApplyPromo = () => {
    if (!promoCode) return;
    validatePromo(promoCode, {
      onSuccess: (data) => {
        setAppliedPromo(data);
        Swal.fire({
          icon: "success",
          title: t("affiliate", "applied", "Applied!"),
          text: `${data.discountPercentage}% discount applied`,
          timer: 1500,
          showConfirmButton: false,
        });
      },
      onError: (err) => {
        setAppliedPromo(null);
        Swal.fire({
          icon: "error",
          title: t("affiliate", "invalid", "Invalid"),
          text: err.response?.data?.message || "Invalid promo code",
        });
      }
    });
  };

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
        priceEGP: finalPriceEGP,
        promoCode: appliedPromo ? promoCode : undefined,
        useAffiliateBalance: useBalance,
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
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500">{t("general", "originalPrice", "Original Price")}</span>
              <span className={`font-semibold ${appliedPromo ? 'line-through text-gray-400' : ''}`}>{priceEGP} EGP</span>
            </div>
            {appliedPromo && (
              <div className="flex justify-between items-center mb-2 text-green-600 font-bold">
                <span>{t("affiliate", "discount", "Discount")} ({appliedPromo.discountPercentage}%)</span>
                <span>-{priceEGP * appliedPromo.discountPercentage / 100} EGP</span>
              </div>
            )}
            {useBalance && balanceToUse > 0 && (
              <div className="flex justify-between items-center mb-2 text-blue-600 font-bold">
                <span>{t("affiliate", "usedBalance", "Used Balance")}</span>
                <span>-{balanceToUse} EGP</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-bold text-gray-800">{t("general", "total", "Total")}</span>
              <span className="text-xl font-bold text-[var(--Yellow)]">{finalPriceEGP} EGP</span>
            </div>
          </div>

          {balance > 0 && (
            <div className={`mb-4 p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${useBalance ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`} onClick={() => setUseBalance(!useBalance)}>
              <div className="flex items-center gap-3 text-start">
                <div className={`p-2 rounded-lg ${useBalance ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <FaWallet />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">{t("affiliate", "wallet", "Affiliate Wallet")}</p>
                  <p className={`font-bold ${useBalance ? 'text-blue-700' : 'text-gray-700'}`}>{balance} EGP Available</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${useBalance ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                {useBalance && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </div>
          )}

          <div className="space-y-2 text-start">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <FaTag /> {t("affiliate", "promoCode", "Promo Code")}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                disabled={appliedPromo || isValidatingPromo}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none uppercase disabled:bg-gray-100"
                placeholder={t("affiliate", "enterCode", "ENTER CODE")}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              />
              {!appliedPromo ? (
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={!promoCode || isValidatingPromo}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors disabled:opacity-50"
                >
                  {isValidatingPromo ? "..." : t("general", "apply", "Apply")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { setAppliedPromo(null); setPromoCode(""); }}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  {t("general", "remove", "Remove")}
                </button>
              )}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 pt-4">
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

          <button
            type="button"
            className="px-6 py-2 rounded-lg text-gray-500 hover:text-gray-700 font-medium transition-colors mt-4"
            onClick={() => window.history.back()}
          >
            {t("general", "back", "Back")}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AppForm;
