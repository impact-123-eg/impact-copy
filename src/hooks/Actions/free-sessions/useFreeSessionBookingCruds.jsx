import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePostData from "@/hooks/curdsHook/usePostData";
import usePatchData from "@/hooks/curdsHook/usePatchData";

export const useCreateBooking = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.freeSessionBookings,
    [queryKeys.freeSessionBookings],
    [
      queryKeys.freeSessionBookings,
      queryKeys.freeSessionSlotByDate,
      queryKeys.freeSessionAvailableDays,
    ]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateLevelForFreeSessionBooking = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePatchData(
    endPoints.freeSessionBookings,
    [queryKeys.freeSessionBookings, "updateLevel"],
    [queryKeys.freeSessionBookings, queryKeys.freeSessionBookingsById]
  );

  const updateLevel = ({ id, level }) =>
    mutate({
      data: { level },
      url: `${endPoints.freeSessionBookings}${id}/level`,
    });

  return { mutate: updateLevel, data, error, isPending, isSuccess, isError };
};

export const useGetFreeSessionBookingById = ({ id, enabled = true }) => {
  const { data, isPending, isSuccess, refetch, ...rest } = useGetData({
    url: `${endPoints.freeSessionBookings}${id}`,
    queryKeys: [queryKeys.freeSessionBookingsById, id],
    enabled: !!id && enabled,
  });

  return { data, isPending, isSuccess, refetch, ...rest };
};

export const useAddNoteToFreeSessionBooking = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePatchData(
    endPoints.freeSessionBookings,
    [queryKeys.freeSessionBookings, "addNote"],
    [queryKeys.freeSessionBookings, queryKeys.freeSessionBookingsById]
  );

  const addNote = ({ id, note }) =>
    mutate({
      data: { note },
      url: `${endPoints.freeSessionBookings}${id}/notes`,
    });

  return { mutate: addNote, data, error, isPending, isSuccess, isError };
};

export const useUpdateLeadStatusForFreeSessionBooking = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePatchData(
    endPoints.freeSessionBookings,
    [queryKeys.freeSessionBookings, "updateLeadStatus"],
    [queryKeys.freeSessionBookings, queryKeys.freeSessionBookingsById]
  );

  const updateLeadStatus = ({ id, leadStatus }) =>
    mutate({
      data: { leadStatus },
      url: `${endPoints.freeSessionBookings}${id}/lead-status`,
    });

  return {
    mutate: updateLeadStatus,
    data,
    error,
    isPending,
    isSuccess,
    isError,
  };
};

export const useGetAllFreeSessionBookings = () => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.freeSessionBookings,
    queryKeys: [queryKeys.freeSessionBookings],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

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
