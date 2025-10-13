import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useMoveBooking } from "@/hooks/Actions/free-sessions/useFreeSessionCrudsForAdmin";
import formatTime from "@/utilities/formatTime";

const FreeSessionGroupManager = ({ slot, onBookingMoved }) => {
  const { mutate: moveBooking, isPending: isMoving } = useMoveBooking();

  // Helper function to organize bookings by group
  const organizeBookingsByGroup = () => {
    const grouped = {};

    if (!slot?.groups) return grouped;

    // Initialize empty arrays for each group
    slot.groups.forEach((group) => {
      grouped[group._id] = {
        groupInfo: group,
        bookings: [],
      };
    });

    // Assign bookings to their groups
    slot.groups.forEach((group) => {
      if (group.bookings && group.bookings.length > 0) {
        grouped[group._id].bookings = group.bookings;
      }
    });

    return grouped;
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceGroupId = result.source.droppableId;
    const destGroupId = result.destination.droppableId;
    const bookingId = result.draggableId;

    if (sourceGroupId === destGroupId) return;

    // Find the booking being moved
    const allBookings = slot.groups.flatMap((group) => group.bookings || []);
    const bookingToMove = allBookings.find((b) => b._id === bookingId);

    if (!bookingToMove) return;

    moveBooking(
      {
        bookingId,
        fromGroupId: sourceGroupId,
        toGroupId: destGroupId,
      },
      {
        onSuccess: () => {
          onBookingMoved(); // Refresh the data
        },
        onError: (error) => {
          console.error("Failed to move booking:", error);
          alert("Failed to move booking. Please try again.");
        },
      }
    );
  };

  if (!slot || !slot.groups || slot.groups.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--SubText)]">
        No groups created for this time slot
      </div>
    );
  }

  const bookingsByGroup = organizeBookingsByGroup();

  return (
    <div className="space-y-6">
      {/* Slot Information Header */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-lg text-blue-800">
          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
        </h3>
        <p className="text-sm text-blue-600">
          Total Groups: {slot.groups.length} • Total Bookings:{" "}
          {slot.groups.reduce(
            (total, group) => total + (group.bookings?.length || 0),
            0
          )}
        </p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {slot.groups.map((group) => (
            <Droppable key={group._id} droppableId={group._id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`border rounded-lg p-4 min-h-[200px] transition-colors ${
                    snapshot.isDraggingOver
                      ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200"
                      : "bg-gray-50 border-gray-200 hover:border-gray-300"
                  } ${
                    (bookingsByGroup[group._id]?.bookings.length || 0) >=
                    group.maxParticipants
                      ? "opacity-75 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {/* Group Header */}
                  <div className="flex justify-between items-center mb-3 pb-2 border-b">
                    <h3 className="font-semibold text-gray-800">
                      {group.name}
                    </h3>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        (bookingsByGroup[group._id]?.bookings.length || 0) >=
                        group.maxParticipants
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {bookingsByGroup[group._id]?.bookings.length || 0}/
                      {group.maxParticipants}
                    </span>
                  </div>

                  {/* Bookings List */}
                  <div className="space-y-2 min-h-[120px]">
                    {bookingsByGroup[group._id]?.bookings.map(
                      (booking, index) => (
                        <Draggable
                          key={booking._id}
                          draggableId={booking._id}
                          index={index}
                          isDragDisabled={isMoving}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 rounded border cursor-grab transition-all ${
                                snapshot.isDragging
                                  ? "bg-blue-100 border-blue-300 shadow-lg rotate-2"
                                  : "bg-white border-gray-200 hover:shadow-md hover:border-blue-200"
                              } ${
                                booking.status === "Cancelled"
                                  ? "opacity-50"
                                  : ""
                              }`}
                            >
                              <div className="font-medium text-sm text-gray-800">
                                {booking.name}
                              </div>
                              <div className="text-xs text-gray-500 mb-1">
                                {booking.email}
                              </div>
                              <div className="flex justify-between items-center">
                                <span
                                  className={`text-xs px-1.5 py-0.5 rounded ${
                                    booking.level === "Beginner"
                                      ? "bg-blue-100 text-blue-700"
                                      : booking.level === "Intermediate"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-orange-100 text-orange-700"
                                  }`}
                                >
                                  {booking.level}
                                </span>
                                <span
                                  className={`text-xs px-1.5 py-0.5 rounded ${
                                    booking.status === "Confirmed"
                                      ? "bg-green-100 text-green-700"
                                      : booking.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {booking.status}
                                </span>
                              </div>
                              {booking.freeTest && (
                                <div className="text-xs text-gray-400 mt-1">
                                  ✓ Free Test Taken
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      )
                    )}
                    {provided.placeholder}
                  </div>

                  {/* Group Status Message */}
                  {(bookingsByGroup[group._id]?.bookings.length || 0) >=
                    group.maxParticipants && (
                    <div className="text-xs text-red-500 mt-2 text-center font-medium">
                      🚫 Group Full
                    </div>
                  )}

                  {(!bookingsByGroup[group._id]?.bookings ||
                    bookingsByGroup[group._id].bookings.length === 0) && (
                    <div className="text-xs text-gray-400 mt-4 text-center">
                      No bookings yet
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Loading Overlay */}
      {isMoving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <span className="text-gray-700">Moving booking...</span>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Footer */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h4 className="font-medium text-gray-700 mb-2">Session Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total Capacity: </span>
            <span className="font-medium">
              {slot.groups.reduce(
                (sum, group) => sum + group.maxParticipants,
                0
              )}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Booked: </span>
            <span className="font-medium">
              {slot.groups.reduce(
                (sum, group) => sum + (group.bookings?.length || 0),
                0
              )}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Available: </span>
            <span className="font-medium">
              {slot.groups.reduce(
                (sum, group) =>
                  sum + (group.maxParticipants - (group.bookings?.length || 0)),
                0
              )}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Confirmation Rate: </span>
            <span className="font-medium">
              {(() => {
                const totalBookings = slot.groups.reduce(
                  (sum, group) => sum + (group.bookings?.length || 0),
                  0
                );
                const confirmedBookings = slot.groups.reduce(
                  (sum, group) =>
                    sum +
                    (group.bookings?.filter((b) => b.status === "Confirmed")
                      .length || 0),
                  0
                );
                return totalBookings > 0
                  ? `${Math.round((confirmedBookings / totalBookings) * 100)}%`
                  : "0%";
              })()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeSessionGroupManager;
