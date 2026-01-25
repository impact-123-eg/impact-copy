import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const GroupDetails = () => {
    const { id } = useParams();
    const { user, token } = useAuth();
    const [group, setGroup] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    // For session generation
    const [generating, setGenerating] = useState(false);

    // Quick Edit Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentSession, setCurrentSession] = useState(null);
    const [modalData, setModalData] = useState({
        topic: "",
        zoomLink: "",
        notes: "",
        attendance: []
    });

    useEffect(() => {
        fetchGroupDetails();
    }, [id]);

    const fetchGroupDetails = async () => {
        try {
            const groupRes = await axios.get(
                `${API_BASE_URL}/groups/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setGroup(groupRes.data);

            if (groupRes.data) {
                fetchSessions(groupRes.data._id);
            }
        } catch (error) {
            console.error("Error loading details:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSessions = async (groupId) => {
        try {
            const res = await axios.get(
                `${API_BASE_URL}/sessions?groupId=${groupId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Sort by date
            setSessions(res.data.sort((a, b) => new Date(a.date) - new Date(b.date)));
        } catch (error) {
            toast.error("Failed to load sessions");
        }
    };

    const handleUpdateSessionStatus = async (sessionId, status) => {
        try {
            await axios.patch(`${API_BASE_URL}/sessions/${sessionId}`, {
                status
            }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success(`Session ${status} successfully`);
            fetchSessions(group._id);
        } catch (error) {
            toast.error("Failed to update session status");
        }
    };

    const handleGenerateSessions = async () => {
        if (!group) return;
        setGenerating(true);
        try {
            await axios.post(`${API_BASE_URL}/sessions/generate-next`, {
                groupId: group._id
            }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Next session scheduled successfully");
            fetchSessions(group._id);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to schedule session");
        } finally {
            setGenerating(false);
        }
    };

    const [savingModal, setSavingModal] = useState(false);

    const openEditModal = (session) => {
        setCurrentSession(session);
        setModalData({
            topic: session.topic || "",
            zoomLink: session.zoomLink || "",
            notes: session.notes || "",
            attendance: session.attendance || []
        });
        setIsEditModalOpen(true);
    };

    const handleModalSave = async () => {
        try {
            setSavingModal(true);
            // 1. Update session details
            await axios.patch(`${API_BASE_URL}/sessions/${currentSession._id}`, {
                topic: modalData.topic,
                zoomLink: modalData.zoomLink,
                notes: modalData.notes
            }, { headers: { Authorization: `Bearer ${token}` } });

            // 2. Update attendance
            await axios.post(`${API_BASE_URL}/sessions/${currentSession._id}/attendance`, {
                attendance: modalData.attendance.map(a => ({
                    studentId: a.student?._id || a.student,
                    status: a.status,
                    note: a.note
                }))
            }, { headers: { Authorization: `Bearer ${token}` } });

            toast.success("Session updated successfully");
            setIsEditModalOpen(false);
            fetchSessions(group._id);
        } catch (error) {
            console.error("Error saving session:", error);
            toast.error("Failed to update session");
        } finally {
            setSavingModal(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!group) return <div>Group not found or access denied.</div>;

    return (
        <>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">{group.name}</h1>
                        <p className="text-gray-600">
                            Instructor: {group.instructor?.name} | Students: {group.students?.length} | {group.package?.category?.en?.title} (Level {group.package?.levelno})
                        </p>
                    </div>
                    {(user?.role === 'admin' || user?.role === 'instructor') && (
                        <button
                            onClick={handleGenerateSessions}
                            disabled={generating}
                            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
                        >
                            {generating ? "Scheduling..." : "Schedule Next Session"}
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sessions.map((session) => (
                                <tr key={session._id} className={session.status === 'cancelled' ? 'bg-gray-50 text-gray-400' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                                        {new Date(session.date).toLocaleDateString(undefined, { weekday: 'long' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(session.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {session.startTime} - {session.endTime}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {session.topic || "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${session.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                session.status === 'cancelled' ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-800'}`}>
                                            {session.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => openEditModal(session)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Edit
                                            </button>
                                            {session.status !== 'cancelled' && (
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm("Are you sure you want to cancel this session?")) {
                                                            handleUpdateSessionStatus(session._id, 'cancelled')
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            {session.status === 'cancelled' && (
                                                <button
                                                    onClick={() => handleUpdateSessionStatus(session._id, 'scheduled')}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    Restore
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {sessions.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        No sessions found. Generate them to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative">
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-bold mb-6">Manage Session</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                                    <input
                                        type="text"
                                        value={modalData.topic}
                                        onChange={(e) => setModalData({ ...modalData, topic: e.target.value })}
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 font-medium"
                                        placeholder="Lesson topic..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Zoom Link</label>
                                    <input
                                        type="text"
                                        value={modalData.zoomLink}
                                        onChange={(e) => setModalData({ ...modalData, zoomLink: e.target.value })}
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 font-medium"
                                        placeholder="Meeting URL..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    value={modalData.notes}
                                    onChange={(e) => setModalData({ ...modalData, notes: e.target.value })}
                                    className="w-full border rounded-lg p-2 h-20 focus:ring-2 focus:ring-blue-500 font-medium"
                                    placeholder="Any additional notes..."
                                />
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-bold mb-3">Attendance</h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                    {(group.students || []).map((student) => {
                                        const attRecord = modalData.attendance.find(a => (a.student?._id || a.student) === student._id);
                                        const currentStatus = attRecord?.status || 'pending';

                                        return (
                                            <div key={student._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900">{student.name}</span>
                                                    <span className="text-xs text-gray-400">{student.email}</span>
                                                </div>
                                                <div className="flex bg-white rounded-lg p-1 border shadow-sm">
                                                    {['present', 'absent', 'late', 'excused'].map(status => (
                                                        <button
                                                            key={status}
                                                            onClick={() => {
                                                                const newAtt = [...modalData.attendance];
                                                                const idx = newAtt.findIndex(a => (a.student?._id || a.student) === student._id);
                                                                if (idx > -1) {
                                                                    newAtt[idx] = { ...newAtt[idx], status };
                                                                } else {
                                                                    newAtt.push({ student: student._id, status });
                                                                }
                                                                setModalData({ ...modalData, attendance: newAtt });
                                                            }}
                                                            className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${currentStatus === status
                                                                ? status === 'present' ? 'bg-emerald-100 text-emerald-700'
                                                                    : status === 'absent' ? 'bg-red-100 text-red-700'
                                                                        : status === 'late' ? 'bg-amber-100 text-amber-700'
                                                                            : 'bg-blue-100 text-blue-700'
                                                                : 'text-gray-400 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="flex-1 bg-gray-100 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 uppercase tracking-wider text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleModalSave}
                                disabled={savingModal}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 uppercase tracking-wider text-xs shadow-lg shadow-blue-600/20"
                            >
                                {savingModal ? "Saving..." : "Save Session Data"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GroupDetails;
