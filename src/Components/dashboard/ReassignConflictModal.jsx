import React, { useState } from "react";
import { useBulkReassign, useGetSuggestedAgents } from "@/hooks/Actions/free-sessions/useFreeSessionBookingCruds";
import { toast } from "react-hot-toast";

/**
 * @description Modal to handle booking reassignments when conflicts are detected
 */
const ReassignConflictModal = ({
    isOpen,
    onClose,
    conflicts,
    userId,
    userRole,
    onSuccess
}) => {
    const [selectedAgent, setSelectedAgent] = useState("");
    const [reason, setReason] = useState("Shift Change");

    // For simplicity, we'll suggest agents for the first conflict's time
    // In a real scenario, you might want more complex logic
    const { data: suggestedAgentsData, isPending: loadingAgents } = useGetSuggestedAgents({
        role: userRole,
        startTime: new Date().toISOString(), // Default to now if no conflicts, or map through conflicts
        enabled: isOpen
    });

    const { mutate: reassign, isPending: isReassigning } = useBulkReassign();

    const handleReassign = () => {
        if (!selectedAgent) {
            toast.error("Please select an agent to reassign to");
            return;
        }

        reassign({
            fromUserId: userId,
            toUserId: selectedAgent,
            reason: reason,
            bookingIds: conflicts.map(c => typeof c === 'object' ? c.id : c)
        }, {
            onSuccess: () => {
                toast.success("Bookings reassigned successfully");
                onSuccess?.();
                onClose();
            },
            onError: (err) => {
                toast.error(err.message || "Reassignment failed");
            }
        });
    };

    const isInstructor = userRole === "instructor";
    const itemType = isInstructor ? "sessions" : "leads";
    const roleTitle = isInstructor ? "Instructor" : "Agent";

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-300">
                <div className="bg-red-50 p-6 border-b border-red-100 flex items-center gap-4">
                    <div className="bg-red-500 text-white p-3 rounded-2xl shadow-lg shadow-red-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-red-900 leading-tight">Availability Conflict</h2>
                        <p className="text-red-700/80 text-sm font-medium">Found {conflicts.length} affected {itemType}</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <p className="text-gray-600 font-medium leading-relaxed">
                        Changing this schedule will leave <strong>{conflicts.length} upcoming {itemType}</strong> without an active {roleTitle.toLowerCase()}. To proceed, please reassign them to another available team member.
                    </p>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Select New {roleTitle}</label>
                            <select
                                value={selectedAgent}
                                onChange={(e) => setSelectedAgent(e.target.value)}
                                className="w-full py-3.5 px-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-[var(--Yellow)] focus:bg-white outline-none transition-all font-semibold text-gray-800 appearance-none"
                            >
                                <option value="">Choose an available {roleTitle.toLowerCase()}...</option>
                                {suggestedAgentsData?.data?.data?.map(agent => (
                                    <option key={agent._id} value={agent._id}>
                                        {agent.name} ({agent.shiftStart} - {agent.shiftEnd})
                                    </option>
                                ))}
                            </select>
                            {loadingAgents && <p className="text-xs text-gray-400 animate-pulse ml-1">Finding available {roleTitle.toLowerCase()}s...</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Reassignment Reason</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="e.g., Change of working hours..."
                                className="w-full py-3.5 px-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-[var(--Yellow)] focus:bg-white outline-none transition-all font-semibold text-gray-800 min-h-[100px] resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-4 rounded-2xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-white hover:border-gray-300 transition-all active:scale-95"
                    >
                        Cancel Change
                    </button>
                    <button
                        type="button"
                        onClick={handleReassign}
                        disabled={isReassigning || !selectedAgent}
                        className="flex-[1.5] py-4 rounded-2xl bg-[var(--Yellow)] font-black text-[var(--Main)] shadow-lg shadow-[var(--Yellow)]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
                    >
                        {isReassigning ? "Reassigning..." : "Confirm & Reassign"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReassignConflictModal;
