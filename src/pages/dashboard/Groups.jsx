import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const Groups = () => {
    const { user, token } = useAuth();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGroups = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/groups`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setGroups(response.data);
        } catch (error) {
            console.error("Error fetching groups:", error);
            toast.error("Failed to load groups");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleResponse = async (groupId, status) => {
        try {
            await axios.post(
                `${API_BASE_URL}/groups/respond`,
                { groupId, status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success(`Group ${status} successfully`);
            fetchGroups();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [packages, setPackages] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [newGroup, setNewGroup] = useState({
        name: "",
        packageId: "",
        instructorId: "",
        startDate: "",
        maxSessions: 0,
        telegramLink: "",
        schedule: [{ day: "Sunday", startTime: "10:00", endTime: "11:30" }]
    });

    useEffect(() => {
        if (isCreateModalOpen) {
            fetchPackages();
            fetchInstructors();
        }
    }, [isCreateModalOpen]);

    const fetchPackages = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/packages`, { headers: { Authorization: `Bearer ${token}` } });
            setPackages(res.data);
        } catch (error) { console.error("Error fetching packages", error); }
    };

    const fetchInstructors = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/users?role=instructor`, { headers: { Authorization: `Bearer ${token}` } });
            setInstructors(res.data.data);
        } catch (error) { console.error("Error fetching instructors", error); }
    };

    const handleCreateGroup = async () => {
        try {
            await axios.post(`${API_BASE_URL}/groups`, newGroup, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Group created successfully");
            setIsCreateModalOpen(false);
            fetchGroups();
        } catch (error) {
            toast.error("Failed to create group");
        }
    };

    const updateSchedule = (index, field, value) => {
        const newSchedule = [...newGroup.schedule];
        newSchedule[index][field] = value;
        setNewGroup({ ...newGroup, schedule: newSchedule });
    };

    const [filter, setFilter] = useState('active'); // 'all', 'active', 'completed'

    const filteredGroups = groups.filter(group => {
        if (filter === 'all') return true;
        return group.status === filter;
    });

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">My Classes / Groups</h1>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                {/* Filter Buttons */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                    {['active', 'completed', 'all'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === f
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                } capitalize`}
                        >
                            {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Completed'}
                        </button>
                    ))}
                </div>

                {(user?.role === 'admin' || user?.role === 'supervisor') && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 font-bold"
                    >
                        Create New Group
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map((group) => (
                    <div
                        key={group._id}
                        className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold">{group.name}</h3>
                                <p className="text-sm text-gray-500">
                                    {group.package?.category?.en?.title || "No Category"} - Level {group.package?.levelno || "N/A"}
                                </p>
                            </div>
                            <span
                                className={`px-2 py-1 text-xs rounded-full ${group.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                    }`}
                            >
                                {group.status}
                            </span>
                        </div>

                        <div className="mb-4 space-y-2">
                            <p className="text-sm">
                                <span className="font-medium">Schedule:</span>{" "}
                                {group.schedule
                                    .map((s) => `${s.day} ${s.startTime}-${s.endTime}`)
                                    .join(", ")}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Students:</span>{" "}
                                {group.students?.length || 0}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Instructor:</span>{" "}
                                {group.instructor?.name || "Unassigned"}
                            </p>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <Link
                                to={`/dash/groups/${group._id}`}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                View Details
                            </Link>

                            {user?.role === 'instructor' && group.instructorAcceptance === 'pending' && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleResponse(group._id, 'accepted')}
                                        className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleResponse(group._id, 'rejected')}
                                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {filteredGroups.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed text-lg">
                        No {filter} groups found.
                    </div>
                )}
            </div>

            {/* Create Group Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative">
                        <button
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h2 className="text-2xl font-bold mb-6">Create New Group</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Group Name</label>
                                <input
                                    type="text"
                                    className="w-full border rounded p-2"
                                    value={newGroup.name}
                                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Package</label>
                                    <select
                                        className="w-full border rounded p-2"
                                        value={newGroup.packageId}
                                        onChange={(e) => setNewGroup({ ...newGroup, packageId: e.target.value })}
                                    >
                                        <option value="">Select Package</option>
                                        {packages.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Instructor</label>
                                    <select
                                        className="w-full border rounded p-2"
                                        value={newGroup.instructorId}
                                        onChange={(e) => setNewGroup({ ...newGroup, instructorId: e.target.value })}
                                    >
                                        <option value="">Select Instructor</option>
                                        {instructors.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                <input
                                    type="date"
                                    className="w-full border rounded p-2"
                                    value={newGroup.startDate}
                                    onChange={(e) => setNewGroup({ ...newGroup, startDate: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Max Sessions (0 for unlimited)</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded p-2"
                                        value={newGroup.maxSessions}
                                        onChange={(e) => setNewGroup({ ...newGroup, maxSessions: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Telegram Link</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded p-2"
                                        value={newGroup.telegramLink}
                                        onChange={(e) => setNewGroup({ ...newGroup, telegramLink: e.target.value })}
                                        placeholder="https://t.me/..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                                {newGroup.schedule.map((slot, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <select
                                            className="border rounded p-2 flex-1"
                                            value={slot.day}
                                            onChange={(e) => updateSchedule(index, 'day', e.target.value)}
                                        >
                                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="time"
                                            className="border rounded p-2"
                                            value={slot.startTime}
                                            onChange={(e) => updateSchedule(index, 'startTime', e.target.value)}
                                        />
                                        <input
                                            type="time"
                                            className="border rounded p-2"
                                            value={slot.endTime}
                                            onChange={(e) => updateSchedule(index, 'endTime', e.target.value)}
                                        />
                                        <button
                                            onClick={() => {
                                                const newSch = [...newGroup.schedule];
                                                newSch.splice(index, 1);
                                                setNewGroup({ ...newGroup, schedule: newSch });
                                            }}
                                            className="text-red-500 px-2"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setNewGroup({
                                        ...newGroup,
                                        schedule: [...newGroup.schedule, { day: "Sunday", startTime: "10:00", endTime: "11:30" }]
                                    })}
                                    className="text-blue-600 text-sm font-medium"
                                >
                                    + Add Slot
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="flex-1 bg-gray-100 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateGroup}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg"
                            >
                                Create Group
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Groups;
