import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const InstructorPendingRequests = () => {
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [pendingRequests, setPendingRequests] = useState([]);
    const [confirmedRequests, setConfirmedRequests] = useState([]);
    const [pendingGroups, setPendingGroups] = useState([]);
    const [confirmedGroups, setConfirmedGroups] = useState([]);

    // Admin specific state
    const [changeRequestedSessions, setChangeRequestedSessions] = useState([]);
    const [changeRequestedGroups, setChangeRequestedGroups] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [showReassignModal, setShowReassignModal] = useState(false);
    const [reassignItem, setReassignItem] = useState(null);
    const [selectedInstructorId, setSelectedInstructorId] = useState("");
    const [reassigning, setReassigning] = useState(false);

    const [loading, setLoading] = useState(true);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [reason, setReason] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        if (token) {
            if (isAdmin) {
                fetchAdminData();
                fetchInstructors();
            } else {
                fetchAllPending();
            }
        }
    }, [token, isAdmin]);

    const fetchInstructors = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/users?role=instructor`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInstructors(res.data.data || []);
        } catch (error) {
            console.error("Error fetching instructors:", error);
        }
    };

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/free-sessions/admin-pending-assignments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { sessions, groups } = res.data.data;

            setPendingRequests(sessions.filter(s => s.instructorAssignmentStatus === 'pending'));
            setChangeRequestedSessions(sessions.filter(s => s.instructorAssignmentStatus === 'change_requested'));

            setPendingGroups(groups.filter(g => g.instructorAssignmentStatus === 'pending'));
            setChangeRequestedGroups(groups.filter(g => g.instructorAssignmentStatus === 'change_requested'));

            setLoading(false);
        } catch (error) {
            console.error("Error fetching admin data:", error);
            toast.error("Failed to load assignments");
            setLoading(false);
        }
    };

    const fetchAllPending = async () => {
        try {
            setLoading(true);

            // Fetch individual sessions (both pending and approved)
            const sessionResponse = await axios.get(
                `${API_BASE_URL}/free-sessions/my-sessions`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Fetch pending groups
            const groupResponse = await axios.get(
                `${API_BASE_URL}/free-session-groups/pending-requests`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const sessionsData = Array.isArray(sessionResponse.data) ? sessionResponse.data : [];
            const groupsData = Array.isArray(groupResponse.data?.data) ? groupResponse.data.data : [];

            setPendingRequests(sessionsData.filter(r => r.instructorAssignmentStatus === 'pending'));
            setConfirmedRequests(sessionsData.filter(r => r.instructorAssignmentStatus === 'approved'));

            setPendingGroups(groupsData.filter(g => g.instructorAssignmentStatus === 'pending'));
            setConfirmedGroups(groupsData.filter(g => g.instructorAssignmentStatus === 'approved'));

            setLoading(false);
        } catch (error) {
            console.error("Error fetching pending requests:", error);
            toast.error("Failed to load requests");
            setLoading(false);
        }
    };

    const handleAccept = async (id, type) => {
        try {
            const endpoint = type === 'group'
                ? `${API_BASE_URL}/free-session-groups/${id}/approve`
                : `${API_BASE_URL}/free-sessions/${id}/approve`;

            await axios.post(endpoint, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Assignment approved");
            isAdmin ? fetchAdminData() : fetchAllPending();
        } catch (_error) {
            toast.error("Failed to approve assignment");
        }
    };

    const handleReject = async (id, type) => {
        try {
            const endpoint = type === 'group'
                ? `${API_BASE_URL}/free-session-groups/${id}/reject`
                : `${API_BASE_URL}/free-sessions/${id}/reject`;

            await axios.post(endpoint, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Assignment rejected");
            isAdmin ? fetchAdminData() : fetchAllPending();
        } catch (_error) {
            toast.error("Failed to reject assignment");
        }
    };

    const handleReassign = async () => {
        if (!selectedInstructorId) return toast.error("Please select an instructor");
        try {
            setReassigning(true);
            const { type, id } = reassignItem;

            if (type === 'group') {
                await axios.patch(`${API_BASE_URL}/free-session-groups/update-teacher`, {
                    groupId: id,
                    teacherId: selectedInstructorId
                }, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await axios.patch(`${API_BASE_URL}/free-sessions/${id}/assign-instructor`, {
                    instructorId: selectedInstructorId
                }, { headers: { Authorization: `Bearer ${token}` } });
            }

            toast.success("Instructor reassigned successfully");
            setShowReassignModal(false);
            setSelectedInstructorId("");
            fetchAdminData();
        } catch (_error) {
            toast.error("Failed to reassign instructor");
        } finally {
            setReassigning(false);
        }
    };

    const handleRequestChange = async () => {
        if (!reason) return toast.error("Please provide a reason");
        try {
            const { type, id } = selectedItem;
            const endpoint = type === 'group'
                ? `${API_BASE_URL}/free-session-groups/${id}/request-change`
                : `${API_BASE_URL}/free-sessions/${id}/request-change`;

            await axios.post(endpoint, { reason }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Change request sent to admin");
            setShowReasonModal(false);
            setReason("");
            fetchAllPending();
        } catch (_error) {
            toast.error("Failed to send change request");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-12">
            <div>
                <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">
                    {isAdmin ? "Assignments Management" : "My Assignments"}
                </h1>
                <p className="text-gray-500 font-medium">
                    {isAdmin ? "Review and manage instructor assignments and replacement requests." : "Review and manage your free session assignments."}
                </p>
            </div>

            {/* Admin Alert Section if there are change requests */}
            {isAdmin && (changeRequestedSessions.length > 0 || changeRequestedGroups.length > 0) && (
                <div className="bg-red-50 border-2 border-red-200 p-6 rounded-3xl shadow-sm">
                    <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                        <span className="p-2 bg-red-100 text-red-600 rounded-xl animate-pulse">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </span>
                        Urgent: Replacement Requests ({changeRequestedSessions.length + changeRequestedGroups.length})
                    </h2>
                    <div className="grid gap-4">
                        {[...changeRequestedSessions, ...changeRequestedGroups].map((item) => {
                            const isGroup = !!item.maxParticipants;
                            return (
                                <div key={item._id} className="bg-white p-4 rounded-2xl border border-red-100 flex justify-between items-center shadow-sm">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${isGroup ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                                {isGroup ? 'Group' : 'Individual'}
                                            </span>
                                            <span className="font-bold text-gray-900">{item.name}</span>
                                        </div>
                                        <p className="text-xs text-red-600 italic">By: {item.instructor?.name || "Unknown"} — &quot;{item.changeReason || "No reason given"}&quot;</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setReassignItem({ type: isGroup ? 'group' : 'individual', id: item._id });
                                            setShowReassignModal(true);
                                        }}
                                        className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-700 transition-all shadow-md shadow-red-600/20"
                                    >
                                        Reassign
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Pending Approvals Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                    <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                    Pending Approvals
                </h2>
                {pendingRequests.length === 0 && pendingGroups.length === 0 ? (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-12 rounded-3xl text-center">
                        <p className="text-gray-400 font-bold italic">No pending assignments at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingGroups.map(group => (
                            <div key={group._id} className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 group hover:border-blue-500 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">Group Session</span>
                                    {isAdmin && <span className="text-xs text-gray-400 font-bold">Waiting for: {group.pendingInstructor?.name || 'Round Robin'}</span>}
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">{group.name}</h3>
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        {group.freeSessionSlotId?.startTime ? new Date(group.freeSessionSlotId.startTime).toLocaleString() : 'N/A'}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        {group.currentParticipants} Students
                                    </div>
                                </div>
                                {!isAdmin && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <button onClick={() => handleAccept(group._id, 'group')} className="bg-emerald-500 text-white py-2 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-emerald-600 shadow-md shadow-emerald-500/10">Approve</button>
                                        <button onClick={() => handleReject(group._id, 'group')} className="bg-red-500 text-white py-2 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-red-600 shadow-md shadow-red-500/10">Reject</button>
                                    </div>
                                )}
                                {isAdmin && (
                                    <button
                                        onClick={() => {
                                            setReassignItem({ type: 'group', id: group._id });
                                            setShowReassignModal(true);
                                        }}
                                        className="w-full bg-gray-100 text-gray-600 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-gray-200 transition-colors"
                                    >
                                        Reassign to someone else
                                    </button>
                                )}
                            </div>
                        ))}
                        {pendingRequests.map(req => (
                            <div key={req._id} className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 group hover:border-purple-500 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">Individual</span>
                                    {isAdmin && <span className="text-xs text-gray-400 font-bold">Waiting for: {req.pendingInstructor?.name || 'Assigning...'}</span>}
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">{req.name}</h3>
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        {req.slot?.start} - {req.slot?.end}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-purple-600">
                                        Level: {req.level}
                                    </div>
                                </div>
                                {!isAdmin && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <button onClick={() => handleAccept(req._id, 'individual')} className="bg-emerald-500 text-white py-2 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-emerald-600 shadow-md shadow-emerald-500/10">Approve</button>
                                        <button onClick={() => handleReject(req._id, 'individual')} className="bg-red-500 text-white py-2 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-red-600 shadow-md shadow-red-500/10">Reject</button>
                                    </div>
                                )}
                                {isAdmin && (
                                    <button
                                        onClick={() => {
                                            setReassignItem({ type: 'individual', id: req._id });
                                            setShowReassignModal(true);
                                        }}
                                        className="w-full bg-gray-100 text-gray-600 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-gray-200 transition-colors"
                                    >
                                        Reassign to someone else
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Confirmed Assignments for Instructor View */}
            {!isAdmin && (
                <section className="space-y-6">
                    <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                        <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                        My Confirmed Assignments
                    </h2>
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                    <th className="p-6">Type</th>
                                    <th className="p-6">Details</th>
                                    <th className="p-6">Status</th>
                                    <th className="p-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {[...confirmedRequests, ...confirmedGroups].length > 0 ? (
                                    <>
                                        {confirmedGroups.map(group => (
                                            <tr key={group._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-6">
                                                    <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded uppercase">Group</span>
                                                </td>
                                                <td className="p-6">
                                                    <div className="font-bold text-gray-900">{group.name}</div>
                                                    <div className="text-xs text-gray-400 flex items-center gap-1 mt-1 font-medium">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                        {new Date(group.freeSessionSlotId?.startTime).toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${group.instructorAssignmentStatus === 'change_requested' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                        {group.instructorAssignmentStatus === 'change_requested' ? 'Change Requested' : 'Confirmed'}
                                                    </span>
                                                </td>
                                                <td className="p-6">
                                                    {group.instructorAssignmentStatus !== 'change_requested' && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedItem({ type: 'group', id: group._id });
                                                                setShowReasonModal(true);
                                                            }}
                                                            className="text-[9px] font-black text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-all border border-red-100 uppercase tracking-wider"
                                                        >
                                                            Request Change
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {confirmedRequests.map(req => (
                                            <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-6">
                                                    <span className="bg-purple-100 text-purple-700 text-[9px] font-black px-2 py-0.5 rounded uppercase">Individual</span>
                                                </td>
                                                <td className="p-6">
                                                    <div className="font-bold text-gray-900">{req.name}</div>
                                                    <div className="text-xs text-gray-400 border-l-2 border-purple-200 pl-2 mt-1 font-medium">
                                                        {req.slot?.start} - {req.slot?.end}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${req.instructorAssignmentStatus === 'change_requested' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                        {req.instructorAssignmentStatus === 'change_requested' ? 'Change Requested' : 'Confirmed'}
                                                    </span>
                                                </td>
                                                <td className="p-6">
                                                    {req.instructorAssignmentStatus !== 'change_requested' && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedItem({ type: 'individual', id: req._id });
                                                                setShowReasonModal(true);
                                                            }}
                                                            className="text-[9px] font-black text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-all border border-red-100 uppercase tracking-wider"
                                                        >
                                                            Request Change
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-16 text-center text-gray-400 font-bold italic">No confirmed assignments yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* Reassign Modal for Admin */}
            {showReassignModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl scale-in shadow-gray-900/20 border border-gray-100">
                        <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">Select New Instructor</h3>
                        <div className="space-y-4">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Available Instructors</label>
                            <select
                                value={selectedInstructorId}
                                onChange={(e) => setSelectedInstructorId(e.target.value)}
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:border-blue-500 focus:ring-0 outline-none transition-all font-bold text-gray-700"
                            >
                                <option value="">Select an instructor...</option>
                                {instructors.map(inst => (
                                    <option key={inst._id} value={inst._id}>{inst.name} ({inst.email})</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-4 mt-10">
                            <button
                                onClick={() => setShowReassignModal(false)}
                                className="flex-1 py-4 border-2 border-gray-100 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReassign}
                                disabled={reassigning}
                                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all disabled:opacity-50"
                            >
                                {reassigning ? "Assigning..." : "Assign Instructor"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Request Change Modal for Instructor */}
            {showReasonModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Request Change</h3>
                        </div>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Please provide a reason for the replacement..."
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 h-40 focus:border-red-500 focus:ring-0 outline-none transition-all font-bold text-gray-700"
                        />
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setShowReasonModal(false)} className="flex-1 py-4 border-2 border-gray-100 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50">Cancel</button>
                            <button onClick={handleRequestChange} className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 hover:shadow-lg shadow-red-600/20">Submit Request</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstructorPendingRequests;
