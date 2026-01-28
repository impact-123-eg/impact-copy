import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const SessionDetails = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        date: "",
        startTime: "",
        endTime: "",
        topic: "",
        zoomLink: "",
        status: "scheduled",
        notes: "",
    });

    useEffect(() => {
        fetchSession();
    }, [sessionId]);

    const fetchSession = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${API_BASE_URL}/sessions/${sessionId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const sessionData = response.data;
            setSession(sessionData);

            // Populate form
            setFormData({
                date: sessionData.date ? new Date(sessionData.date).toISOString().split('T')[0] : "",
                startTime: sessionData.startTime || "",
                endTime: sessionData.endTime || "",
                topic: sessionData.topic || "",
                zoomLink: sessionData.zoomLink || "",
                status: sessionData.status || "scheduled",
                notes: sessionData.notes || "",
            });

            setLoading(false);
        } catch (error) {
            console.error("Error fetching session:", error);
            toast.error("Failed to load session");
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            await axios.patch(
                `${API_BASE_URL}/sessions/${sessionId}`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("Session updated successfully");
            setEditing(false);
            fetchSession();
        } catch (error) {
            console.error("Error updating session:", error);
            toast.error(error.response?.data?.message || "Failed to update session");
        } finally {
            setSaving(false);
        }
    };

    const copyZoomLink = () => {
        if (formData.zoomLink) {
            navigator.clipboard.writeText(formData.zoomLink);
            toast.success("Zoom link copied to clipboard");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading session...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Session Not Found</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-2 text-gray-500 hover:text-gray-700 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Session Details</h1>
                    <p className="text-gray-600 mt-1">
                        {session.group?.name || "No Group"}
                    </p>
                </div>

                <div className="flex gap-3">
                    {!editing ? (
                        <>
                            <button
                                onClick={() => setEditing(true)}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Session
                            </button>
                            <button
                                onClick={() => navigate(`/dash/sessions/${sessionId}/attendance`)}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                Mark Attendance
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    setEditing(false);
                                    fetchSession();
                                }}
                                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 font-medium transition-colors"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${session.status === 'completed' ? 'bg-green-100 text-green-800' :
                            session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                        }`}>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </span>

                    {editing && (
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    )}
                </div>

                {/* Date and Time */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Date
                        </label>
                        {editing ? (
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <p className="text-gray-900 text-lg">
                                {new Date(session.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Start Time
                        </label>
                        {editing ? (
                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <p className="text-gray-900 text-lg">{session.startTime || "Not set"}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            End Time
                        </label>
                        {editing ? (
                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <p className="text-gray-900 text-lg">{session.endTime || "Not set"}</p>
                        )}
                    </div>
                </div>

                {/* Topic */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Topic
                    </label>
                    {editing ? (
                        <input
                            type="text"
                            name="topic"
                            value={formData.topic}
                            onChange={handleInputChange}
                            placeholder="Enter session topic"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ) : (
                        <p className="text-gray-900 text-lg">{session.topic || "No topic set"}</p>
                    )}
                </div>

                {/* Zoom Link */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Zoom Link
                    </label>
                    {editing ? (
                        <div className="flex gap-2">
                            <input
                                type="url"
                                name="zoomLink"
                                value={formData.zoomLink}
                                onChange={handleInputChange}
                                placeholder="https://zoom.us/j/..."
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            {session.zoomLink ? (
                                <>
                                    <a
                                        href={session.zoomLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline flex-1 truncate"
                                    >
                                        {session.zoomLink}
                                    </a>
                                    <button
                                        onClick={copyZoomLink}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Copy
                                    </button>
                                </>
                            ) : (
                                <p className="text-gray-500 italic">No zoom link set</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Notes
                    </label>
                    {editing ? (
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Add any notes about this session..."
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ) : (
                        <p className="text-gray-900 whitespace-pre-wrap">
                            {session.notes || "No notes"}
                        </p>
                    )}
                </div>

                {/* Attendance Summary */}
                {session.attendance && session.attendance.length > 0 && (
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Summary</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600">Present</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {session.attendance.filter(a => a.status === 'present').length}
                                </p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600">Absent</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {session.attendance.filter(a => a.status === 'absent').length}
                                </p>
                            </div>
                            <div className="bg-yellow-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600">Late</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {session.attendance.filter(a => a.status === 'late').length}
                                </p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600">Excused</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {session.attendance.filter(a => a.status === 'excused').length}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionDetails;
