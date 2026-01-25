import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  useAddFreeSessionSlot,
  useGetFreeSessionSlotsByDate,
  useMoveBooking,
} from "@/hooks/Actions/free-sessions/useFreeSessionCrudsForAdmin";
import FreeSessionCalendar from "@/Components/FreeSessionCalendar";
import FreeSessionSlotList from "@/Components/dashboard/FreeSessionSlotList";
import FreeSessionSlotForm from "@/Components/dashboard/FreeSessionSlotForm";
import FreeSessionGroupManager from "@/Components/dashboard/FreeSessionGroupManager";
import formatDateForAPI from "@/utilities/formatDateForApi";
import formatTime from "@/utilities/formatTime";

const FreeSessionManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);

  // Derive date and slot from URL
  const selectedDate = useMemo(() => {
    const dateStr = searchParams.get("date");
    if (dateStr) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date(); // Default to today
  }, [searchParams]);

  const selectedSlotId = searchParams.get("slot");

  // Hook for creating slots
  const { mutate: mutateAddSlot, isPending: isAdding } =
    useAddFreeSessionSlot();

  // Hook for getting slots by date
  const {
    data: slotsData,
    isLoading: isLoadingSlots,
    refetch: refetchSlots,
  } = useGetFreeSessionSlotsByDate(formatDateForAPI(selectedDate));

  const { mutate: moveBooking, isPending: isMoving } = useMoveBooking();

  const slots = slotsData?.data?.data || [];
  const selectedSlot = slots.find((s) => s._id === selectedSlotId);

  const handleDateChange = (date) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("date", formatDateForAPI(date));
      params.delete("slot"); // Reset selected slot when date changes
      return params;
    });
  };

  const handleSlotSelect = (slot) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (params.get("slot") === slot?._id) {
        params.delete("slot");
      } else {
        params.set("slot", slot?._id);
      }
      return params;
    });
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceGroupId = result.source.droppableId;
    const destGroupId = result.destination.droppableId;
    const bookingId = result.draggableId;

    if (sourceGroupId === destGroupId) return;

    // Find the destinaton slot ID by looking up which slot contains the destination group
    const destinationSlot = slots.find(s =>
      s.groups.some(g => g._id === destGroupId)
    );

    moveBooking(
      {
        bookingId,
        fromGroupId: sourceGroupId,
        toGroupId: destGroupId,
        slotId: destinationSlot?._id,
      },
      {
        onSuccess: () => {
          refetchSlots();
        },
        onError: (error) => {
          console.error("Failed to move booking:", error);
          alert("Failed to move booking. Please try again.");
        },
      }
    );
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
    refetchSlots();
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

      {/* Bottom Section: Group Management */}
      <div className="bg-white p-6 rounded-2xl shadow mt-6">
        <h2 className="font-medium text-lg text-[var(--Main)] mb-6 border-b pb-4">
          {selectedSlotId
            ? `Managing Groups for: ${selectedSlot ? `${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime)}` : "Loading..."}`
            : `Showing All Slots for ${selectedDate.toLocaleDateString()}`
          }
        </h2>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar min-h-[500px]">
            {slots
              .filter(s => !selectedSlotId || s._id === selectedSlotId)
              .map(slot => (
                <div key={slot._id} className="min-w-[400px] flex-shrink-0 p-4 border border-gray-100 rounded-2xl bg-gray-50/30 self-start">
                  <div className="flex items-center gap-2 mb-4 sticky top-0 bg-transparent backdrop-blur-sm z-10 py-1">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <h3 className="font-bold text-blue-900">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </h3>
                  </div>
                  <FreeSessionGroupManager
                    slot={slot}
                    onBookingMoved={handleBookingMoved}
                    isMoving={isMoving}
                    hideHeader={true}
                  />
                </div>
              ))}

            {slots.length === 0 && !isLoadingSlots && (
              <div className="text-center py-12 text-[var(--SubText)] w-full">
                No slots found for this date.
              </div>
            )}
          </div>
        </DragDropContext>
      </div>

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
