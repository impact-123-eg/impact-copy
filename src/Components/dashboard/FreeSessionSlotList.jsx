import formatTime from "@/utilities/formatTime";
import React, { useState } from "react";
import { MdOutlineBlock } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import ConfirmModal from "../ConfirmModal";
import { useDeleteSlot } from "@/hooks/Actions/free-sessions/useFreeSessionCrudsForAdmin";

const FreeSessionSlotList = ({
  slots,
  onSlotSelect,
  selectedSlot,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--Yellow)] mx-auto mb-4"></div>
        <p className="text-[var(--SubText)]">Loading time slots...</p>
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--SubText)]">
        No time slots created for this date
      </div>
    );
  }

  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { mutate: deleteSlot, isPending } = useDeleteSlot(selectedSlotId);

  const onDeleteSlot = (slotId) => {
    if (!slotId) return;
    console.log(slotId);
    deleteSlot(
      { id: slotId },
      {
        onSuccess: () => {
          setSelectedSlotId(() => null);
          onSlotSelect(null);
        },
      }
    );
    setModalOpen(false);
  };

  // Helper function to calculate slot statistics
  const getSlotStats = (slot) => {
    const totalCapacity =
      slot.groups?.reduce((sum, group) => sum + group.maxParticipants, 0) || 0;
    const totalBooked =
      slot.groups?.reduce(
        (sum, group) => sum + (group.bookings?.length || 0),
        0
      ) || 0;
    const availableSpots = totalCapacity - totalBooked;
    const availableGroups =
      slot.groups?.filter(
        (group) => (group.bookings?.length || 0) < group.maxParticipants
      ).length || 0;

    return { totalCapacity, totalBooked, availableSpots, availableGroups };
  };

  return (
    <div className="space-y-3">
      {slots.map((slot) => {
        const stats = getSlotStats(slot);
        const isSelected = selectedSlot?._id === slot._id;
        const isActive = slot.isActive !== false; // Default to true if undefined

        return (
          <div
            key={slot._id}
            onClick={() => onSlotSelect(slot)}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${isSelected
                ? "border-[var(--Yellow)] bg-yellow-50 ring-2 ring-[var(--Yellow)] ring-opacity-50"
                : "border-[var(--Input)] hover:border-[var(--Yellow)] hover:shadow-sm"
              } ${!isActive ? "opacity-60 grayscale" : ""}`}
          >
            {/* Slot Header */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-medium text-[var(--Main)]">
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </span>
                {!isActive && (
                  <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    Inactive
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              {isSelected && (
                <div className="flex gap-2">
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${stats.availableSpots > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {stats.availableSpots} spot
                    {stats.availableSpots !== 1 ? "s" : ""} left
                  </span>

                  <div className="flex gap-1">
                    {/* Toggle Status Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStatus(slot._id, !isActive);
                      }}
                      className={`p-2 rounded-lg transition-colors ${isActive
                          ? "bg-[var(--Yellow)] text-white hover:bg-yellow-400"
                          : "bg-green-500 text-white hover:bg-green-700"
                        }`}
                      title={isActive ? "Disable Slot" : "Enable Slot"}
                    >
                      {isActive ? (
                        <MdOutlineBlock size={16} />
                      ) : (
                        <IoCheckmarkCircleOutline size={16} />
                      )}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalOpen(true);
                        setSelectedSlotId(slot._id);
                        console.log(selectedSlotId);
                      }}
                      className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-800 transition-colors"
                      title="Delete Slot"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              )}

              {/* <span
                className={`text-sm px-2 py-1 rounded-full ${
                  stats.availableSpots > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {stats.availableSpots} spot
                {stats.availableSpots !== 1 ? "s" : ""} left
              </span> */}
            </div>

            {/* Groups Summary */}
            <div className="text-sm text-[var(--SubText)] mb-2">
              {slot.groups?.length || 0} group
              {slot.groups?.length !== 1 ? "s" : ""} • {stats.availableGroups}{" "}
              with space
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-[var(--Yellow)] h-2 rounded-full transition-all"
                style={{
                  width: `${stats.totalCapacity > 0
                      ? (stats.totalBooked / stats.totalCapacity) * 100
                      : 0
                    }%`,
                }}
              ></div>
            </div>

            {/* Detailed Statistics */}
            <div className="grid grid-cols-2 gap-2 text-xs text-[var(--SubText)]">
              <div>
                <span className="font-medium">Capacity: </span>
                {stats.totalCapacity}
              </div>
              <div>
                <span className="font-medium">Booked: </span>
                {stats.totalBooked}
              </div>
              <div>
                <span className="font-medium">Available: </span>
                {stats.availableSpots}
              </div>
              <div>
                <span className="font-medium">Groups: </span>
                {stats.availableGroups}/{slot.groups?.length || 0}
              </div>
            </div>

            {/* Group List (Collapsible) */}
            {isSelected && slot.groups && slot.groups.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <h4 className="font-medium text-sm text-[var(--Main)] mb-2">
                  Groups:
                </h4>
                <div className="space-y-2">
                  {slot?.groups?.map((group) => {
                    const groupBookings = group.bookings?.length || 0;
                    const isGroupFull = groupBookings >= group.maxParticipants;

                    return (
                      <div
                        key={group._id}
                        className={`flex justify-between items-center p-2 rounded text-xs ${isGroupFull
                            ? "bg-red-50 text-red-700"
                            : "bg-green-50 text-green-700"
                          }`}
                      >
                        <span className="font-medium">
                          {group.name} {group.teacher ? ` - ${group.teacher}` : ""}
                        </span>
                        <span>
                          {groupBookings}/{group.maxParticipants}
                          {isGroupFull && " 🚫"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
      <ConfirmModal
        title="Confirm Delete Slot"
        onConfirm={() => {
          onDeleteSlot(selectedSlotId);
        }}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default FreeSessionSlotList;
