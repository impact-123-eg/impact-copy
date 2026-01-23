import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useGetAllFreeSessionBookings,
  useUpdateLeadStatusForFreeSessionBooking,
  useUpdateLevelForFreeSessionBooking,
  useCreateManualBooking,
  useUpdateStatusForFreeSessionBooking,
  useUpdateSalesAgentForFreeSessionBooking,
} from "@/hooks/Actions/free-sessions/useFreeSessionBookingCruds";
import { useGetAllEmployees } from "@/hooks/Actions/users/useCurdsUsers";
import { useUpdateGroupTeacher } from "@/hooks/Actions/free-sessions/useFreeSessionCrudsForAdmin";
import InlineSelect from "@/Components/ui/InlineSelect";
import { to12h } from "@/utilities/formatTime";
import FreeSessionCalendar from "@/Components/FreeSessionCalendar";
import { useFormik } from "formik";
import { freeSessionValidationSchema } from "@/Validation";
import { useTranslation } from "react-i18next"; // fallback if not available
import cntris from "@/data/Countries.json"; // Adjust path if needed, usually ../data/Countries.json in pages/FreeSession.jsx so here it is ../../data ??
// Pages is src/pages/dashboard/StudentsBooking.jsx
// Countries is src/data/Countries.json
// So path is ../../data/Countries.json
import countriesData from "../../data/Countries.json";

function StudentsBooking() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("");
  const [teamLeaderFilter, setTeamLeaderFilter] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // Default limit

  const {
    data: freeSessionsData,
    isPending,
    isLoading,
  } = useGetAllFreeSessionBookings({ page, limit });
  const { mutate: updateLeadStatus, isPending: isUpdatingLead } =
    useUpdateLeadStatusForFreeSessionBooking();
  const { mutate: updateLevel, isPending: isUpdatingLevel } =
    useUpdateLevelForFreeSessionBooking();

  // Teacher Update Hooks
  const { data: employeesData } = useGetAllEmployees();
  const { mutate: updateTeacher, isPending: isUpdatingTeacher } = useUpdateGroupTeacher();

  // Status & Sales Update Hooks
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateStatusForFreeSessionBooking();
  const { mutate: updateSalesAgent, isPending: isUpdatingSalesAgent } = useUpdateSalesAgentForFreeSessionBooking();

  // Data comes in as { data: [...], total, page, limit }
  const bookings = freeSessionsData?.data?.data || [];
  const totalPages = freeSessionsData?.data?.totalPages || 1;
  const currentPage = freeSessionsData?.data?.page || 1;

  const employees = employeesData?.data?.data || [];
  // Filter for instructors only if possible, otherwise show all employees
  const instructors = employees.filter(e => e.role === "instructor");

  const handleSearchChange = (e) =>
    setSearchQuery(e.target.value.toLowerCase());

  const getStatusCount = (status) =>
    bookings.filter((b) => b.status === status).length;
  const getLeadStatusCount = (status) =>
    bookings.filter((b) => b.leadStatus === status).length;

  // Date range filters should be declared before using in filteredBookings
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredBookings = bookings?.filter((booking) => {
    const matchesSearch =
      booking?.name?.toLowerCase().includes(searchQuery) ||
      booking?.email?.toLowerCase().includes(searchQuery) ||
      booking?.phoneNumber?.toLowerCase().includes(searchQuery) ||
      booking?.freeSessionGroupId?.instructor?.name?.toLowerCase().includes(searchQuery);

    const matchesStatus = statusFilter
      ? booking?.status === statusFilter
      : true;
    const matchesLeadStatus = leadStatusFilter
      ? booking?.leadStatus === leadStatusFilter
      : true;
    const matchesTeamLeader = teamLeaderFilter
      ? booking?.salesAgentId?.teamId === teamLeaderFilter
      : true;

    const createdAt = booking?.createdAt ? new Date(booking.createdAt) : null;
    const inDateRange = (() => {
      if (!startDate && !endDate) return true;
      if (!createdAt) return false;
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && createdAt < start) return false;
      if (end) {
        const endOfDay = new Date(end);
        endOfDay.setHours(23, 59, 59, 999);
        if (createdAt > endOfDay) return false;
      }
      return true;
    })();

    return matchesSearch && matchesStatus && matchesLeadStatus && matchesTeamLeader && inDateRange;
  });

  const [updatingLevelId, setUpdatingLevelId] = useState(null);
  const [updatingLeadId, setUpdatingLeadId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [updatingSalesId, setUpdatingSalesId] = useState(null);
  const [updatingTeacherId, setUpdatingTeacherId] = useState(null);

  useEffect(() => {
    if (!isUpdatingLevel) setUpdatingLevelId(null);
  }, [isUpdatingLevel]);
  useEffect(() => {
    if (!isUpdatingLead) setUpdatingLeadId(null);
  }, [isUpdatingLead]);
  useEffect(() => {
    if (!isUpdatingTeacher) setUpdatingTeacherId(null);
  }, [isUpdatingTeacher]);
  useEffect(() => {
    if (!isUpdatingStatus) setUpdatingStatusId(null);
  }, [isUpdatingStatus]);
  useEffect(() => {
    if (!isUpdatingSalesAgent) setUpdatingSalesId(null);
  }, [isUpdatingSalesAgent]);

  // Manual Booking State
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [manualStep, setManualStep] = useState(1);
  const [manualSlot, setManualSlot] = useState(null);
  const { mutate: createManualBooking, isPending: isCreatingManual } = useCreateManualBooking();

  const manualFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      age: "",
      country: "",
      freeSessionSlotId: "",
    },
    // Simple validation or re-use schema? Attempting simple for dash
    onSubmit: (values) => {
      createManualBooking(
        { ...values, freeSessionSlotId: manualSlot?._id },
        {
          onSuccess: () => {
            setIsManualOpen(false);
            manualFormik.resetForm();
            setManualSlot(null);
            setManualStep(1);
            alert("Manual Booking Created Successfully!");
            freeSessionsData?.refetch?.(); // Refetch list
          },
          onError: (err) => {
            alert(err.response?.data?.message || "Failed to create booking");
          }
        }
      );
    },
  });

  const leadOptions = [
    "New",
    "Contacted",
    "Interested",
    "Following_up",
    "Confirmed",
    "2nd_Confirm",
    "3rd_Confirm",
    "Test_Completed",
    "Attended",
    "Subscribed",
    "Cancelled",
    "Not_Interested",
    "Refunded",
  ];

  const statusOptions = ["Pending", "Confirmed", "Cancelled", "Attended", "Completed"];

  const salesAgents = employees.filter(e => e.role === "sales");
  const teamLeaders = employees.filter(e => e.role === "team_leader");

  const levelOptions = [
    "Pending",
    "Basic 1",
    "Basic 2",
    "Level 1",
    "Level 2",
    "Level 3",
    "Level 4",
    "Level 5",
    "Level 6",
    "Level 7",
    "Level 8",
    "Level 9",
  ];

  const renderSlot = (b) => {
    const slot = b?.freeSessionSlotId || b?.freeSessionSlot;
    const teacherRaw = b?.freeSessionGroupId?.teacher;
    const teacherName = typeof teacherRaw === "object" ? teacherRaw?.name : teacherRaw;

    const teacherDisplay = teacherName ? (
      <div className="text-[10px] text-[var(--SubText)] mt-1">
        Teacher: {teacherName}
      </div>
    ) : null;

    if (slot && typeof slot === "object") {
      const hasISO =
        typeof slot.startTime === "string" && typeof slot.endTime === "string";
      if (hasISO) {
        const start = new Date(slot.startTime);
        const end = new Date(slot.endTime);
        const dateStr = start.toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        const startTimeStr = start.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        const endTimeStr = end.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        return (
          <>
            <div className="text-sm">{dateStr}</div>
            <div className="text-xs text-[var(--SubText)]">
              {startTimeStr} - {endTimeStr}
            </div>
            {teacherDisplay}
          </>
        );
      }
      const dateStr = slot.date
        ? new Date(slot.date).toLocaleDateString("en-US")
        : "N/A";
      const timeStr =
        slot.startTime && slot.endTime
          ? `${to12h(slot.startTime)} - ${to12h(slot.endTime)}`
          : "";
      return (
        <>
          <div className="text-sm">{dateStr}</div>
          <div className="text-xs text-[var(--SubText)]">{timeStr}</div>
          {teacherDisplay}
        </>
      );
    }
    if (typeof slot === "string") {
      return (
        <>
          <div className="text-sm">Slot #{slot.slice(-6)}</div>
          {teacherDisplay}
        </>
      );
    }
    return (
      <>
        <div className="text-sm">N/A</div>
        {teacherDisplay}
      </>
    );
  };

  return (
    <main className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl text-[var(--Main)]">
          Free Session Bookings
        </h1>
        <button
          onClick={() => setIsManualOpen(true)}
          className="px-4 py-2 bg-[var(--Main)] text-white rounded-lg hover:bg-[var(--Main)]/90 transition-colors text-sm font-medium"
        >
          + Book Manually
        </button>
      </div>

      {/* Manual Booking Modal */}
      {isManualOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[var(--Main)]">
                Manual Booking (Step {manualStep}/2)
              </h2>
              <button
                onClick={() => setIsManualOpen(false)}
                className="text-gray-500 hover:text-gray-700 font-bold"
              >
                ✕
              </button>
            </div>

            {manualStep === 1 ? (
              <form onSubmit={(e) => { e.preventDefault(); setManualStep(2); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[var(--Main)]">Name</label>
                    <input
                      name="name"
                      required
                      className="w-full border p-2 rounded"
                      onChange={manualFormik.handleChange}
                      value={manualFormik.values.name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--Main)]">Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full border p-2 rounded"
                      onChange={manualFormik.handleChange}
                      value={manualFormik.values.email}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--Main)]">Phone</label>
                    <input
                      name="phoneNumber"
                      required
                      className="w-full border p-2 rounded"
                      onChange={manualFormik.handleChange}
                      value={manualFormik.values.phoneNumber}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--Main)]">Country</label>
                    <select
                      name="country"
                      required
                      className="w-full border p-2 rounded"
                      onChange={manualFormik.handleChange}
                      value={manualFormik.values.country}
                    >
                      <option value="">Select Country</option>
                      {countriesData.map(c => (
                        <option key={c.nameEn} value={c.nameEn}>{c.nameEn}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--Main)]">Age</label>
                    <select
                      name="age"
                      required
                      className="w-full border p-2 rounded"
                      onChange={manualFormik.handleChange}
                      value={manualFormik.values.age}
                    >
                      <option value="">Select Age</option>
                      <option value="kid">Kid</option>
                      <option value="teen">Teen</option>
                      <option value="adult">Adult</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="bg-[var(--Yellow)] text-white px-6 py-2 rounded-full font-bold"
                  >
                    Next: Select Slot
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <FreeSessionCalendar
                  onSlotSelect={(slot) => {
                    setManualSlot(slot);
                  }}
                />
                {manualSlot && (
                  <div className="bg-green-50 p-4 rounded border border-green-200">
                    Selected: <span className="font-bold">{manualSlot.date} {manualSlot.startTime}</span>
                  </div>
                )}
                <div className="flex justify-between pt-4">
                  <button onClick={() => setManualStep(1)} className="underline">Back</button>
                  <button
                    onClick={manualFormik.handleSubmit}
                    disabled={!manualSlot || isCreatingManual}
                    className="bg-[var(--Yellow)] text-white px-6 py-2 rounded-full font-bold disabled:opacity-50"
                  >
                    {isCreatingManual ? "Creating..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <section className="bg-white p-6 rounded-2xl shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Search Bookings
            </label>
            <div className="relative">
              <input
                type="search"
                placeholder="Search by name, email, or phone"
                className="w-full bg-[var(--Input)] py-3 px-4 pr-10 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <span className="absolute right-3 top-3 text-[var(--SubText)]">
                🔍
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            >
              <option value="">All Status ({bookings.length})</option>
              <option value="Pending">
                Pending ({getStatusCount("Pending")})
              </option>
              <option value="Confirmed">
                Confirmed ({getStatusCount("Confirmed")})
              </option>
              <option value="Cancelled">
                Cancelled ({getStatusCount("Cancelled")})
              </option>
              <option value="Attended">
                Attended ({getStatusCount("Attended")})
              </option>
              <option value="Completed">
                Completed ({getStatusCount("Completed")})
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Lead Status
            </label>
            <select
              value={leadStatusFilter}
              onChange={(e) => setLeadStatusFilter(e.target.value)}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            >
              <option value="">All Leads ({bookings.length})</option>
              {leadOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt.replaceAll("_", " ")} ({getLeadStatusCount(opt)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Start Date (Created At)
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              End Date (Created At)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Team Leader
            </label>
            <select
              value={teamLeaderFilter}
              onChange={(e) => setTeamLeaderFilter(e.target.value)}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            >
              <option value="">All Team Leaders</option>
              {teamLeaders.map(tl => (
                <option key={tl._id} value={tl._id}>{tl.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow overflow-hidden">
        {isPending || isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--Yellow)] mx-auto"></div>
            <p className="mt-4 text-[var(--SubText)]">Loading bookings...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--Light)]">
                <tr className="text-left text-[var(--SubText)]">
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Sales Agent</th>
                  <th className="p-4 font-medium">Instructor</th>
                  <th className="p-4 font-medium">Country</th>
                  <th className="p-4 font-medium">Age</th>
                  <th className="p-4 font-medium w-56">Slot</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Level</th>
                  <th className="p-4 font-medium">Lead Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--Light)]">
                {filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-[var(--Light)]/40">
                    <td className="p-4">
                      <div className="font-semibold text-[var(--Main)]">
                        <Link
                          to={`/dash/booking/${b._id}`}
                          className="hover:underline"
                        >
                          {b?.name || "N/A"}
                        </Link>
                      </div>
                      <div className="text-[10px] text-[var(--SubText)] mt-1">
                        Joined: {new Date(b.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{b?.email || "N/A"}</div>
                      <div className="text-sm">{b?.phoneNumber || "N/A"}</div>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex flex-col gap-2">
                        {/* <div className="group relative">
                          <span className="font-medium text-[var(--Main)] cursor-help border-b border-dotted border-gray-400">
                            {b.salesAgentId?.name || "Unassigned"}
                          </span>
                          <div className="invisible group-hover:visible absolute z-10 bg-gray-800 text-white text-[10px] p-2 rounded shadow-lg -top-8 left-0 min-w-max">
                            {b.assignmentReason || "Round Robin"}
                          </div>
                        </div> */}
                        <InlineSelect
                          value={b.salesAgentId?._id ?? ""}
                          options={salesAgents.map(ag => ({ label: ag.name, value: ag._id }))}
                          isLoading={updatingSalesId === b._id && isUpdatingSalesAgent}
                          onChange={(val) => {
                            setUpdatingSalesId(b._id);
                            updateSalesAgent({ id: b._id, salesAgentId: val });
                          }}
                          placeholder="Assign Sales"
                        />
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      {/* Detailed Instructor Assignment */}
                      <div className="flex flex-col gap-2">
                        {b?.freeSessionGroupId?.instructor?.name ? (
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-[var(--Main)]">
                              {b.freeSessionGroupId.instructor.name}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full w-fit font-bold ${b.instructorStatus === "Confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                              }`}>
                              {b.instructorStatus || "Pending"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[var(--SubText)]">Pending Group Assignment</span>
                        )}
                        <InlineSelect
                          value={b?.freeSessionGroupId?.instructor?._id || ""}
                          options={instructors.map(inst => ({ label: inst.name, value: inst._id }))}
                          isLoading={updatingTeacherId === b._id && isUpdatingTeacher}
                          onChange={(val) => {
                            if (val && b?.freeSessionGroupId?._id) {
                              setUpdatingTeacherId(b._id);
                              updateTeacher({ groupId: b.freeSessionGroupId._id, teacherId: val });
                            }
                          }}
                          placeholder="Assign Instructor"
                        />
                      </div>
                    </td>
                    <td className="p-4">{b?.country || "N/A"}</td>
                    <td className="p-4">{b?.age || "N/A"}</td>
                    <td className="p-4 min-w-[14rem]">{renderSlot(b)}</td>
                    <td className="p-4">
                      <InlineSelect
                        value={b.status ?? "Pending"}
                        options={statusOptions}
                        isLoading={updatingStatusId === b._id && isUpdatingStatus}
                        onChange={(val) => {
                          setUpdatingStatusId(b._id);
                          updateStatus({ id: b._id, status: val });
                        }}
                      />
                    </td>
                    <td className="p-4">
                      <InlineSelect
                        value={b?.level ?? "Pending"}
                        options={levelOptions}
                        isLoading={updatingLevelId === b._id && isUpdatingLevel}
                        onChange={(val) => {
                          setUpdatingLevelId(b._id);
                          updateLevel({ id: b._id, level: val });
                        }}
                      />
                    </td>
                    <td className="p-4">
                      <InlineSelect
                        value={b?.leadStatus ?? "New"}
                        options={leadOptions.map(opt => ({ label: opt.replaceAll("_", " "), value: opt }))}
                        isLoading={updatingLeadId === b._id && isUpdatingLead}
                        onChange={(val) => {
                          setUpdatingLeadId(b._id);
                          updateLeadStatus({ id: b._id, leadStatus: val });
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🗓️</div>
            <h2 className="text-xl font-semibold text-[var(--Main)] mb-2">
              No Bookings Found
            </h2>
            <p className="text-[var(--SubText)]">
              {searchQuery || statusFilter || leadStatusFilter
                ? "Try adjusting your search or filters"
                : "No bookings have been made yet"}
            </p>
          </div>
        )}
      </section>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={currentPage === 1 || isPending}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => {
            if (currentPage < totalPages) {
              setPage((old) => old + 1);
            }
          }}
          disabled={currentPage === totalPages || isPending}
          className="px-4 py-2 bg-[var(--Yellow)] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}

export default StudentsBooking;
