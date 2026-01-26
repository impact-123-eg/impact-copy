import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  useMoveBooking,
  useGetUpcomingFreeSessionSlots,
  useCancelFreeSessionBooking,
} from "@/hooks/Actions/free-sessions/useFreeSessionCrudsForAdmin";
import { useGetAllEmployees } from "@/hooks/Actions/users/useCurdsUsers";
import formatTime from "@/utilities/formatTime";
import InlineSelect from "@/Components/ui/InlineSelect";
import {
  User,
  UserX,
  Calendar,
  XCircle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Move,
} from "lucide-react";
import BookingDetailsModal from "./BookingDetailsModal";

/**
 * FreeSessionSeatsView - A table view with drag-and-drop to move students between slots/groups
 * Shows all upcoming slots with visual seats, and allows moving students across different dates
 */
const FreeSessionSeatsView = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [bookingToMove, setBookingToMove] = useState(null);
  const [expandedSlots, setExpandedSlots] = useState({});
  const [selectedDateFilter, setSelectedDateFilter] = useState("");

  const { mutate: moveBooking, isPending: isMoving } = useMoveBooking();
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelFreeSessionBooking();
  const { data: employeesData } = useGetAllEmployees();

  // Get all upcoming slots (next 14 days by default)
  const { data: slotsData, isLoading, refetch } = useGetUpcomingFreeSessionSlots(14);

  // Extract slots from response: { data: { success: true, data: [...] } }
  const slots = slotsData?.data?.data || [];

  // Debug logging
  console.log("Slots Data:", slotsData);
  console.log("Extracted Slots:", slots);

  // Filter slots by date if a date is selected
  const filteredSlots = selectedDateFilter
    ? slots.filter(slot => {
        const slotDate = slot.startTime ? new Date(slot.startTime).toDateString() : "";
        return slotDate === selectedDateFilter;
      })
    : slots;

  // Get unique dates from slots - safely handle empty array
  const availableDates = [...new Set(slots
    .filter(slot => slot.startTime)
    .map(slot => new Date(slot.startTime).toDateString())
  )];

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceGroupId = result.source.droppableId;
    const destGroupId = result.destination.droppableId;
    const bookingId = result.draggableId;

    if (sourceGroupId === destGroupId) return;

    // Parse the droppableId to get slot and group info
    // Format: "slotId-groupId"
    const [sourceSlotId, sourceGroupIdOnly] = sourceGroupId.split("-");
    const [destSlotId, destGroupIdOnly] = destGroupId.split("-");

    moveBooking(
      {
        bookingId,
        fromGroupId: sourceGroupIdOnly,
        toGroupId: destGroupIdOnly,
        slotId: destSlotId,
      },
      {
        onSuccess: () => {
          refetch();
        },
        onError: (error) => {
          console.error("Failed to move booking:", error);
          alert("Failed to move booking. Please try again.");
        },
      }
    );
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      cancelBooking(bookingId, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  const openMoveModal = (booking, currentGroupId, currentSlotId) => {
    setBookingToMove({ booking, currentGroupId, currentSlotId });
    setMoveModalOpen(true);
  };

  const handleMoveToGroup = (toGroupId, toSlotId) => {
    if (!bookingToMove) return;

    moveBooking(
      {
        bookingId: bookingToMove.booking._id,
        fromGroupId: bookingToMove.currentGroupId,
        toGroupId: toGroupId,
        slotId: toSlotId,
      },
      {
        onSuccess: () => {
          refetch();
          setMoveModalOpen(false);
          setBookingToMove(null);
        },
        onError: (error) => {
          console.error("Failed to move booking:", error);
          alert("Failed to move booking. Please try again.");
        },
      }
    );
  };

  const toggleSlotExpansion = (slotId) => {
    setExpandedSlots(prev => ({
      ...prev,
      [slotId]: !prev[slotId],
    }));
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
      case "Starter":
      case "Basic 1":
      case "Basic 2":
        return "text-blue-500 bg-blue-50 border-blue-200";
      case "Intermediate":
      case "Level 1":
      case "Level 2":
      case "Level 3":
        return "text-purple-500 bg-purple-50 border-purple-200";
      case "Advanced":
      case "Level 4":
      case "Level 5":
      case "Level 6":
      case "Level 7":
      case "Level 8":
      case "Level 9":
        return "text-orange-500 bg-orange-50 border-orange-200";
      default:
        return "text-gray-500 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 max-w-full mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl text-[var(--Main)]">Free Sessions - Seats View</h1>
          <p className="text-[var(--SubText)] mt-1">Drag students between groups or click to move to another date</p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-[var(--Main)]">Filter by Date:</label>
          <select
            value={selectedDateFilter}
            onChange={(e) => setSelectedDateFilter(e.target.value)}
            className="bg-[var(--Input)] py-2 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
          >
            <option value="">All Dates</option>
            {availableDates.map(date => (
              <option key={date} value={date}>
                {formatDate(date)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--Yellow)] mx-auto"></div>
          <p className="mt-4 text-[var(--SubText)]">Loading slots...</p>
        </div>
      ) : filteredSlots.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-lg font-medium text-[var(--SubText)]">No upcoming slots found</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="space-y-6">
            {filteredSlots.map((slot) => {
              const isExpanded = expandedSlots[slot._id] ?? true; // Default expanded
              const slotDate = new Date(slot.startTime);
              const totalBookings = slot.groups?.reduce((sum, g) => sum + (g.bookings?.filter(b => b.status !== 'Cancelled').length || 0), 0) || 0;
              const totalCapacity = slot.groups?.reduce((sum, g) => sum + g.maxParticipants, 0) || 0;

              return (
                <div key={slot._id} className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
                  {/* Slot Header */}
                  <div
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
                    onClick={() => toggleSlotExpansion(slot._id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-blue-900">
                          {formatDate(slotDate)} • {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </h3>
                        <p className="text-sm text-blue-600">
                          {slot.groups?.length || 0} Groups • {totalBookings}/{totalCapacity} Booked
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        totalBookings >= totalCapacity
                          ? "bg-red-100 text-red-700"
                          : totalBookings > 0
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {totalBookings >= totalCapacity ? "Full" : totalBookings > 0 ? "Partial" : "Available"}
                      </div>
                      {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                    </div>
                  </div>

                  {/* Groups - Expandable */}
                  {isExpanded && (
                    <div className="p-6">
                      {slot.groups && slot.groups.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {slot.groups.map((group) => {
                            const activeBookings = group.bookings?.filter(b => b.status !== 'Cancelled') || [];
                            const cancelledBookings = group.bookings?.filter(b => b.status === 'Cancelled') || [];
                            const seats = [];
                            for (let i = 0; i < group.maxParticipants; i++) {
                              seats.push(activeBookings[i] || null);
                            }

                            return (
                              <Droppable key={group._id} droppableId={`${slot._id}-${group._id}`}>
                                {(provided, snapshot) => (
                                  <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`bg-white rounded-xl border-2 transition-all p-4 ${
                                      snapshot.isDraggingOver
                                        ? "border-blue-400 bg-blue-50 ring-4 ring-blue-100"
                                        : "border-gray-100 hover:border-gray-200"
                                    }`}
                                  >
                                    {/* Group Header */}
                                    <div className="flex justify-between items-start mb-4">
                                      <div>
                                        <h4 className="font-bold text-gray-900">{group.name}</h4>
                                        <p className="text-sm text-gray-500">
                                          Instructor: {group.teacher || group.instructor?.name || "Unassigned"}
                                        </p>
                                      </div>
                                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                                        activeBookings.length >= group.maxParticipants
                                          ? "bg-red-50 text-red-600 border border-red-200"
                                          : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                      }`}>
                                        {activeBookings.length}/{group.maxParticipants}
                                      </span>
                                    </div>

                                    {/* Seats Grid - Now showing student names */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                                      {seats.map((booking, index) => (
                                        <div key={index}>
                                          {booking ? (
                                            <Draggable
                                              draggableId={booking._id}
                                              index={index}
                                              isDragDisabled={isMoving}
                                            >
                                              {(dragProvided, dragSnapshot) => (
                                                <div
                                                  ref={dragProvided.innerRef}
                                                  {...dragProvided.draggableProps}
                                                  {...dragProvided.dragHandleProps}
                                                  className={`relative group min-h-[90px] rounded-xl p-3 flex flex-col items-center justify-between transition-all border-2 cursor-pointer ${
                                                    dragSnapshot.isDragging
                                                      ? "bg-blue-100 border-blue-400 shadow-xl scale-110 z-10"
                                                      : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
                                                  }`}
                                                  onClick={() => setSelectedBooking(booking)}
                                                  title={`${booking.name} - ${booking.level}`}
                                                >
                                                  {/* Student Info with Icon and Name */}
                                                  <div className="text-center flex-1">
                                                    {/* User Icon */}
                                                    <User className="h-4 w-4 text-gray-600 mx-auto mb-1" />
                                                    <p className="font-bold text-[10px] text-gray-900 truncate w-full">
                                                      {booking.name}
                                                    </p>
                                                    <p className={`text-[10px] font-medium mt-1 ${getLevelColor(booking.level)}`}>
                                                      {booking.level}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-2 justify-center">
                                                      {booking.status === "Confirmed" && (
                                                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                                                      )}
                                                      {booking.status === "Pending" && (
                                                        <AlertCircle className="h-3 w-3 text-amber-500" />
                                                      )}
                                                    </div>
                                                  </div>

                                                  {/* Quick Actions - Always Visible */}
                                                  <div className="absolute -bottom-2  flex gap-1">
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        openMoveModal(booking, group._id, slot._id);
                                                      }}
                                                      className="bg-blue-500 text-white p-1.5 rounded-full shadow-md hover:bg-blue-600 transition-colors"
                                                      title="Move to another slot"
                                                    >
                                                      <Move className="h-3 w-3" />
                                                    </button>
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCancelBooking(booking._id);
                                                      }}
                                                      className="bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors"
                                                      title="Cancel booking"
                                                    >
                                                        <UserX className="h-3 w-3" />
                                                    </button>
                                                  </div>
                                                </div>
                                              )}
                                            </Draggable>
                                          ) : (
                                            <div className="h-12 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                                              <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>

                                    {/* Cancelled Bookings */}
                                    {cancelledBookings.length > 0 && (
                                      <div className="pt-3 border-t border-gray-100">
                                        <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Cancelled</p>
                                        <div className="flex flex-wrap gap-1">
                                          {cancelledBookings.map(b => (
                                            <div key={b._id} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-gray-400 text-xs">
                                              <UserX className="h-3 w-3" />
                                              <span className="line-through">{b.name.split(' ')[0]}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-[var(--SubText)]">
                          No groups created for this slot
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}

      {/* Move Booking Modal */}
      {moveModalOpen && bookingToMove && (
        <MoveBookingModal
          booking={bookingToMove.booking}
          currentSlotId={bookingToMove.currentSlotId}
          currentGroupId={bookingToMove.currentGroupId}
          allSlots={slots}
          onClose={() => {
            setMoveModalOpen(false);
            setBookingToMove(null);
          }}
          onMove={handleMoveToGroup}
          isMoving={isMoving}
        />
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}

      {/* Loading Overlay */}
      {(isMoving || isCancelling) && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-blue-100 border-t-blue-600 animate-spin rounded-full" />
            <span className="font-bold text-gray-800">
              {isMoving ? "Moving student..." : "Cancelling booking..."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Modal to move a booking to a different slot/group
 */
const MoveBookingModal = ({ booking, currentSlotId, currentGroupId, allSlots, onClose, onMove, isMoving }) => {
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const selectedSlot = allSlots.find(s => s._id === selectedSlotId);

  const handleMove = () => {
    if (selectedGroupId && selectedSlotId) {
      onMove(selectedGroupId, selectedSlotId);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Time";
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-4">
            <Move className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Move Student</h2>
              <p className="text-sm text-gray-600">
                {booking.name} • {booking.level}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Assignment */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Current Assignment
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                {(() => {
                  const currentSlot = allSlots.find(s => s._id === currentSlotId);
                  const currentGroup = currentSlot?.groups?.find(g => g._id === currentGroupId);
                  return (
                    <>
                      <p className="font-medium text-gray-900">
                        {currentSlot ? formatDate(currentSlot.startTime) : 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {currentSlot ? `${formatTime(currentSlot.startTime)} - ${formatTime(currentSlot.endTime)}` : ''}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        {currentGroup?.name || 'Unknown Group'}
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Select New Slot */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Select New Date/Time
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {allSlots
                  .filter(s => s._id !== currentSlotId)
                  .map(slot => {
                    const availableSeats = slot.groups?.reduce((sum, g) =>
                      sum + (g.maxParticipants - (g.bookings?.filter(b => b.status !== 'Cancelled').length || 0)), 0
                    ) || 0;

                    return (
                      <button
                        key={slot._id}
                        onClick={() => setSelectedSlotId(slot._id)}
                        disabled={availableSeats === 0}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${
                          selectedSlotId === slot._id
                            ? "border-blue-500 bg-blue-50"
                            : availableSeats === 0
                            ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">
                              {formatDate(slot.startTime)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </p>
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            availableSeats === 0
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}>
                            {availableSeats} seats
                          </span>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Select Group in Selected Slot */}
          {selectedSlot && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-700 mb-3">Select Group</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {selectedSlot.groups?.map(group => {
                  const availableSeats = group.maxParticipants - (group.bookings?.filter(b => b.status !== 'Cancelled').length || 0);
                  const isSelected = selectedGroupId === group._id;

                  return (
                    <button
                      key={group._id}
                      onClick={() => setSelectedGroupId(group._id)}
                      disabled={availableSeats === 0}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                          : availableSeats === 0
                          ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <p className="font-medium text-gray-900">{group.name}</p>
                      <p className="text-sm text-gray-600">
                        {group.teacher || group.instructor?.name || "No instructor"}
                      </p>
                      <p className={`text-xs font-bold mt-2 ${
                        availableSeats === 0 ? "text-red-600" : "text-green-600"
                      }`}>
                        {availableSeats} seats available
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isMoving}
            className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleMove}
            disabled={!selectedGroupId || !selectedSlotId || isMoving}
            className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isMoving ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Moving...
              </>
            ) : (
              <>
                <Move className="h-4 w-4" />
                Move to {selectedSlot?.groups?.find(g => g._id === selectedGroupId)?.name}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeSessionSeatsView;
