import { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGetPaymentStatus } from "@/hooks/Actions/payment/useCurdsPayment";
import { FaCheckCircle, FaTimesCircle, FaClock, FaTag, FaWallet } from "react-icons/fa";
import { useI18n } from "@/hooks/useI18n";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const PaymentResult = () => {
  const query = useQuery();
  const bookingId = query.get("bookingId");
  const { data, isPending, isFetching, error } =
    useGetPaymentStatus({
      bookingId,
      enabled: Boolean(bookingId),
      refetchInterval: 3000,
    });

  const { t, initialize, loading: i18nLoading } = useI18n();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const booking = data?.data?.booking;
  const loading = isPending || isFetching || i18nLoading;
  const errMsg = !bookingId ? "Missing bookingId" : error?.message || null;

  const title = loading
    ? t("free-session", "booking", "Processing...")
    : errMsg
      ? t("free-session", "error", "Unable to confirm payment")
      : booking?.paymentStatus === "paid"
        ? t("free-session", "bookingConfirmed", "Payment Successful")
        : booking?.paymentStatus === "failed" || booking?.status === "cancelled"
          ? t("free-session", "bookingCancelled", "Payment Failed")
          : t("free-session", "bookingPendingConfirmation", "Payment Pending");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--Yellow)]"></div>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-8 min-h-[60vh] flex flex-col justify-center">
      <div className="text-center space-y-4">
        {loading ? (
          <div className="flex justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--Yellow)]"></div></div>
        ) : booking?.paymentStatus === "paid" ? (
          <div className="flex justify-center text-green-500 scale-125"><FaCheckCircle size={64} /></div>
        ) : booking?.paymentStatus === "failed" || booking?.status === "cancelled" ? (
          <div className="flex justify-center text-red-500 scale-125"><FaTimesCircle size={64} /></div>
        ) : (
          <div className="flex justify-center text-amber-500 scale-125"><FaClock size={64} /></div>
        )}
        <h1 className="text-3xl font-black text-[var(--Main)]">{title}</h1>
        {booking?.paymentStatus === "paid" && (
          <p className="text-[var(--SubText)]">Thank you for your enrollment! Your payment has been processed successfully.</p>
        )}
      </div>

      {errMsg && (
        <div className="text-red-600 bg-red-50 p-4 rounded-xl">{errMsg}</div>
      )}

      {!loading && !errMsg && booking && (
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-[var(--SubText)] font-medium">{t("free-session", "package", "Package")}</span>
              <span className="font-bold text-[var(--Main)]">{booking.package?.levelno ? `Level ${booking.package.levelno}` : 'Package'}</span>
            </div>

            <div className="border-t border-gray-50 pt-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--SubText)]">{t("free-session", "originalPrice", "Original Price")}</span>
                <span className="font-medium">{(Number(booking.amount) + (booking.discountAmount || 0) + (booking.usedAffiliateBalance || 0)).toFixed(2)} {booking.currency}</span>
              </div>

              {booking.discountAmount > 0 && (
                <div className="flex justify-between items-center text-sm text-green-600 font-bold">
                  <span className="flex items-center gap-2"><FaTag size={12} /> {t("affiliate", "promoCode", "Promo Discount")}</span>
                  <span>-{Number(booking.discountAmount).toFixed(2)} {booking.currency}</span>
                </div>
              )}

              {booking.usedAffiliateBalance > 0 && (
                <div className="flex justify-between items-center text-sm text-blue-600 font-bold">
                  <span className="flex items-center gap-2"><FaWallet size={12} /> {t("affiliate", "wallet", "Used Wallet Balance")}</span>
                  <span>-{Number(booking.usedAffiliateBalance).toFixed(2)} {booking.currency}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t-2 border-gray-100 italic">
              <span className="font-black text-lg text-[var(--Main)]">{t("free-session", "finalAmount", "Amount Paid")}</span>
              <span className="text-2xl font-black text-[var(--Yellow)]" dir="ltr">
                {Number(booking.amount).toFixed(2)} {booking.currency || "EGP"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
            <div className="p-3 bg-gray-50 rounded-2xl">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">{t("free-session", "bookingId", "Booking ID")}</p>
              <p className="text-xs font-mono font-bold text-gray-700 truncate">#{booking.id.slice(-8).toUpperCase()}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">{t("free-session", "paymentStatus", "Payment Status")}</p>
              <p className={`text-xs font-bold capitalize ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>{booking.paymentStatus}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4">
        <Link
          to="/"
          className="px-8 py-3 rounded-2xl bg-[var(--Main)] text-white font-bold hover:bg-black transition-all shadow-lg shadow-gray-200"
        >
          {t("free-session", "backToHome", "Go Home")}
        </Link>
        <Link
          to="/profile"
          className="px-8 py-3 rounded-2xl bg-white border-2 border-[var(--Main)] text-[var(--Main)] font-bold hover:bg-gray-50 transition-all"
        >
          {t("profile", "myProfile", "My Profile")}
        </Link>
      </div>
    </main>
  );
};

export default PaymentResult;
