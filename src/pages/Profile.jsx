import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useUpdateMe, useGetStudentHistory } from "../hooks/Actions/users/useCurdsUsers";
import Swal from "sweetalert2";
import {
    FaUser,
    FaHistory,
    FaEdit,
    FaCheckCircle,
    FaExclamationCircle,
    FaBoxOpen,
    FaCreditCard,
    FaCog,
    FaCalendarCheck,
    FaClock,
    FaMoneyBillWave,
    FaLock
} from "react-icons/fa";

const Profile = () => {
    const { user, setUser } = useAuth();

    const { mutate: updateMe, isPending: isUpdating } = useUpdateMe();
    const { data: historyData, isLoading: isLoadingHistory } = useGetStudentHistory();

    const [activeTab, setActiveTab] = useState("overview");

    // Form State
    const [formData, setFormData] = useState({
        name: user?.name || "",
        phoneNumber: user?.phoneNumber || "",
        password: "",
        confirmPassword: "",
    });

    const studentHistory = historyData?.data?.data || { freeSessions: [], packageBookings: [] };
    const { freeSessions, packageBookings } = studentHistory;

    const handleUpdate = (e) => {
        e.preventDefault();

        if (formData.password && formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Passwords do not match",
            });
            return;
        }

        const dataToUpdate = {
            name: formData.name,
            phoneNumber: formData.phoneNumber,
        };

        if (formData.password) {
            dataToUpdate.password = formData.password;
        }

        updateMe(
            { data: dataToUpdate },
            {
                onSuccess: (res) => {
                    setUser(res.data.data);
                    setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
                    Swal.fire({
                        icon: "success",
                        title: "Updated",
                        text: "Profile updated successfully",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                },
                onError: (err) => {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: err.response?.data?.message || "Failed to update profile",
                    });
                }
            }
        );
    };

    const StatusBadge = ({ status }) => {
        let colors = "bg-gray-100 text-gray-600";
        if (status === "confirmed" || status === "paid" || status === "active" || status === "Confirmed") colors = "bg-green-100 text-green-700";
        if (status === "pending" || status === "unpaid" || status === "Pending") colors = "bg-yellow-100 text-yellow-700";
        if (status === "cancelled" || status === "failed" || status === "expired") colors = "bg-red-100 text-red-700";

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colors}`}>
                {status}
            </span>
        );
    };

    const tabs = [
        { id: "overview", label: "Overview", icon: FaUser },
        { id: "packages", label: "My Packages", icon: FaBoxOpen },
        { id: "sessions", label: "My Sessions", icon: FaCalendarCheck },
        { id: "payments", label: "My Payments", icon: FaCreditCard },
        { id: "settings", label: "Settings", icon: FaCog },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 min-h-[80vh]">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl shadow-lg p-6 border border-white/20 sticky top-24">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-24 h-24 bg-gradient-to-tr from-[#24293f] to-[#1a1f33] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl mb-4">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 text-center">{user?.name}</h2>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                            <div className="mt-3">
                                {user?.isSubscribed ? (
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <FaCheckCircle /> Active Student
                                    </span>
                                ) : (
                                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <FaExclamationCircle /> No Active Plan
                                    </span>
                                )}
                            </div>
                        </div>

                        <nav className="space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === tab.id
                                        ? "bg-blue-50 text-blue-600 shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    <tab.icon className={activeTab === tab.id ? "text-blue-600" : "text-gray-400"} />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    {activeTab === "overview" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                            <FaBoxOpen size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Active Packages</p>
                                            <h3 className="text-2xl font-bold text-gray-800">
                                                {packageBookings?.filter(p => p.status === 'confirmed').length || 0}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                            <FaCalendarCheck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Total Sessions</p>
                                            <h3 className="text-2xl font-bold text-gray-800">
                                                {freeSessions?.length || 0}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                            <FaMoneyBillWave size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Total Spent</p>
                                            <h3 className="text-2xl font-bold text-gray-800">
                                                {packageBookings?.reduce((sum, p) => p.paymentStatus === 'paid' ? sum + p.amount : sum, 0) || 0} EGP
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h3>
                                {isLoadingHistory ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {((freeSessions || []).slice(0, 3)).map((session) => (
                                            <div key={session._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                        <FaClock />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">Free Session - {session.level}</p>
                                                        <p className="text-xs text-gray-500">{new Date(session.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <StatusBadge status={session.status} />
                                            </div>
                                        ))}
                                        {freeSessions.length === 0 && <p className="text-gray-500 italic">No recent activity.</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "packages" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold text-gray-800">My Packages</h2>
                            {isLoadingHistory ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                </div>
                            ) : packageBookings?.length > 0 ? (
                                <div className="grid gap-6">
                                    {packageBookings.map((booking) => (
                                        <div key={booking._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-800">{booking.package?.name}</h3>
                                                    <StatusBadge status={booking.status} />
                                                </div>
                                                <p className="text-gray-500 text-sm mb-1">Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
                                                <p className="text-gray-500 text-sm">Package ID: <span className="font-mono bg-gray-100 px-1 rounded">{booking._id.slice(-6)}</span></p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-blue-600">{booking.amount} {booking.currency}</div>
                                                <div className="text-sm text-gray-500 capitalize">{booking.paymentType} Payment</div>
                                                {booking.paymentStatus === 'unpaid' && (
                                                    <button className="mt-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                                                        Pay Now
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <FaBoxOpen size={24} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700">No active packages</h3>
                                    <p className="text-gray-500 mb-6">You haven&apos;t subscribed to any packages yet.</p>
                                    <a href="/courses" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition">
                                        Browse Courses
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "sessions" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold text-gray-800">My Sessions History</h2>
                            {isLoadingHistory ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                </div>
                            ) : freeSessions?.length > 0 ? (
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="divide-y divide-gray-100">
                                        {freeSessions.map((session) => (
                                            <div key={session._id} className="p-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                                            <FaCalendarCheck size={20} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-800 text-lg mb-1">
                                                                {session.level} Level Assessment
                                                            </h4>
                                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                <span className="flex items-center gap-1">
                                                                    <FaClock size={14} />
                                                                    {session.freeSessionSlotId ? new Date(session.freeSessionSlotId.startTime).toLocaleString() : 'Date TBD'}
                                                                </span>
                                                            </div>
                                                            {session.notes && (
                                                                <p className="mt-2 text-sm bg-yellow-50 text-yellow-800 p-2 rounded-lg border border-yellow-100">
                                                                    Note: {session.notes}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <StatusBadge status={session.status} />
                                                        {session.instructor && (
                                                            <span className="text-sm text-gray-500">
                                                                Instructor Assigned
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <FaHistory size={24} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700">No session history</h3>
                                    <p className="text-gray-500 mb-6">Book a free test to get started!</p>
                                    <a href="/free-test" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition">
                                        Book Free Test
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "payments" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold text-gray-800">Payment History</h2>
                            {isLoadingHistory ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                </div>
                            ) : packageBookings?.length > 0 ? (
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Date</th>
                                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Description</th>
                                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Amount</th>
                                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Method</th>
                                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {packageBookings.map((payment) => (
                                                <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {new Date(payment.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-800 font-medium">
                                                        {payment.package?.name}
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-gray-800">
                                                        {payment.amount} {payment.currency}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                                                        {payment.paymentMethod.replace(/_/g, " ")}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <StatusBadge status={payment.paymentStatus} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <FaCreditCard size={24} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700">No payment history</h3>
                                    <p className="text-gray-500">Your transaction history will appear here.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                                <form onSubmit={handleUpdate} className="space-y-6 max-w-2xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Full Name</label>
                                            <div className="relative">
                                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Phone Number</label>
                                            <div className="relative">
                                                <FaEdit className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    value={formData.phoneNumber}
                                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Email Address (Read Check-only)</label>
                                        <input
                                            type="email"
                                            disabled
                                            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                                            value={user?.email || ""}
                                        />
                                        <p className="text-xs text-gray-400">Please contact support to change your email.</p>
                                    </div>

                                    <div className="border-t border-gray-100 my-6 pt-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <FaLock /> Change Password
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700">New Password</label>
                                                <input
                                                    type="password"
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="Leave empty to keep current"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="Confirm new password"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isUpdating ? "Saving Changes..." : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
