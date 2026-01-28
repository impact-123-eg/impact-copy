import { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import {
  useAutoAssignInstructors,
  useCancelFreeSessionBooking,
  useUpdateGroupTeacher
} from "@/hooks/Actions/free-sessions/useFreeSessionCrudsForAdmin";
import { useGetAllEmployees } from "@/hooks/Actions/users/useCurdsUsers";
import formatTime from "@/utilities/formatTime";
import InlineSelect from "@/Components/ui/InlineSelect";
import {
  User,
  UserX,
  Users,
  Calendar,
  XCircle,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import BookingDetailsModal from "./BookingDetailsModal";

const FreeSessionGroupManager = ({ slot, onBookingMoved, isMoving, _onMoveBooking, hideHeader = false }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { mutate: autoAssign, isPending: isAssigning } = useAutoAssignInstructors();
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelFreeSessionBooking();
  const { mutate: updateTeacher, isPending: isUpdatingTeacher } = useUpdateGroupTeacher();
  const { data: employeesData } = useGetAllEmployees();

  const instructors = employeesData?.data?.data?.filter(e => e.role === "instructor") || [];

  // Helper function to organize bookings by group
  const organizeBookingsByGroup = () => {
    const grouped = {};

    if (!slot?.groups) return grouped;

    slot.groups.forEach((group) => {
      grouped[group._id] = {
        groupInfo: group,
        bookings: group.bookings || [],
      };
    });

    return grouped;
  };

  const handleAutoAssign = () => {
    if (!slot?._id) return;
    autoAssign(slot._id, {
      onSuccess: () => {
        onBookingMoved();
      },
      onError: (error) => {
        alert("Auto-assignment failed: " + error.message);
      }
    });
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking? The seat will be made available for others.")) {
      cancelBooking(bookingId, {
        onSuccess: () => {
          onBookingMoved();
        }
      });
    }
  };

  if (!slot || !slot.groups || slot.groups.length === 0) {
    if (hideHeader) return null; // Don't show anything if no groups in a list of slots
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-[var(--SubText)]">
        <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <p className="text-lg font-medium">No groups created for this time slot</p>
      </div>
    );
  }

  const bookingsByGroup = organizeBookingsByGroup();

  return (
    <div className="space-y-6">
      {/* Slot Information Header */}
      {!hideHeader && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-blue-900 flex items-center gap-2">
                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
              </h3>
              <p className="text-sm text-blue-600 font-medium">
                {slot.groups.length} Groups • {slot.groups.reduce((sum, g) => sum + (g.bookings?.length || 0), 0)} Total Bookings
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Groups */}
      <div className={`grid gap-6 ${hideHeader ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"}`}>
        {slot.groups.map((group) => {
          const groupBookings = bookingsByGroup[group._id]?.bookings || [];
          const activeBookings = groupBookings.filter(b => b.status !== 'Cancelled');
          const cancelledBookings = groupBookings.filter(b => b.status === 'Cancelled');

          // Generate visual "seats"
          const seats = [];
          for (let i = 0; i < group.maxParticipants; i++) {
            seats.push(activeBookings[i] || null);
          }

          return (
            <Droppable key={group._id} droppableId={group._id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`bg-white rounded-2xl border-2 transition-all p-5 shadow-sm ${snapshot.isDraggingOver
                    ? "border-blue-400 bg-blue-50/50 ring-4 ring-blue-100"
                    : "border-gray-100 hover:border-gray-200"
                    }`}
                >
                  {/* Group Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{group.name}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm bg-gray-50/50 p-1 px-2 rounded-lg border border-gray-100">
                        <User className="h-3.5 w-3.5 text-gray-400" />
                        <InlineSelect
                          value={group.instructor || instructors.find(i => i.name === group.teacher)?._id || ""}
                          options={instructors.map(inst => ({ label: inst.name, value: inst._id }))}
                          isLoading={isUpdatingTeacher}
                          onChange={(val) => {
                            updateTeacher({ groupId: group._id, teacherId: val }, {
                              onSuccess: () => onBookingMoved()
                            });
                          }}
                          placeholder="Select Teacher"
                          className="border-none !p-0 shadow-none bg-transparent hover:bg-white/50"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${activeBookings.length >= group.maxParticipants
                        ? "bg-red-50 text-red-600 border-red-100"
                        : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        }`}>
                        {activeBookings.length} / {group.maxParticipants} Seats
                      </span>
                    </div>
                  </div>

                  {/* Visual Seats Grid */}
                  <div className="grid grid-cols-4 gap-3 mb-6">
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
                                className={`relative group h-14 rounded-xl flex items-center justify-center transition-all border-2 ${dragSnapshot.isDragging
                                  ? "bg-blue-100 border-blue-400 shadow-xl scale-110 z-10"
                                  : "bg-white border-blue-100 hover:border-blue-300 hover:shadow-md cursor-grab active:cursor-grabbing"
                                  }`}
                                title={`Click to view details - ${booking.name} (${booking.level})`}
                                onClick={() => {
                                  console.log("Seat clicked:", booking);
                                  setSelectedBooking(booking);
                                }}
                              >
                                <button
                                  className="text-center w-full h-full p-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBooking(booking);
                                  }}
                                >
                                  <User className={`h-6 w-6 mx-auto ${booking.level === "Beginner" ? "text-blue-500" :
                                    booking.level === "Intermediate" ? "text-purple-500" : "text-orange-500"
                                    }`} />
                                  <div className="text-[9px] font-bold truncate max-w-[50px] mx-auto overflow-hidden">
                                    {booking.name.split(' ')[0]}
                                  </div>
                                </button>

                                {/* Quick Actions Hover Over */}
                                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCancelBooking(booking._id);
                                    }}
                                    className="bg-white text-red-500 p-1.5 rounded-full shadow-lg border border-red-100 hover:bg-red-50 transition-colors"
                                  >
                                    <UserX className="h-3 w-3" />
                                  </button>
                                </div>

                                {/* Confirmation Badge */}
                                {booking.status === "Confirmed" && (
                                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5 border-2 border-white shadow-sm">
                                    <CheckCircle2 className="h-2.5 w-2.5" />
                                  </div>
                                )}
                                {booking.status === "Pending" && (
                                  <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 border-2 border-white shadow-sm">
                                    <AlertCircle className="h-2.5 w-2.5" />
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ) : (
                          <div className="h-14 rounded-xl border-2 border-dashed border-gray-100 bg-gray-50/50 flex items-center justify-center text-gray-200">
                            <div className="h-2 w-2 rounded-full bg-gray-200" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Cancelled List (Still in group but not taking seat) */}
                  {cancelledBookings.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-50">
                      <h4 className="text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-wider">
                        Cancelled Bookings
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {cancelledBookings.map(b => (
                          <div key={b._id} className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-lg text-gray-400 border border-gray-200 opacity-75">
                            <UserX className="h-3 w-3" />
                            <span className="text-[10px] font-medium line-through decoration-1">{b.name}</span>
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

      {/* Global Loading Overlays */}
      {(isMoving || isCancelling) && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-12 w-12 border-4 border-blue-100 border-t-blue-600 animate-spin rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-4 w-4 bg-blue-600 rounded-full animate-pulse" />
              </div>
            </div>
            <span className="font-bold text-gray-800">{isMoving ? "Updating student seat..." : "Cancelling booking..."}</span>
          </div>
        </div>
      )}

      {/* Modern Statistics Cards */}
      {!hideHeader && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            {
              label: "Total Capacity",
              value: slot.groups.reduce((sum, g) => sum + g.maxParticipants, 0),
              icon: Users,
              color: "blue"
            },
            {
              label: "Active Students",
              value: slot.groups.reduce((sum, g) => sum + (g.bookings?.filter(b => b.status !== 'Cancelled').length || 0), 0),
              icon: CheckCircle2,
              color: "emerald"
            },
            {
              label: "Free Seats",
              value: slot.groups.reduce((sum, g) => sum + (g.maxParticipants - (g.bookings?.filter(b => b.status !== 'Cancelled').length || 0)), 0),
              icon: User,
              color: "indigo"
            },
            {
              label: "Cancellations",
              value: slot.groups.reduce((sum, g) => sum + (g.bookings?.filter(b => b.status === 'Cancelled').length || 0), 0),
              icon: XCircle,
              color: "rose"
            }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-black mt-1 text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

export default FreeSessionGroupManager;
