import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";

// export const useAddBooking = () => {
//   const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
//     endPoints.bookings,
//     [queryKeys.addBooking],
//     [queryKeys.bookings]
//   );

//   return { mutate, data, error, isPending, isSuccess, isError };
// };

export const useGetAvailableSlotsForUser = () => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.getFreeSessionSlots,
    queryKeys: [queryKeys.getFreeSessionSlots],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};
