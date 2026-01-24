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

export const useCreateManualBooking = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    `${endPoints.freeSessionBookings}/manual`,
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

export const useUpdateStatusForFreeSessionBooking = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePatchData(
    endPoints.freeSessionBookings,
    [queryKeys.freeSessionBookings, "updateStatus"],
    [queryKeys.freeSessionBookings, queryKeys.freeSessionBookingsById]
  );

  const updateStatus = ({ id, status }) =>
    mutate({
      data: { status },
      url: `${endPoints.freeSessionBookings}${id}/status`,
    });

  return { mutate: updateStatus, data, error, isPending, isSuccess, isError };
};

export const useUpdateSalesAgentForFreeSessionBooking = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePatchData(
    endPoints.freeSessionBookings,
    [queryKeys.freeSessionBookings, "updateSalesAgent"],
    [queryKeys.freeSessionBookings, queryKeys.allEmployees, queryKeys.freeSessionBookingsById]
  );

  const updateSalesAgent = ({ id, salesAgentId }) =>
    mutate({
      data: { salesAgentId },
      url: `${endPoints.freeSessionBookings}${id}/sales-agent`,
    });

  return { mutate: updateSalesAgent, data, error, isPending, isSuccess, isError };
};

export const useGetAllFreeSessionBookings = (params = {}) => {
  const { page = 1, limit = 10, ...otherParams } = params;
  const queryString = new URLSearchParams({ page, limit, ...otherParams }).toString();

  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.freeSessionBookings}?${queryString}`,
    queryKeys: [queryKeys.freeSessionBookings, page, limit, JSON.stringify(otherParams)],
    other: { refetchInterval: 30000 }, // Auto-refresh every 30s
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
    other: { refetchInterval: 30000 },
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useBulkReassign = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.bulkReassign,
    [queryKeys.freeSessionBookings, "bulkReassign"],
    [queryKeys.freeSessionBookings, queryKeys.allEmployees, queryKeys.users]
  );
  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useGetSuggestedAgents = ({ role, startTime, enabled = false }) => {
  const queryString = new URLSearchParams({ role, startTime }).toString();
  const { data, isPending, isSuccess, refetch } = useGetData({
    url: `${endPoints.suggestAgents}?${queryString}`,
    queryKeys: [queryKeys.suggestAgents, role, startTime],
    enabled: enabled && !!role && !!startTime,
  });

  return { data, isPending, isSuccess, refetch };
};
