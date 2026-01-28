import React, { useState } from "react";
import { useAdminGetUsers, useAddUserNote, useToggleSubscription } from "@/hooks/Actions/users/useCurdsUsers";
import { FaSearch, FaCheckCircle, FaTimesCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const UsersManagement = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({ search: "", isSubscribed: "", isFrozen: "" });
    const { data: usersData, isLoading, refetch } = useAdminGetUsers({ ...filters, page, limit: 10 });
    const { mutate: addNote } = useAddUserNote();
    const { mutate: toggleSubscription } = useToggleSubscription();

    const [expandedUser, setExpandedUser] = useState(null);

    const users = usersData?.data?.data?.data || [];
    const pagination = usersData?.data?.data?.pagination || {};

    const handleToggleSub = (userId, currentStatus) => {
        Swal.fire({
            title: "Update Subscription",
            text: `Are you sure you want to ${currentStatus ? "unsubscribe" : "subscribe"} this user?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, update it!",
        }).then((result) => {
            if (result.isConfirmed) {
                toggleSubscription(
                    { data: { userId, status: !currentStatus } },
                    {
                        onSuccess: () => {
                            refetch();
                            Swal.fire("Updated!", "User subscription has been updated.", "success");
                        },
                    }
                );
            }
        });
    };

    return (
        <main className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Student Management</h1>
            </div>

            {/* Filters */}
            <section className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search name, email, phone..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-[var(--Yellow)] transition-all outline-none"
                        onChange={(e) => {
                            setFilters({ ...filters, search: e.target.value });
                            setPage(1); // Reset to page 1 on search
                        }}
                    />
                </div>
                <div>
                    <select
                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-[var(--Yellow)] transition-all outline-none"
                        onChange={(e) => {
                            setFilters({ ...filters, isSubscribed: e.target.value });
                            setPage(1);
                        }}
                    >
                        <option value="">All Subscriptions</option>
                        <option value="true">Subscribed</option>
                        <option value="false">Not Subscribed</option>
                    </select>
                </div>
                <div>
                    <select
                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-[var(--Yellow)] transition-all outline-none"
                        onChange={(e) => {
                            setFilters({ ...filters, isFrozen: e.target.value });
                            setPage(1);
                        }}
                    >
                        <option value="">All Freeze Status</option>
                        <option value="true">Frozen</option>
                        <option value="false">Active</option>
                    </select>
                </div>
            </section>

            {/* Users Table */}
            <section className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 border-4 border-[var(--Yellow)] border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-gray-500 font-medium">Fetching Student Directory...</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/50">
                                    <tr className="text-left text-gray-500 uppercase text-xs font-bold tracking-wider">
                                        <th className="px-8 py-5">Student Profile</th>
                                        <th className="px-6 py-5 text-center">Subscription</th>
                                        <th className="px-6 py-5">History Brief</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.length > 0 ? (
                                        users.map((u) => (
                                            <React.Fragment key={u._id}>
                                                <tr className={`hover:bg-amber-50/30 transition-colors group ${expandedUser === u._id ? 'bg-amber-50/50' : ''}`}>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500 font-bold text-xl group-hover:bg-white transition-all shadow-sm">
                                                                {u.name?.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <Link to={`/dash/users/${u._id}`} className="font-bold text-gray-800 text-lg leading-tight hover:text-[var(--Main)] transition-colors">{u.name}</Link>
                                                                <div className="text-sm text-gray-500">{u.email}</div>
                                                                <div className="text-[10px] text-gray-400 font-mono mt-1">{u.phoneNumber}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => handleToggleSub(u._id, u.isSubscribed)}
                                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter transition-all ${u.isSubscribed
                                                                    ? "bg-green-100 text-green-700 hover:bg-green-200 shadow-sm"
                                                                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                                                    }`}
                                                            >
                                                                {u.isSubscribed ? <FaCheckCircle /> : <FaTimesCircle />}
                                                                {u.isSubscribed ? "Subscribed" : "Inactive"}
                                                            </button>
                                                            {u.isFrozen && (
                                                                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter bg-cyan-100 text-cyan-700 shadow-sm">
                                                                    ❄️ Frozen
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <div className="space-y-1">
                                                            <div className="text-sm">
                                                                <span className="font-bold text-gray-700">{u.history?.length || 0}</span>
                                                                <span className="text-gray-500 text-xs ml-1">bookings</span>
                                                            </div>
                                                            {u.breached && (
                                                                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                                                                    Missed Sessions
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <Link
                                                            to={`/dash/users/${u._id}`}
                                                            className="inline-flex items-center justify-center px-4 py-2 bg-[var(--Yellow)] text-black font-bold rounded-xl hover:bg-[var(--Main)] hover:text-white transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider"
                                                        >
                                                            View Profile
                                                        </Link>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-12 text-gray-400">
                                                No students found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {pagination.pages > 1 && (
                            <div className="p-6 border-t border-gray-100 flex items-center justify-center gap-4">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-3 rounded-xl bg-gray-50 text-gray-600 hover:bg-[var(--Yellow)] hover:text-black disabled:opacity-50 disabled:hover:bg-gray-50 disabled:hover:text-gray-600 transition-all font-bold"
                                >
                                    <FaChevronLeft />
                                </button>
                                <span className="text-sm font-bold text-gray-500">
                                    Page {page} of {pagination.pages}
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                                    disabled={page === pagination.pages}
                                    className="p-3 rounded-xl bg-gray-50 text-gray-600 hover:bg-[var(--Yellow)] hover:text-black disabled:opacity-50 disabled:hover:bg-gray-50 disabled:hover:text-gray-600 transition-all font-bold"
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </main>
    );
};

export default UsersManagement;


