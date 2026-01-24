import { useI18n } from "../hooks/useI18n";

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
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--Main)]">{title}</h1>

      {errMsg && (
        <div className="text-red-600 bg-red-50 p-4 rounded-xl">{errMsg}</div>
      )}

      {!loading && !errMsg && booking && (
        <div className="bg-white rounded-xl shadow p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-[var(--SubText)]">
              {t("free-session", "amount", "Amount")}
            </span>
            <span className="font-semibold" dir="ltr">
              {Number(booking.amount).toFixed(2)} {booking.currency || "EGP"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--SubText)]">
              {t("free-session", "bookingId", "Booking ID")}
            </span>
            <span className="font-semibold">{booking.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--SubText)]">
              {t("free-session", "status", "Status")}
            </span>
            <span className="font-semibold capitalize">{booking.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--SubText)]">
              {t("free-session", "payment", "Payment")}
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
          {t("free-session", "backToHome", "Home")}
        </Link>
      </div>
    </main>
  );
};

export default PaymentResult;
