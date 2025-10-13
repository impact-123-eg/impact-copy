import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePatchData from "@/hooks/curdsHook/usePatchData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetFreeSessionAvailableDays = () => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.freeSessionAvailableDays,
    queryKeys: [queryKeys.freeSessionAvailableDays],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useGetFreeSessionSlotsByDate = (date) => {
  const { data, isPending, isSuccess, refetch } = useGetData({
    url: `${endPoints.freeSessionSlotByDateForAdmin}${date}`,
    queryKeys: [queryKeys.freeSessionSlotByDate, date],
    enabled: true,
  });

  return { data, isPending, isSuccess, refetch };
};

export const useAddFreeSessionSlot = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.freeSessionSlots,
    [queryKeys.addFreeSessionSlot],
    [queryKeys.freeSessionSlotByDate]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useMoveBooking = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePatchData(
    endPoints.moveFreeSessionBooking,
    [queryKeys.moveFreeSessionBooking],
    [queryKeys.freeSessionSlots]
  );
  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useToggleSlotStatus = (id) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePatchData(
    `${endPoints.freeSessionSlots}${id}/status`,
    [queryKeys.toggleFreeSessionSlotStatus],
    [queryKeys.freeSessionSlotByDate]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteSlot = () => {
  const { mutate, isPending, isSuccess } = useDeleteData(
    endPoints.freeSessionSlots,
    [queryKeys.deleteFreeSessionSlot],
    [queryKeys.freeSessionSlotByDate]
  );
  return { mutate, isPending, isSuccess };
};
