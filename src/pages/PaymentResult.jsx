import { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { useGetPaymentStatus } from "@/hooks/Actions/payment/useCurdsPayment";
import { useTranslation } from "react-i18next";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const PaymentResult = () => {
  const query = useQuery();
  const bookingId = query.get("bookingId");
  const { data, isPending, isFetching, error, refetchInterval } =
    useGetPaymentStatus({
      bookingId,
      enabled: Boolean(bookingId),
      refetchInterval: 3000,
    });

  const { t, i18n } = useTranslation();

  const booking = data?.data?.booking;
  console.log(booking);
  const loading = isPending || isFetching;
  const errMsg = !bookingId ? "Missing bookingId" : error?.message || null;

  const title = loading
    ? t("paymentResult.processingPayment")
    : errMsg
    ? t("paymentResult.unableToConfirmPayment")
    : booking?.paymentStatus === "paid"
    ? t("paymentResult.paymentSuccessful")
    : booking?.paymentStatus === "failed" || booking?.status === "cancelled"
    ? t("paymentResult.paymentFailed")
    : t("paymentResult.paymentPending");

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--Main)]">{title}</h1>

      {loading && (
        <p className="text-[var(--SubText)]">
          {t("paymentResult.processingPayment")}
        </p>
      )}

      {errMsg && (
        <div className="text-red-600 bg-red-50 p-4 rounded-xl">{t(errMsg)}</div>
      )}

      {!loading && !errMsg && booking && (
        <div className="bg-white rounded-xl shadow p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-[var(--SubText)]">
              {t("paymentResult.amount")}
            </span>
            <span className="font-semibold" dir="ltr">
              {Number(booking.amount).toFixed(2)} {booking.currency || "EGP"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--SubText)]">
              {t("paymentResult.bookingId")}
            </span>
            <span className="font-semibold">{booking.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--SubText)]">
              {t("paymentResult.status")}
            </span>
            <span className="font-semibold capitalize">{booking.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--SubText)]">
              {t("paymentResult.payment")}
            </span>
            <span className="font-semibold capitalize">
              {booking.paymentStatus}
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Link
          to="/"
          className="px-4 py-2 rounded-xl bg-[var(--Yellow)] text-white"
        >
          {t("paymentResult.home")}
        </Link>
      </div>
    </main>
  );
};

export default PaymentResult;
