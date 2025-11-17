import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useGetFreeSessionBookingById,
  useAddNoteToFreeSessionBooking,
  useUpdateLeadStatusForFreeSessionBooking,
  useUpdateLevelForFreeSessionBooking,
} from "@/hooks/Actions/free-sessions/useFreeSessionBookingCruds";

const renderSlot = (slotObjOrId) => {
  const slot = slotObjOrId;
  if (slot && typeof slot === "object") {
    const hasISO =
      typeof slot.startTime === "string" && typeof slot.endTime === "string";
    if (hasISO) {
      const start = new Date(slot.startTime);
      const end = new Date(slot.endTime);
      const dateStr = start.toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      const startTimeStr = start.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
      const endTimeStr = end.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
      return (
        <>
          <div className="text-sm">{dateStr}</div>
          <div className="text-xs text-[var(--SubText)]">
            {startTimeStr} - {endTimeStr}
          </div>
        </>
      );
    }
    const dateStr = slot.date
      ? new Date(slot.date).toLocaleDateString()
      : "N/A";
    const timeStr =
      slot.startTime && slot.endTime
        ? `${slot.startTime} - ${slot.endTime}`
        : "";
    return (
      <>
        <div className="text-sm">{dateStr}</div>
        <div className="text-xs text-[var(--SubText)]">{timeStr}</div>
      </>
    );
  }
  if (typeof slot === "string") {
    return <div className="text-sm">Slot #{slot.slice(-6)}</div>;
  }
  return <div className="text-sm">N/A</div>;
};

function BookingDetails() {
  const { id } = useParams();
  const { data, isPending } = useGetFreeSessionBookingById({ id });
  const booking = data?.data || data || {};

  const { mutate: addNote, isPending: isAddingNote } =
    useAddNoteToFreeSessionBooking();
  const { mutate: updateLeadStatus, isPending: isUpdatingLead } =
    useUpdateLeadStatusForFreeSessionBooking();
  const { mutate: updateLevel, isPending: isUpdatingLevel } =
    useUpdateLevelForFreeSessionBooking();

  const [noteText, setNoteText] = useState("");
  const [lead, setLead] = useState(booking?.leadStatus || "New");
  const [level, setLevel] = useState(booking?.level || "Pending");

  useEffect(() => {
    if (booking) {
      setLead(booking?.leadStatus || "New");
      setLevel(booking?.level || "Pending");
    }
  }, [booking?._id, booking?.leadStatus, booking?.level]);

  const leadOptions = [
    "New",
    "Contacted",
    "Test_Completed",
    "Session_Attended",
    "Proposal_Sent",
    "Converted",
    "Not_Interested",
  ];
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

  return (
    <main className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl text-[var(--Main)]">
          Booking Details
        </h1>
        <Link
          to="/dash/booking"
          className="text-sm px-3 py-2 rounded bg-[var(--Input)]"
        >
          Back
        </Link>
      </div>

      {isPending ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--Yellow)] mx-auto"></div>
          <p className="mt-4 text-[var(--SubText)]">Loading booking...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-[var(--SubText)]">Customer</div>
              <div className="text-lg font-semibold text-[var(--Main)]">
                {booking?.name}
              </div>
              {/* <div className="text-xs">#{booking?._id?.slice(-6)}</div> */}
            </div>
            <div>
              <div className="text-sm text-[var(--SubText)]">Contact</div>
              <div className="text-sm">{booking?.email}</div>
              <div className="text-sm">{booking?.phoneNumber}</div>
            </div>
            <div>
              <div className="text-sm text-[var(--SubText)]">Slot</div>
              <div>
                {renderSlot(
                  booking?.freeSessionSlotId || booking?.freeSessionSlot
                )}
              </div>
            </div>
            <div>
              <div className="text-sm text-[var(--SubText)]">
                Group / Teacher
              </div>
              <div className="text-sm">
                {(() => {
                  const group =
                    booking?.freeSessionGroupId || booking?.freeSessionGroup;
                  if (group && typeof group === "object") {
                    const name =
                      group.name || `Group #${(group._id || "").slice(-4)}`;
                    const teacher = group.teacher || "Unassigned";
                    return (
                      <>
                        <div className="font-medium ">{name}</div>
                        <div className="text-xs text-[var(--SubText)]">
                          Teacher: {teacher}
                        </div>
                      </>
                    );
                  }
                  if (typeof group === "string") {
                    return <div>Group #{group.slice(-6)}</div>;
                  }
                  return <div>N/A</div>;
                })()}
              </div>
            </div>

            <div>
              <div className="text-sm text-[var(--SubText)]">Age / Level</div>
              <div className="text-sm">
                {booking?.age || "N/A"} • {booking?.level || "Pending"}
              </div>
            </div>
            <div>
              <div className="text-sm text-[var(--SubText)]">Status</div>
              <div className="text-sm">{booking?.status}</div>
            </div>
            <div>
              <div className="text-sm text-[var(--SubText)]">Lead Status</div>
              <div className="flex gap-2 items-center">
                <select
                  className="bg-[var(--Input)] px-2 py-1 rounded"
                  value={lead}
                  onChange={(e) => setLead(e.target.value)}
                >
                  {leadOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
                <button
                  disabled={isUpdatingLead || lead === booking?.leadStatus}
                  onClick={() => updateLeadStatus({ id, leadStatus: lead })}
                  className="text-sm px-3 py-1 rounded bg-[var(--Yellow)] text-black disabled:opacity-50"
                >
                  {isUpdatingLead ? "Saving..." : "Update"}
                </button>
              </div>
            </div>
            <div>
              <div className="text-sm text-[var(--SubText)]">Level</div>
              <div className="flex gap-2 items-center">
                <select
                  className="bg-[var(--Input)] px-2 py-1 rounded"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  {levelOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <button
                  disabled={isUpdatingLevel || level === booking?.level}
                  onClick={() => updateLevel({ id, level })}
                  className="text-sm px-3 py-1 rounded bg-[var(--Yellow)] text-black disabled:opacity-50"
                >
                  {isUpdatingLevel ? "Saving..." : "Update"}
                </button>
              </div>
            </div>
            <div>
              <div className="text-sm text-[var(--SubText)]">Country</div>
              <div className="text-sm">{booking?.country || "N/A"}</div>
            </div>
            <div>
              <div className="text-sm text-[var(--SubText)]">Created At</div>
              <div className="text-sm">
                {booking?.createdAt
                  ? new Date(booking.createdAt).toLocaleString("en-UK")
                  : "N/A"}
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[var(--Main)]">Notes</h2>
            </div>
            <div className="flex gap-2">
              <input
                className="bg-[var(--Input)] px-3 py-2 rounded w-full"
                placeholder="Add a note"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <button
                disabled={isAddingNote || !noteText.trim()}
                onClick={() => {
                  const text = noteText.trim();
                  if (!text) return;
                  addNote({ id, note: text });
                  setNoteText("");
                }}
                className="px-4 py-2 rounded bg-[var(--Yellow)] text-black disabled:opacity-50"
              >
                {isAddingNote ? "Adding..." : "Add Note"}
              </button>
            </div>
            <div className="divide-y divide-[var(--Light)]">
              {(booking?.notes || []).length === 0 && (
                <div className="text-[var(--SubText)] text-sm">
                  No notes yet.
                </div>
              )}
              {(booking?.notes || []).map((n) => (
                <div
                  key={n._id || n.createdAt}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <div className="text-sm">{n.text}</div>
                    <div className="text-xs text-[var(--SubText)]">
                      {n.createdBy || "System"} •{" "}
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleString("en-UK")
                        : ""}
                    </div>
                  </div>
                  {/* <button
                    disabled
                    title="Delete note requires backend endpoint"
                    className="text-sm px-3 py-1 rounded bg-gray-200 text-gray-500 cursor-not-allowed"
                  >
                    Delete
                  </button> */}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default BookingDetails;
