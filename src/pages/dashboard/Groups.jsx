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

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">My Classes / Groups</h1>

            {/* Admin Action: Create Group (Link to separate page or modal - simplified for now) */}
            {user?.role === 'admin' && (
                <div className="mb-4">
                    {/* Placeholder for Create Group functionality */}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
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

                {groups.length === 0 && (
                    <p className="text-gray-500 col-span-full text-center py-10">No groups found.</p>
                )}
            </div>
        </div>
    );
};

export default Groups;
