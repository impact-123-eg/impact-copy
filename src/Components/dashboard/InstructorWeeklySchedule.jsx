import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const InstructorWeeklySchedule = () => {
    const { token } = useAuth();
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchWeeklySchedule();
        }
    }, [token]);

    const fetchWeeklySchedule = async () => {
        try {
            setLoading(true);
            // 1. Fetch normal group sessions for this week
            const groupSessionsRes = await axios.get(`${API_BASE_URL}/sessions/my-sessions`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // 2. Fetch confirmed free sessions
            // We might need a specific endpoint for confirmed ones, or filter pending-requests
            // For now, let's assume /free-sessions?instructorId=XXX&status=Confirmed
            // But usually instructors only see what they approved.

            const freeSessionsRes = await axios.get(`${API_BASE_URL}/free-sessions/my-sessions`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Combine and sort
            const combined = [
                ...groupSessionsRes.data.map(s => ({ ...s, type: 'group' })),
                ...freeSessionsRes.data
                    .filter(s => s.instructorAssignmentStatus === 'approved')
                    .map(s => ({
                        ...s,
                        type: 'free',
                        date: s.availability?.date || s.date,
                        startTime: s.slot?.start || s.startTime,
                        endTime: s.slot?.end || s.endTime
                    }))
            ].sort((a, b) => new Date(a.date) - new Date(b.date));

            setSchedule(combined);
        } catch (error) {
            console.error("Error fetching schedule:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-4 text-center">Loading your schedule...</div>;

    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Weekly Schedule</h2>
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr className="text-gray-500 text-sm uppercase">
                            <th className="p-4">Day / Date</th>
                            <th className="p-4">Time</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {schedule.length > 0 ? (
                            schedule.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium">
                                        {new Date(item.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="p-4">
                                        {item.startTime} - {item.endTime}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.type === 'free' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {item.type === 'free' ? 'FREE SESSION' : 'GROUP CLASS'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {item.type === 'free' ? (
                                            <div>{item.name} ({item.level})</div>
                                        ) : (
                                            <div>{item.groupId?.name} - {item.topic || 'Lesson'}</div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-10 text-center text-gray-400 font-medium">
                                    No sessions scheduled for this week.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default InstructorWeeklySchedule;
