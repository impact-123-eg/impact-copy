import React, { useState } from "react";
import ConfirmModal from "../ConfirmModal";
import { useDeleteAvailability } from "@/hooks/Actions/availabilities/useAvailabilityCruds";

const AvailabilityList = ({ availability }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { mutate: deleteAvailability, isPending } = useDeleteAvailability();

  const handleDelete = (id) => {
    deleteAvailability(
      { id },
      {
        onSuccess: () => {
          setModalOpen(false);
        },
      }
    );
  };

  if (availability.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--SubText)]">
        No availability set yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {availability.map((item) => (
        <div key={item._id} className="bg-[var(--Light)] rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg text-[var(--Main)]">
              {item.date} ({item.day})
            </h3>
            <button
              onClick={() => handleDelete(item._id)}
              disabled={isPending}
              className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm disabled:opacity-50"
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </div>

          <div className="space-y-3">
            {item.slots.map((slot, slotIndex) => (
              <div key={slotIndex} className="bg-white p-3 rounded-lg">
                <div className="font-medium text-[var(--Main)] mb-2">
                  {slot.start} - {slot.end}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {slot.groups.map((group, groupIndex) => (
                    <div
                      key={groupIndex}
                      className="flex items-center justify-between bg-[var(--Input)] p-2 rounded-lg"
                    >
                      <span className="text-sm font-medium text-[var(--Main)]">
                        {group.level}
                      </span>
                      <span className="text-xs bg-[var(--Yellow)] text-[var(--Main)] px-2 py-1 rounded-full">
                        {group.users.length} slot
                        {group.users.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Delete Availability"
        onConfirm={handleDelete}
        description="Are you sure you want to delete this availability? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        icon="delete"
      />
    </div>
  );
};

export default AvailabilityList;
