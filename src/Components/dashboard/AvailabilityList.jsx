import { useState } from "react";
// import { useDeleteAvailabilitySlot } from "@/hooks/Actions/availabilities/useAvailabilityCruds";

const AvailabilityList = ({ availability, _onRefresh }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  // const { mutate: deleteSlot, isPending } = useDeleteAvailabilitySlot();
  console.log(availability);

  const handleDeleteClick = (slotId) => {
    setSelectedSlotId(slotId);
    setModalOpen(true);
  };

  const handleDelete = () => {
    if (selectedSlotId && availability?._id) {
      // deleteSlot(
      //   {
      //     availabilityId: availability._id,
      //     slotId: selectedSlotId,
      //   },
      //   {
      //     onSuccess: () => {
      //       setModalOpen(false);
      //       setSelectedSlotId(null);
      //       onRefresh(); // Refresh the list after deletion
      //     },
      //     onError: (error) => {
      //       console.error("Error deleting slot:", error);
      //       setModalOpen(false);
      //       setSelectedSlotId(null);
      //     },
      //   }
      // );
    }
  };

  if (
    !availability ||
    !availability?.slots ||
    availability?.slots?.length === 0
  ) {
    return (
      <div className="text-center py-8 text-[var(--SubText)]">
        No time slots available for this date.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Slots List */}
      <div className="space-y-4">
        {availability?.slots.map((slot, slotIndex) => (
          <div
            key={slot._id || slotIndex}
            className="bg-white p-4 rounded-xl shadow-sm border border-[var(--Input)]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="font-medium text-lg text-[var(--Main)]">
                  {slot.start} - {slot.end}
                </div>
                <div className="text-sm text-[var(--SubText)] bg-[var(--Light)] px-2 py-1 rounded">
                  {calculateDuration(slot.start, slot.end)}
                </div>
              </div>
              <button
                onClick={() => handleDeleteClick(slot._id)}
                // disabled={isPending}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm disabled:opacity-50 transition-colors"
              >
                Remove Slot
              </button>
            </div>

            {/* Groups List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {slot.groups.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className="bg-[var(--Light)] p-3 rounded-lg border border-[var(--Input)]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--Main)] capitalize">
                      {group.level}
                    </span>
                    <span className="text-xs bg-[var(--Yellow)] text-[var(--Main)] px-2 py-1 rounded-full">
                      {group.users?.length || 0} slot
                      {(group.users?.length || 0) !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {group.instructor && (
                      <div className="text-xs text-[var(--SubText)]">
                        <span className="font-medium">Instructor:</span>{" "}
                        {group.instructor}
                      </div>
                    )}

                    <div className="text-xs text-[var(--SubText)]">
                      <span className="font-medium">Booked:</span>{" "}
                      {group.users?.filter((user) => user !== null).length || 0}
                      /{group.users?.length || 0}
                    </div>

                    {(group.users?.length || 0) > 0 && (
                      <div className="w-full bg-[var(--Input)] rounded-full h-1.5 mt-1">
                        <div
                          className="bg-[var(--Yellow)] h-1.5 rounded-full"
                          style={{
                            width: `${
                              (group.users.filter((user) => user !== null)
                                .length /
                                group.users.length) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* <ConfirmModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedSlotId(null);
        }}
        title="Remove Time Slot"
        onConfirm={handleDelete}
        description="Are you sure you want to remove this time slot? This action cannot be undone."
        confirmText={isPending ? "Removing..." : "Remove Slot"}
        cancelText="Keep Slot"
        icon="delete"
        isConfirming={isPending}
      /> */}
    </div>
  );
};

// Helper function to calculate duration between two times
const calculateDuration = (start, end) => {
  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);

  let totalMinutes =
    endHours * 60 + endMinutes - (startHours * 60 + startMinutes);

  if (totalMinutes < 0) {
    totalMinutes += 24 * 60; // Handle overnight slots
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} minutes`;
  } else if (minutes === 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  } else {
    return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minutes`;
  }
};

export default AvailabilityList;
