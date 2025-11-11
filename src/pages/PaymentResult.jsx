import { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { useGetPaymentStatus } from "@/hooks/Actions/payment/useCurdsPayment";

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

  const booking = data?.data?.booking;
  console.log(booking);
  const loading = isPending || isFetching;
  const errMsg = !bookingId ? "Missing bookingId" : error?.message || null;

  const title = loading
    ? "Processing your payment..."
    : errMsg
    ? "Unable to confirm payment"
    : booking?.paymentStatus === "paid"
    ? "Payment successful"
    : booking?.paymentStatus === "failed" || booking?.status === "cancelled"
    ? "Payment failed"
    : "Payment pending";

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--Main)]">{title}</h1>

      {loading && (
        <p className="text-[var(--SubText)]">
          Please wait while we confirm your payment...
        </p>
      )}

      {errMsg && (
        <div className="text-red-600 bg-red-50 p-4 rounded-xl">{errMsg}</div>
      )}

      {!loading && !errMsg && booking && (
        <div className="bg-white rounded-xl shadow p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-[var(--SubText)]">Booking</span>
            <span className="font-semibold">{booking.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--SubText)]">Status</span>
            <span className="font-semibold capitalize">{booking.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--SubText)]">Payment</span>
            <span className="font-semibold capitalize">
              {booking.paymentStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--SubText)]">Amount</span>
            <span className="font-semibold">
              {booking.amount} {booking.currency || "EGP"}
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Link
          to="/"
          className="px-4 py-2 rounded-xl bg-[var(--Yellow)] text-white"
        >
          Home
        </Link>
      </div>
    </main>
  );
};

export default PaymentResult;
