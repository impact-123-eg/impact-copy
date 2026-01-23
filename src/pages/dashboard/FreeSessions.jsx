import React, { useState } from "react";
import {
  useAddFreeSessionSlot,
  useGetFreeSessionSlotsByDate,
} from "@/hooks/Actions/free-sessions/useFreeSessionCrudsForAdmin";
import FreeSessionCalendar from "@/Components/FreeSessionCalendar";
import FreeSessionSlotList from "@/Components/dashboard/FreeSessionSlotList";
import FreeSessionSlotForm from "@/Components/dashboard/FreeSessionSlotForm";
import FreeSessionGroupManager from "@/Components/dashboard/FreeSessionGroupManager";
import formatDateForAPI from "@/utilities/formatDateForApi";
import formatTime from "@/utilities/formatTime";

const FreeSessionManagement = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to today
  const [selectedSlot, setSelectedSlot] = useState(null); // Track selected time slot
  const [showForm, setShowForm] = useState(false);

  // Hook for creating slots
  const { mutate: mutateAddSlot, isPending: isAdding } =
    useAddFreeSessionSlot();

  // Hook for getting slots by date
  const {
    data: slotsData,
    isLoading: isLoadingSlots,
    refetch: refetchSlots,
  } = useGetFreeSessionSlotsByDate(formatDateForAPI(selectedDate));

  const slots = slotsData?.data?.data || [];

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Reset selected slot when date changes
  };

  const handleSlotSelect = (slot) => {
    if (selectedSlot?._id === slot?._id) {
      // Deselect if the same slot is clicked
      setSelectedSlot(null);
      return;
    }
    setSelectedSlot(slot);
  };

  const handleCreateSlot = (data) => {
    mutateAddSlot(
      { data: { ...data, date: selectedDate } },
      {
        onSuccess: () => {
          setShowForm(false);
          refetchSlots();
        },
      }
    );
  };

  const formatDateLabel = (date) => {
    return date?.toLocaleDateString("en-UK", {
      weekday: "short",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  const handleBookingMoved = () => {
    // Refresh the slot details after moving a booking
    refetchSlots(); // Also refresh the slot list to update participant counts
  };

  return (
    <main className="space-y-6 max-w-7xl mx-auto p-6">
      <h1 className="font-bold text-2xl text-[var(--Main)]">
        Free Session Management
      </h1>

      {/* Top Section: Calendar + Slot Creation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-6">
          <h2 className="font-medium text-lg text-[var(--Main)]">
            Select Date
          </h2>

          <div className="flex justify-center">
            <FreeSessionCalendar
              isAdmin={true}
              showSlots={false}
              externalDate={selectedDate}
              setExternalDate={setSelectedDate}
              onDateSelect={handleDateChange}
            />
          </div>

          <button
            onClick={() => setShowForm(true)}
            disabled={isLoadingSlots}
            className="w-full py-2 bg-[var(--Yellow)] hover:bg-opacity-90 transition-colors rounded-xl disabled:opacity-50"
          >
            Create Time Slot for {formatDateLabel(selectedDate)}
          </button>
        </div>


        {/* Slot List Section */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-medium text-lg text-[var(--Main)] mb-4">
            Time Slots for{" "}
            <span className="font-medium text-base text-[var(--SubText)]">
              {selectedDate.toLocaleDateString("en-UK", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </h2>

          {isLoadingSlots ? (
            <div className="text-center py-4 text-[var(--SubText)]">
              Loading time slots...
            </div>
          ) : (
            <FreeSessionSlotList
              slots={slots}
              onSlotSelect={handleSlotSelect}
              selectedSlot={selectedSlot}
            />
          )}
        </div>
      </div>

      {/* Bottom Section: Group Management (Only shows when a slot is selected) */}
      {selectedSlot && (
        <div className="bg-white p-6 rounded-2xl shadow mt-6">
          <h2 className="font-medium text-lg text-[var(--Main)] mb-6">
            Manage Groups for: {formatTime(selectedSlot.startTime)} -{" "}
            {formatTime(selectedSlot.endTime)}
          </h2>

          <FreeSessionGroupManager
            slot={selectedSlot}
            onBookingMoved={handleBookingMoved}
          />
        </div>
      )}

      {/* Slot Creation Form Modal */}
      {showForm && (
        <FreeSessionSlotForm
          date={formatDateLabel(selectedDate)}
          onSubmit={handleCreateSlot}
          onCancel={() => setShowForm(false)}
        />
      )}
    </main>
  );
};

export default FreeSessionManagement;
