import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePatchData from "@/hooks/curdsHook/usePatchData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAllBookings = () => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.bookings,
    queryKeys: [queryKeys.bookings],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useGetBookingById = ({ id, enabled }) => {
  const { data, isPending, isSuccess, refetch } = useGetData({
    url: `${endPoints.bookings}${id}`,
    queryKeys: [queryKeys.bookings, id],
    enabled: enabled,
  });

  return { data, isPending, isSuccess, refetch };
};

export const useAddBooking = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.bookings,
    [queryKeys.addBooking],
    [queryKeys.bookings]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateBooking = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePatchData(
    endPoints.bookings,
    [queryKeys.updateBooking],
    [queryKeys.bookings]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteBooking = () => {
  const { mutate, isPending, isSuccess } = useDeleteData(
    endPoints.bookings,
    [queryKeys.deleteBooking],
    [queryKeys.bookings]
  );
  return { mutate, isPending, isSuccess };
};
