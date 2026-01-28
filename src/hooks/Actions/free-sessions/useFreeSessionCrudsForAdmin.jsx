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
    url: `${endPoints.freeSessionSlotByDateForAdmin}/${date}`,
    queryKeys: [queryKeys.freeSessionSlotByDate, date],
    enabled: true,
  });

  return { data, isPending, isSuccess, refetch };
};

export const useAddFreeSessionSlot = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.freeSessionSlots,
    [queryKeys.addFreeSessionSlot],
    [queryKeys.freeSessionSlotByDate, queryKeys.getFreeSessionSlots]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useMoveBooking = () => {
  const { mutate: patchMutate, ...rest } = usePatchData(
    endPoints.moveFreeSessionBooking,
    [queryKeys.moveFreeSessionBooking],
    [queryKeys.freeSessionSlotByDate, queryKeys.freeSessionBookings]
  );

  const moveBooking = (moveData, options) => {
    patchMutate(
      {
        data: moveData,
        url: endPoints.moveFreeSessionBooking
      },
      options
    );
  };

  return { mutate: moveBooking, ...rest };
};

export const useToggleSlotStatus = () => {
  const { mutate: patchMutate, ...rest } = usePatchData(
    null,
    [queryKeys.toggleFreeSessionSlotStatus],
    [queryKeys.freeSessionSlotByDate]
  );

  const toggleStatus = (id, isActive, options) => {
    patchMutate(
      {
        url: `${endPoints.freeSessionSlots}/${id}/status`,
        data: { isActive },
      },
      options
    );
  };

  return { mutate: toggleStatus, ...rest };
};

export const useDeleteSlot = () => {
  const { mutate, isPending, isSuccess } = useDeleteData(
    endPoints.freeSessionSlots,
    [queryKeys.deleteFreeSessionSlot],
    [queryKeys.freeSessionSlotByDate]
  );
  return { mutate, isPending, isSuccess };
};

export const useUpdateGroupTeacher = () => {
  const { mutate: patchMutate, ...rest } = usePatchData(
    endPoints.updateGroupTeacher,
    [queryKeys.updateGroupTeacher],
    [queryKeys.freeSessionBookings, queryKeys.freeSessionSlotByDate]
  );

  const updateTeacher = ({ groupId, teacherId }) =>
    patchMutate({
      data: { groupId, teacherId },
      url: endPoints.updateGroupTeacher,
    });

  return { mutate: updateTeacher, ...rest };
};

export const useAutoAssignInstructors = () => {
  const { mutate, ...rest } = usePostData(
    endPoints.autoAssignInstructors,
    [queryKeys.autoAssignInstructors],
    [queryKeys.freeSessionSlotByDate]
  );

  const autoAssign = (slotId) => mutate({
    url: `${endPoints.autoAssignInstructors}/${slotId}`
  });

  return { mutate: autoAssign, ...rest };
};

export const useCancelFreeSessionBooking = () => {
  const { mutate, ...rest } = usePatchData(
    endPoints.cancelFreeSessionBooking,
    [queryKeys.cancelFreeSessionBooking],
    [queryKeys.freeSessionSlotByDate]
  );

  const cancelBooking = (bookingId) => mutate({
    url: `${endPoints.cancelFreeSessionBooking}/${bookingId}/cancel`
  });

  return { mutate: cancelBooking, ...rest };
};

export const useGetUpcomingFreeSessionSlots = (days = 14) => {
  const { data, isPending, isSuccess, refetch } = useGetData({
    url: `${endPoints.freeSessionSlots}/upcoming-full?days=${days}`,
    queryKeys: [queryKeys.getFreeSessionSlots, "upcoming-full", days],
    enabled: true,
  });

  return { data, isPending, isSuccess, refetch };
};
