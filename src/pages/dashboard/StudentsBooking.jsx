import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useGetAllFreeSessionBookings,
  useUpdateLeadStatusForFreeSessionBooking,
  useUpdateLevelForFreeSessionBooking,
} from "@/hooks/Actions/free-sessions/useFreeSessionBookingCruds";
import { to12h } from "@/utilities/formatTime";

function StudentsBooking() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("");

  const {
    data: freeSessionsData,
    isPending,
    isLoading,
  } = useGetAllFreeSessionBookings();
  const { mutate: updateLeadStatus, isPending: isUpdatingLead } =
    useUpdateLeadStatusForFreeSessionBooking();
  const { mutate: updateLevel, isPending: isUpdatingLevel } =
    useUpdateLevelForFreeSessionBooking();
  const bookings = freeSessionsData?.data || [];

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
      booking?.phoneNumber?.includes(searchQuery);

    const matchesStatus = statusFilter
      ? booking?.status === statusFilter
      : true;
    const matchesLeadStatus = leadStatusFilter
      ? booking?.leadStatus === leadStatusFilter
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

    return matchesSearch && matchesStatus && matchesLeadStatus && inDateRange;
  });

  const [noteById, setNoteById] = useState({});
  const [leadById, setLeadById] = useState({});
  const [levelById, setLevelById] = useState({});
  const [updatingLevelId, setUpdatingLevelId] = useState(null);
  const [updatingLeadId, setUpdatingLeadId] = useState(null);
  useEffect(() => {
    if (!isUpdatingLevel) setUpdatingLevelId(null);
  }, [isUpdatingLevel]);
  useEffect(() => {
    if (!isUpdatingLead) setUpdatingLeadId(null);
  }, [isUpdatingLead]);

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
  ];

  const levelOptions = [
    // "Beginner",
    // "Intermediate",
    // "Advanced",
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

  // startDate and endDate already declared above

  const renderSlot = (b) => {
    const slot = b?.freeSessionSlotId || b?.freeSessionSlot;
    const teacherRaw = b?.freeSessionGroupId?.teacher;
    const teacher =
      typeof teacherRaw === "object" ? teacherRaw?.name : teacherRaw;
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
            {teacher ? (
              <div className="text-xs text-[var(--SubText)]">
                Teacher: {teacher}
              </div>
            ) : null}
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
          {teacher ? (
            <div className="text-xs text-[var(--SubText)]">
              Teacher: {teacher}
            </div>
          ) : null}
        </>
      );
    }
    if (typeof slot === "string") {
      return (
        <>
          <div className="text-sm">Slot #{slot.slice(-6)}</div>
          {teacher ? (
            <div className="text-xs text-[var(--SubText)]">
              Teacher: {teacher}
            </div>
          ) : null}
        </>
      );
    }
    return (
      <>
        <div className="text-sm">N/A</div>
        {teacher ? (
          <div className="text-xs text-[var(--SubText)]">
            Teacher: {teacher}
          </div>
        ) : null}
      </>
    );
  };

  return (
    <main className="space-y-6 max-w-7xl mx-auto">
      <h1 className="font-bold text-2xl text-[var(--Main)]">
        Free Session Bookings
      </h1>

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
              <option value="New">New ({getLeadStatusCount("New")})</option>
              <option value="Contacted">
                Contacted ({getLeadStatusCount("Contacted")})
              </option>
              <option value="Test_Completed">
                Test Completed ({getLeadStatusCount("Test_Completed")})
              </option>
              <option value="Session_Attended">
                Session Attended ({getLeadStatusCount("Session_Attended")})
              </option>
              <option value="Proposal_Sent">
                Proposal Sent ({getLeadStatusCount("Proposal_Sent")})
              </option>
              <option value="Converted">
                Converted ({getLeadStatusCount("Converted")})
              </option>
              <option value="Not_Interested">
                Not Interested ({getLeadStatusCount("Not_Interested")})
              </option>
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
                      {/* <div className="text-xs text-[var(--SubText)]">
                        #{b?._id?.slice(-6)}
                      </div> */}
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{b?.email || "N/A"}</div>
                      <div className="text-sm">{b?.phoneNumber || "N/A"}</div>
                    </td>
                    <td className="p-4">{b?.country || "N/A"}</td>
                    <td className="p-4">{b?.age || "N/A"}</td>
                    <td className="p-4 min-w-[14rem]">{renderSlot(b)}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--Input)]">
                        {b?.status || "Pending"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <select
                          className="bg-[var(--Input)] px-2 py-1 rounded"
                          value={levelById?.[b._id] ?? b?.level ?? "Pending"}
                          onChange={(e) =>
                            setLevelById((prev) => ({
                              ...prev,
                              [b._id]: e.target.value,
                            }))
                          }
                        >
                          {levelOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <button
                          disabled={
                            (updatingLevelId === b._id && isUpdatingLevel) ||
                            (levelById?.[b._id] ?? b.level) === b.level
                          }
                          onClick={() => {
                            setUpdatingLevelId(b._id);
                            updateLevel({
                              id: b._id,
                              level: levelById?.[b._id] ?? b.level,
                            });
                          }}
                          className="text-sm px-3 py-1 rounded bg-[var(--Yellow)] text-black disabled:opacity-50"
                        >
                          {updatingLevelId === b._id && isUpdatingLevel
                            ? "Saving..."
                            : "Update"}
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <select
                          className="bg-[var(--Input)] px-2 py-1 rounded"
                          value={leadById[b._id] ?? b?.leadStatus ?? "New"}
                          onChange={(e) =>
                            setLeadById((prev) => ({
                              ...prev,
                              [b._id]: e.target.value,
                            }))
                          }
                        >
                          {leadOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt.replaceAll("_", " ")}
                            </option>
                          ))}
                        </select>
                        <button
                          disabled={
                            (updatingLeadId === b._id && isUpdatingLead) ||
                            (leadById[b._id] ?? b.leadStatus) === b.leadStatus
                          }
                          onClick={() => {
                            setUpdatingLeadId(b._id);
                            updateLeadStatus({
                              id: b._id,
                              leadStatus: leadById[b._id] ?? b.leadStatus,
                            });
                          }}
                          className="text-sm px-3 py-1 rounded bg-[var(--Yellow)] text-black disabled:opacity-50"
                        >
                          {updatingLeadId === b._id && isUpdatingLead
                            ? "Saving..."
                            : "Update"}
                        </button>
                      </div>
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
    </main>
  );
}

export default StudentsBooking;
