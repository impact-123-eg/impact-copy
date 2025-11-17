import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import usePostData from "@/hooks/curdsHook/usePostData";
import useGetData from "@/hooks/curdsHook/useGetData";

export const useCreatePayment = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.createPayment,
    [queryKeys.createPayment],
    [queryKeys.bookings]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useGetPaymentStatus = ({ bookingId, enabled = true }) => {
  const query = useGetData({
    url: `${endPoints.paymentStatus}${bookingId}`,
    queryKeys: [queryKeys.createPayment, bookingId, "status"],
    enabled: Boolean(enabled && bookingId),
    // Poll every 3s until terminal state
    refetchInterval: (data) => {
      const status = data?.data?.booking?.paymentStatus;
      return ["paid", "failed", "refunded", "cancelled"].includes(status)
        ? false
        : 3000;
    },
  });
  return query;
};
