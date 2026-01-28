import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useGetFreeSessionBookingById,
  useAddNoteToFreeSessionBooking,
  useUpdateLeadStatusForFreeSessionBooking,
  useUpdateLevelForFreeSessionBooking,
  useUpdateStatusForFreeSessionBooking,
  useUpdateSalesAgentForFreeSessionBooking,
} from "@/hooks/Actions/free-sessions/useFreeSessionBookingCruds";
import {
  useMoveBooking
} from "@/hooks/Actions/free-sessions/useFreeSessionCrudsForAdmin";
import { useGetAllEmployees, useCreateUserFromBooking } from "@/hooks/Actions/users/useCurdsUsers";
import { useAuth } from "@/context/AuthContext";
import InlineSelect from "@/Components/ui/InlineSelect";
import { to12h } from "@/utilities/formatTime";
import formatDateForAPI from "@/utilities/formatDateForApi";
import {
  User,
  Mail,
  Phone,
  MapPin,
  UserCheck,
  Clock,
  Activity,
  ArrowLeft,
  ChevronRight,
  ClipboardList
} from "lucide-react";

const BookingDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isSales = user?.role === "sales";
  const isTeamLeader = user?.role === "team_leader";

  const { data, isPending, refetch } = useGetFreeSessionBookingById({ id });
  const booking = data?.data || data || {};

  const { mutate: addNote, isPending: isAddingNote } = useAddNoteToFreeSessionBooking();
  const { mutate: updateLeadStatus, isPending: isUpdatingLead } = useUpdateLeadStatusForFreeSessionBooking();
  const { mutate: updateLevel, isPending: isUpdatingLevel } = useUpdateLevelForFreeSessionBooking();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateStatusForFreeSessionBooking();
  const { mutate: updateSalesAgent, isPending: isUpdatingSalesAgent } = useUpdateSalesAgentForFreeSessionBooking();
  const { mutate: moveBooking, isPending: isMovingBooking } = useMoveBooking();
  const { data: employeesData } = useGetAllEmployees();
  const { mutate: createUser, isPending: isCreatingUser } = useCreateUserFromBooking();

  const [noteText, setNoteText] = useState("");

  const employees = employeesData?.data?.data || [];
  const salesAgents = employees.filter(e => e.role === "sales");
  const instructors = employees.filter(e => e.role === "instructor");

  const leadOptions = [
    "New", "Contacted", "Interested", "Following_up", "Confirmed",
    "2nd_Confirm", "3rd_Confirm", "Test_Completed", "Attended",
    "Subscribed", "Cancelled", "Not_Interested", "Refunded"
  ];

  const statusOptions = ["Pending", "Confirmed", "Cancelled", "Attended", "Completed"];

  const levelOptions = [
    "Pending", "Basic 1", "Basic 2", "Level 1", "Level 2", "Level 3",
    "Level 4", "Level 5", "Level 6", "Level 7", "Level 8", "Level 9"
  ];

  const renderSlotInfo = (b) => {
    const slot = b?.freeSessionSlotId || b?.freeSessionSlot;
    if (!slot || typeof slot !== "object") return "N/A";

    const start = new Date(slot.startTime);
    const end = new Date(slot.endTime);

    return (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">
          {start.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span className="text-xs text-gray-500">
          {to12h(start.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false }))} -
          {to12h(end.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false }))}
        </span>
      </div>
    );
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--Yellow)]" />
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <Link to="/dash/booking" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-gray-900">{booking?.name}</h1>
              {booking?.userId && (
                <Link
                  to={`/dash/users/${typeof booking.userId === 'object' ? booking.userId._id : booking.userId}`}
                  className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-blue-100 transition-colors"
                >
                  <User size={12} /> Registered Student
                </Link>
              )}
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${booking?.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                {booking?.status}
              </span>
            </div>
            <p className="text-gray-500 flex items-center gap-2 mt-1">
              <ClipboardList className="h-4 w-4" />
              File ID: <span className="font-mono text-xs">{id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Enrollment status</span>
            <InlineSelect
              value={booking?.status || "Pending"}
              options={statusOptions}
              isLoading={isUpdatingStatus}
              onChange={(val) => updateStatus({ id, status: val })}
              nonInteractive={isSales}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50/50 p-6 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-500" />
                Student Information
              </h2>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Full Name</label>
                <p className="text-lg font-semibold text-gray-900">{booking?.name}</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Contact Details</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {booking?.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {booking?.phoneNumber}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Location & Demographics</label>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {booking?.country || "N/A"}
                  </div>
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md text-[10px] font-bold uppercase">
                    {booking?.age}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Joined On</label>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-gray-400" />
                  {new Date(booking?.createdAt).toLocaleString("en-UK")}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Management Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50/50 p-6 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-500" />
                Management & Assignment
              </h2>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Current Slot</label>
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex justify-between items-center group transition-colors hover:bg-blue-50">
                  {renderSlotInfo(booking)}
                  <Link
                    to={`/dash/free-sessions?date=${formatDateForAPI(new Date(booking?.freeSessionSlotId?.startTime))}&slot=${booking?.freeSessionSlotId?._id}`}
                    className="p-2 bg-white text-blue-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Student Profile</label>
                  {isCreatingUser ? (
                    <span className="text-xs text-[var(--Yellow)] animate-pulse">Creating...</span>
                  ) : booking?.userId ? (
                    <Link
                      to={`/dash/users/${typeof booking.userId === 'object' ? booking.userId._id : booking.userId}`}
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      View Profile <ChevronRight className="h-3 w-3" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => createUser({ id })}
                      disabled={isCreatingUser}
                      className="text-xs font-bold text-[var(--Yellow)] hover:underline flex items-center gap-1"
                    >
                      Generate Verified Profile <UserCheck className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {(!booking?.userId || booking?.userId.role !== 'student') && (
                  <div className="bg-amber-50 text-amber-700 text-[10px] p-2 rounded-lg border border-amber-100 flex items-start gap-2">
                    <Activity className="h-3 w-3 mt-0.5 shrink-0" />
                    <span>Generates a profile with password <code className="font-mono font-bold">password123</code></span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Teacher & Group</label>
                <InlineSelect
                  value={booking?.freeSessionGroupId?._id ? `group:${booking.freeSessionGroupId._id}`
                    : booking?.freeSessionGroupId?.instructor?._id ? `instructor:${booking.freeSessionGroupId.instructor._id}`
                      : ""}
                  options={(booking?.availableInstructors || []).map((inst) => {
                    const isExistingGroup = !!inst.slotGroupId;
                    return {
                      label: `${inst.name} ${inst.groupName ? `(${inst.groupName})` : "(New Group)"}`,
                      value: isExistingGroup ? `group:${inst.slotGroupId}` : `instructor:${inst._id}`,
                    };
                  })}
                  isLoading={isMovingBooking}
                  onChange={(val) => {
                    if (val && booking?.freeSessionSlotId?._id) {
                      const [type, teacherOrGroupId] = val.split(":");
                      const moveData = {
                        bookingId: id,
                        fromGroupId: booking.freeSessionGroupId?._id,
                        slotId: booking.freeSessionSlotId._id,
                      };
                      if (type === "group") moveData.toGroupId = teacherOrGroupId;
                      else moveData.toInstructorId = teacherOrGroupId;
                      moveBooking(moveData);
                    }
                  }}
                  placeholder="Select Instructor/Group"
                  nonInteractive={isSales || isTeamLeader}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Lead Status</label>
                <InlineSelect
                  value={booking?.leadStatus || "New"}
                  options={leadOptions.map(opt => ({ label: opt.replaceAll("_", " "), value: opt }))}
                  isLoading={isUpdatingLead}
                  onChange={(val) => updateLeadStatus({ id, leadStatus: val })}
                  nonInteractive={isSales}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Assigned Level</label>
                <InlineSelect
                  value={booking?.level || "Pending"}
                  options={levelOptions}
                  isLoading={isUpdatingLevel}
                  onChange={(val) => updateLevel({ id, level: val })}
                  nonInteractive={isSales}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Responsible Sales</label>
                <InlineSelect
                  value={booking?.salesAgentId?._id || ""}
                  options={salesAgents.map(ag => ({ label: ag.name, value: ag._id }))}
                  isLoading={isUpdatingSalesAgent}
                  onChange={(val) => updateSalesAgent({ id, salesAgentId: val })}
                  placeholder="Assign Sales Agent"
                  nonInteractive={isSales}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Notes */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col min-h-[500px]">
            <div className="bg-gray-50/50 p-6 border-b border-gray-100 shrink-0">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-indigo-500" />
                Internal Notes
              </h2>
            </div>

            <div className="p-6 flex flex-col gap-4 overflow-hidden h-full">
              {/* Note Input */}
              <div className="relative shrink-0">
                <textarea
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 pr-12 text-sm focus:ring-2 focus:ring-[var(--Yellow)] transition-all resize-none h-24"
                  placeholder="Add a detailed update..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <button
                  disabled={isAddingNote || !noteText.trim()}
                  onClick={() => {
                    addNote({ id, note: noteText.trim() });
                    setNoteText("");
                  }}
                  className="absolute bottom-4 right-4 p-2 bg-[var(--Main)] text-white rounded-xl shadow-lg hover:bg-opacity-90 disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Note List */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {(booking?.notes || []).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400 opacity-50">
                    <ClipboardList className="h-12 w-12 mb-2" />
                    <p className="text-xs font-medium">No notes available</p>
                  </div>
                ) : (
                  [...(booking.notes || [])].reverse().map((n) => (
                    <div key={n._id || n.createdAt} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 group relative">
                      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{n.text}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 bg-blue-100 rounded-lg flex items-center justify-center text-[10px] font-bold text-blue-600">
                            {(n.createdBy || "S").charAt(0)}
                          </div>
                          <span className="text-[10px] font-bold text-gray-500">{n.createdBy || "System"}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {n.createdAt ? new Date(n.createdAt).toLocaleDateString("en-UK", { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ""}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookingDetails;
