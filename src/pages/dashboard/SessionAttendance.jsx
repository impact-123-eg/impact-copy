import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const SessionAttendance = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [session, setSession] = useState(null);
    const [group, setGroup] = useState(null);
    const [attendance, setAttendance] = useState([]); // Array of { studentId, status, note, name, email }
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [sessionId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            setNotFound(false);

            // Fetch session data
            const sessionRes = await axios.get(
                `${API_BASE_URL}/sessions/${sessionId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const sessionData = sessionRes.data;
            setSession(sessionData);

            // Fetch group data to get all students
            if (sessionData.group) {
                const groupRes = await axios.get(
                    `${API_BASE_URL}/groups/${sessionData.group._id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setGroup(groupRes.data);

                // Initialize attendance array
                const students = groupRes.data.students || [];
                const initialAttendance = students.map((student) => {
                    // Check if attendance already exists for this student
                    const existingRecord = sessionData.attendance?.find(
                        (a) => a.student?._id === student._id
                    );

                    return {
                        studentId: student._id,
                        name: student.name,
                        email: student.email,
                        status: existingRecord?.status || "absent",
                        note: existingRecord?.note || "",
                    };
                });

                setAttendance(initialAttendance);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching session data:", error);
            setLoading(false);

            if (error.response?.status === 404) {
                setNotFound(true);
            } else {
                setError(error.response?.data?.message || "Failed to load session data");
            }
        }
    };


    const handleStatusChange = (index, newStatus) => {
        const newAtt = [...attendance];
        newAtt[index].status = newStatus;
        setAttendance(newAtt);
    };

    const handleNoteChange = (index, newNote) => {
        const newAtt = [...attendance];
        newAtt[index].note = newNote;
        setAttendance(newAtt);
    };

    const handleSubmit = async () => {
        try {
            await axios.post(
                `${API_BASE_URL}/sessions/${sessionId}/attendance`,
                {
                    attendance: attendance.map((a) => ({
                        studentId: a.studentId,
                        status: a.status,
                        note: a.note,
                    })),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            toast.success("Attendance saved");
            navigate(-1);
        } catch (error) {
            toast.error("Failed to save attendance");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading session data...</p>
                </div>
            </div>
        );
    }

    if (notFound || error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-4">
                        <svg
                            className="mx-auto h-16 w-16 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {notFound ? "Session Not Found" : "Error Loading Session"}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {error ||
                            "The session you're looking for doesn't exist or has been removed."}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 font-medium transition-colors"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate("/dash/sessions")}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium transition-colors"
                        >
                            View All Sessions
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-gray-500 hover:text-gray-700"
            >
                ← Back
            </button>
            <h1 className="text-2xl font-bold mb-2">Mark Attendance</h1>
            <p className="text-gray-600 mb-6">
                {session && new Date(session.date).toLocaleDateString()} | {group?.name}
            </p>

            <div className="bg-white rounded shadow p-4">
                <div className="grid gap-4">
                    {attendance.map((record, idx) => (
                        <div
                            key={record.studentId}
                            className="flex flex-col md:flex-row items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50"
                        >
                            <div className="mb-2 md:mb-0">
                                <p className="font-semibold">{record.name}</p>
                                <p className="text-sm text-gray-500">{record.email}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex border rounded overflow-hidden">
                                    {["present", "absent", "late", "excused"].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusChange(idx, status)}
                                            className={`px-3 py-1 text-sm capitalize ${record.status === status
                                                    ? status === "present"
                                                        ? "bg-green-500 text-white"
                                                        : status === "absent"
                                                            ? "bg-red-500 text-white"
                                                            : "bg-blue-500 text-white"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Note..."
                                    value={record.note}
                                    onChange={(e) => handleNoteChange(idx, e.target.value)}
                                    className="border rounded px-2 py-1 text-sm w-32 md:w-48"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium"
                    >
                        Save Attendance
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionAttendance;
