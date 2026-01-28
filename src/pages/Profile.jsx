import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useUpdateMe, useGetStudentHistory } from "../hooks/Actions/users/useCurdsUsers";
import { useI18n } from "../hooks/useI18n";
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
    FaLock,
    FaChalkboardTeacher,
    FaShareAlt
} from "react-icons/fa";
import { useGetAffiliateStats, useGetReferralHistory } from "../hooks/Actions/affiliate/useAffiliate";

const Profile = () => {
    const { user, setUser } = useAuth();
    const { t, initialize } = useI18n();

    useEffect(() => {
        initialize();
    }, [initialize]);

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

    const studentHistory = historyData?.data?.data || { freeSessions: [], packageBookings: [], groups: [], attendanceHistory: [], stats: { total: 0, attended: 0, excused: 0, absent: 0, late: 0 } };
    const { freeSessions, packageBookings, groups, attendanceHistory, stats } = studentHistory;

    const handleUpdate = (e) => {
        e.preventDefault();

        if (formData.password && formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: "error",
                title: t("profile", "error", "Error"),
                text: t("profile", "passwordsDoNotMatch", "Passwords do not match"),
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
                        title: t("profile", "updated", "Updated"),
                        text: t("profile", "profileUpdatedSuccess", "Profile updated successfully"),
                        timer: 2000,
                        showConfirmButton: false,
                    });
                },
                onError: (err) => {
                    Swal.fire({
                        icon: "error",
                        title: t("profile", "error", "Error"),
                        text: err.response?.data?.message || t("profile", "updateFailed", "Failed to update profile"),
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
        { id: "overview", label: t("profile", "tabOverview", "Overview"), icon: FaUser },
        { id: "current_group", label: t("profile", "tabCurrentGroup", "Current Group"), icon: FaChalkboardTeacher },
        { id: "packages", label: t("profile", "tabPackages", "My Packages"), icon: FaBoxOpen },
        { id: "classes", label: t("profile", "tabGroupHistory", "Group History"), icon: FaHistory },
        { id: "sessions", label: t("profile", "tabSessions", "My Sessions"), icon: FaCalendarCheck },
        { id: "payments", label: t("profile", "tabPayments", "My Payments"), icon: FaCreditCard },
        { id: "affiliate", label: t("profile", "tabAffiliate", "Affiliate"), icon: FaShareAlt },
        { id: "settings", label: t("profile", "tabSettings", "Settings"), icon: FaCog },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 min-h-[80vh]">
            {/* Freeze Status Banner */}
            {user?.isFrozen && (
                <div className="bg-cyan-50 border-2 border-cyan-200 rounded-3xl p-6 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaSnowflake className="text-cyan-600 text-xl" />
                    </div>
                    <div>
                        <h3 className="font-bold text-cyan-800">{t("profile", "accountFrozen", "Account Frozen")}</h3>
                        <p className="text-cyan-700">{t("profile", "accountFrozenDesc", "Please contact support to unfreeze your account.")}</p>
                    </div>
                </div>
            )}

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
                                        <FaCheckCircle /> {t("profile", "activeStudent", "Active Student")}
                                    </span>
                                ) : (
                                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <FaExclamationCircle /> {t("profile", "noActivePlan", "No Active Plan")}
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
                                            <p className="text-sm text-gray-500">{t("profile", "activePackages", "Active Packages")}</p>
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
                                            <p className="text-sm text-gray-500">{t("profile", "totalSessions", "Total Sessions")}</p>
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
                                            <p className="text-sm text-gray-500">{t("profile", "totalSpent", "Total Spent")}</p>
                                            <h3 className="text-2xl font-bold text-gray-800">
                                                {packageBookings?.reduce((sum, p) => p.paymentStatus === 'paid' ? sum + p.amount : sum, 0) || 0} EGP
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-6">{t("profile", "recentActivity", "Recent Activity")}</h3>
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
                                                        <p className="font-semibold text-gray-800">{t("profile", "freeSession", "Free Session")} - {session.level}</p>
                                                        <p className="text-xs text-gray-500">{new Date(session.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <StatusBadge status={session.status} />
                                            </div>
                                        ))}
                                        {freeSessions.length === 0 && <p className="text-gray-500 italic">{t("profile", "noRecentActivity", "No recent activity.")}</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}


                    {activeTab === "current_group" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold text-gray-800">{t("profile", "tabCurrentGroup", "Current Group & Attendance")}</h2>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <p className="text-gray-500 text-xs uppercase font-bold">{t("profile", "totalSessions", "Total Sessions")}</p>
                                    <h3 className="text-2xl font-bold text-blue-600">{stats?.total || 0}</h3>
                                </div>
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <p className="text-gray-500 text-xs uppercase font-bold">{t("profile", "attended", "Attended")}</p>
                                    <h3 className="text-2xl font-bold text-green-600">{stats?.attended || 0}</h3>
                                </div>
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <p className="text-gray-500 text-xs uppercase font-bold">{t("profile", "excused", "Excused")}</p>
                                    <h3 className="text-2xl font-bold text-amber-600">{stats?.excused || 0}</h3>
                                </div>
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <p className="text-gray-500 text-xs uppercase font-bold">{t("profile", "absent", "Absent")}</p>
                                    <h3 className="text-2xl font-bold text-red-600">{stats?.absent || 0}</h3>
                                </div>
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <p className="text-gray-500 text-xs uppercase font-bold">{t("profile", "remainingSessions", "Remaining")}</p>
                                    <h3 className="text-2xl font-bold text-indigo-600">
                                        {groups?.filter(g => g.status === 'active').reduce((acc, g) => acc + (g.package?.sessionNo || 0), 0) - (stats?.total || 0)}
                                    </h3>
                                </div>
                            </div>

                            {groups?.filter(g => g.status === 'active').length > 0 ? (
                                groups.filter(g => g.status === 'active').map(group => (
                                    <div key={group._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-800">{group.name}</h3>
                                                <p className="text-gray-500 text-lg">{group.package?.name}</p>
                                                <div className="flex items-center gap-2 mt-2 text-gray-600">
                                                    <FaChalkboardTeacher />
                                                    <span>{t("profile", "instructor", "Instructor")}: <span className="font-semibold">{group.instructor?.name}</span></span>
                                                </div>
                                            </div>
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">
                                                {t("profile", "active", "Active")}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
                                            <div className="bg-gray-50 p-6 rounded-xl">
                                                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                    <FaClock /> {t("profile", "weeklySchedule", "Weekly Schedule")}
                                                </h4>
                                                <div className="space-y-3">
                                                    {group.schedule.map((s, i) => (
                                                        <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100">
                                                            <span className="font-medium text-gray-700">{s.day}</span>
                                                            <span className="text-sm text-blue-600 font-bold">{s.startTime} - {s.endTime}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* <div className="bg-gray-50 p-6 rounded-xl">
                                                <h4 className="font-bold text-gray-800 mb-4">{t("profile", "classLink", "Class Link")}</h4>
                                                {group.zoomLink ? (
                                                    <a
                                                        href={group.zoomLink}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                                                    >
                                                        <FaBoxOpen /> {t("profile", "joinZoom", "Join Zoom Meeting")}
                                                    </a>
                                                ) : (
                                                    <div className="text-center py-4 text-gray-500 italic">
                                                        {t("profile", "noLink", "No link available yet")}
                                                    </div>
                                                )}
                                            </div> */}
                                        </div>

                                        {/* Attendance History for this group */}
                                        <div className="mt-8">
                                            <h4 className="font-bold text-gray-800 mb-4 flex justify-between items-center">
                                                <span>{t("profile", "attendanceLog", "Attendance Log")}</span>
                                                <span className="text-sm font-normal text-gray-500">
                                                    {t("profile", "remainingSessions", "Sessions Remaining")}: {Math.max(0, (group.package?.sessionNo || 0) - attendanceHistory?.filter(r => r.group?.toString() === group._id?.toString()).length)} / {group.package?.sessionNo || 0}
                                                </span>
                                            </h4>
                                            <div className="overflow-hidden rounded-xl border border-gray-200">
                                                <table className="w-full text-left">
                                                    <thead className="bg-gray-50 border-b border-gray-200">
                                                        <tr>
                                                            <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">{t("profile", "date", "Date")}</th>
                                                            <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">{t("profile", "topic", "Topic")}</th>
                                                            <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">{t("profile", "status", "Status")}</th>
                                                            <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">{t("profile", "action", "Action")}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {attendanceHistory?.filter(r => r.group?.toString() === group._id?.toString()).map((record, idx) => (
                                                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                                    <div className="font-medium">{new Date(record.date).toLocaleDateString()}</div>
                                                                    <div className="text-xs text-gray-400">{record.startTime} - {record.endTime}</div>
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[150px]">
                                                                    {record.topic || "-"}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <StatusBadge status={t("profile", String(record.status).toLowerCase(), record.status)} />
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    {!user?.isFrozen && record.zoomLink ? (
                                                                        <a
                                                                            href={record.zoomLink}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold hover:bg-blue-600 hover:text-white transition"
                                                                        >
                                                                            {t("profile", "joinLink", "Join Link")}
                                                                        </a>
                                                                    ) : user?.isFrozen ? (
                                                                        <span className="text-xs text-cyan-600 font-medium">{t("profile", "accountFrozen", "Account Frozen")}</span>
                                                                    ) : (
                                                                        <span className="text-xs text-gray-400 font-medium">{t("profile", "noLink", "No Link")}</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                {(!attendanceHistory?.some(r => r.group?.toString() === group._id?.toString())) && (
                                                    <div className="p-8 text-center bg-gray-50 text-gray-500 text-sm italic">
                                                        {t("profile", "noAttendance", "No attendance records for this group yet.")}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <FaChalkboardTeacher size={24} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700">{t("profile", "noActiveGroup", "No Active Group")}</h3>
                                    <p className="text-gray-500">{t("profile", "notAssigned", "You are not currently assigned to an active group.")}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "packages" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold text-gray-800">{t("profile", "myPackagesTitle", "My Packages")}</h2>
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
                                                <p className="text-gray-500 text-sm mb-1">{t("profile", "bookedOn", "Booked on")} {new Date(booking.createdAt).toLocaleDateString()}</p>
                                                <p className="text-gray-500 text-sm">{t("profile", "packageId", "Package ID")}: <span className="font-mono bg-gray-100 px-1 rounded">{booking._id.slice(-6)}</span></p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-blue-600">{booking.amount} {booking.currency}</div>
                                                <div className="text-sm text-gray-500 capitalize">{booking.paymentType} {t("profile", "payment", "Payment")}</div>
                                                {booking.paymentStatus === 'unpaid' && (
                                                    <button className="mt-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                                                        {t("profile", "payNow", "Pay Now")}
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
                                    <h3 className="text-lg font-semibold text-gray-700">{t("profile", "noActivePackages", "No active packages")}</h3>
                                    <p className="text-gray-500 mb-6">{t("profile", "noPackagesDesc", "You haven't subscribed to any packages yet.")}</p>
                                    <a href="/courses" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition">
                                        {t("profile", "browseCourses", "Browse Courses")}
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "classes" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold text-gray-800">{t("profile", "myClassesTitle", "My Classes")}</h2>
                            {isLoadingHistory ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                </div>
                            ) : groups?.length > 0 ? (
                                <div className="grid gap-6">
                                    {groups.map((group) => (
                                        <div key={group._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800">{group.name}</h3>
                                                    <p className="text-gray-500">{group.package?.name}</p>
                                                    <p className="text-gray-500 text-sm mt-1">{t("profile", "instructor", "Instructor")}: {group.instructor?.name}</p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs rounded-full font-bold ${group.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {group.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                <p><span className="font-semibold">{t("profile", "schedule", "Schedule")}:</span> {group.schedule.map(s => `${s.day} ${s.startTime}-${s.endTime}`).join(", ")}</p>
                                                <p className="mt-2">
                                                    <span className="font-semibold">{t("profile", "zoomLink", "Zoom Link")}:</span>{" "}
                                                    {!user?.isFrozen && group.zoomLink ? (
                                                        <a href={group.zoomLink} target="_blank" rel="noreferrer" className="text-blue-600 underline">{t("profile", "joinClass", "Join Class")}</a>
                                                    ) : user?.isFrozen ? (
                                                        <span className="text-cyan-600">{t("profile", "accountFrozen", "Account Frozen")}</span>
                                                    ) : (
                                                        t("profile", "noLink", "No link available yet")
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                    <p className="text-gray-500">{t("profile", "noClasses", "You are not enrolled in any active classes.")}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "sessions" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold text-gray-800">{t("profile", "mySessionsTitle", "My Sessions History")}</h2>
                            {isLoadingHistory ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (freeSessions?.length > 0 || attendanceHistory?.length > 0) ? (
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="divide-y divide-gray-100">
                                        {[...(attendanceHistory || []).map(s => ({ ...s, type: 'regular' })), ...(freeSessions || []).map(s => ({ ...s, type: 'free' }))]
                                            .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
                                            .map((session) => (
                                                <div key={session._id} className="p-6 hover:bg-gray-50 transition-colors">
                                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                                        <div className="flex items-start gap-4">
                                                            <div className={`p-3 rounded-xl ${session.type === 'regular' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                                <FaCalendarCheck size={20} />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-gray-800 text-lg mb-1">
                                                                    {session.type === 'regular' ? `${session.groupName} - ${session.topic || 'Class Session'}` : `${session.level} Level Assessment`}
                                                                </h4>
                                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                    <span className="flex items-center gap-1">
                                                                        <FaClock size={14} />
                                                                        {session.type === 'regular'
                                                                            ? `${new Date(session.date).toLocaleDateString()} ${session.startTime}`
                                                                            : (session.freeSessionSlotId ? new Date(session.freeSessionSlotId.startTime).toLocaleString() : 'Date TBD')}
                                                                    </span>
                                                                </div>
                                                                {(session.notes || session.note) && (
                                                                    <p className="mt-2 text-sm bg-yellow-50 text-yellow-800 p-2 rounded-lg border border-yellow-100">
                                                                        Note: {typeof (session.notes || session.note) === 'object'
                                                                            ? (Array.isArray(session.notes) ? session.notes[session.notes.length - 1]?.text : JSON.stringify(session.notes || session.note))
                                                                            : (session.notes || session.note)}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-2">
                                                            <StatusBadge status={session.status} />
                                                            {session.type === 'free' && session.instructor && (
                                                                <span className="text-sm text-gray-500">
                                                                    {t("profile", "instructorAssigned", "Instructor Assigned")}
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
                                    <h3 className="text-lg font-semibold text-gray-700">{t("profile", "noSessionHistory", "No session history")}</h3>
                                    <p className="text-gray-500 mb-6">{t("profile", "bookFreeTestDesc", "Book a free test to get started!")}</p>
                                    <a href="/free-test" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition">
                                        {t("profile", "bookFreeTest", "Book Free Test")}
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "payments" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold text-gray-800">{t("profile", "paymentHistoryTitle", "Payment History")}</h2>
                            {isLoadingHistory ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                </div>
                            ) : packageBookings?.length > 0 ? (
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">{t("profile", "date", "Date")}</th>
                                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">{t("profile", "description", "Description")}</th>
                                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">{t("profile", "amount", "Amount")}</th>
                                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">{t("profile", "method", "Method")}</th>
                                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">{t("profile", "status", "Status")}</th>
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
                                    <h3 className="text-lg font-semibold text-gray-700">{t("profile", "noPaymentHistory", "No payment history")}</h3>
                                    <p className="text-gray-500">{t("profile", "noPaymentDesc", "Your transaction history will appear here.")}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "affiliate" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold text-gray-800">{t("affiliate", "title", "Affiliate Program")}</h2>
                            <AffiliateContent />
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold text-gray-800">{t("profile", "accountSettings", "Account Settings")}</h2>
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                                <form onSubmit={handleUpdate} className="space-y-6 max-w-2xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">{t("profile", "fullName", "Full Name")}</label>
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
                                            <label className="text-sm font-bold text-gray-700">{t("profile", "phoneNumber", "Phone Number")}</label>
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
                                        <label className="text-sm font-bold text-gray-700">{t("profile", "emailAddress", "Email Address (Read Check-only)")}</label>
                                        <input
                                            type="email"
                                            disabled
                                            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                                            value={user?.email || ""}
                                        />
                                        <p className="text-xs text-gray-400">{t("profile", "emailHelper", "Please contact support to change your email.")}</p>
                                    </div>

                                    <div className="border-t border-gray-100 my-6 pt-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <FaLock /> {t("profile", "changePassword", "Change Password")}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700">{t("profile", "newPassword", "New Password")}</label>
                                                <input
                                                    type="password"
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder={t("profile", "leaveEmpty", "Leave empty to keep current")}
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700">{t("profile", "confirmPassword", "Confirm Password")}</label>
                                                <input
                                                    type="password"
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder={t("profile", "confirmNewPassword", "Confirm new password")}
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
                                            {isUpdating ? t("profile", "saving", "Saving Changes...") : t("profile", "saveChanges", "Save Changes")}
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

const AffiliateContent = () => {
    const { data: affiliateData, isLoading } = useGetAffiliateStats();
    const { data: referralsData, isLoading: isLoadingReferrals } = useGetReferralHistory();
    const stats = affiliateData?.data || { promoCode: "...", affiliateBalance: 0, discountPercentage: 10, rewardAmount: 50 };
    const referrals = referralsData?.data || [];
    const { t } = useI18n();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(stats.promoCode);
        Swal.fire({
            icon: "success",
            title: t("affiliate", "copied", "Copied!"),
            text: t("affiliate", "copySuccess", "Promo code copied to clipboard"),
            timer: 1500,
            showConfirmButton: false,
        });
    };

    if (isLoading) return <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <FaShareAlt size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{t("affiliate", "yourCode", "Your Promo Code")}</h3>
                    <p className="text-gray-500 text-center mb-6">
                        {t("affiliate", "shareDesc", "Share this code. Friends get")} <span className="text-blue-600 font-bold">{stats.discountPercentage}% {t("affiliate", "off", "OFF")}</span>{", "}
                        {t("affiliate", "youshareDesc2", "and you get")} <span className="text-emerald-600 font-bold">{stats.rewardAmount} EGP</span>!
                    </p>

                    <div className="flex items-center gap-2 w-full max-w-sm">
                        <div className="flex-1 bg-gray-50 border-2 border-dashed border-blue-200 rounded-xl px-4 py-3 text-center font-mono text-xl font-bold text-blue-700">
                            {stats.promoCode ==="..." ? "-" : stats.promoCode}
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className={"bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20" + (stats.promoCode === "..." ? " opacity-50 cursor-not-allowed hidden" : "")}
                            disabled={stats.promoCode === "..."}
                        >
                            
                            {t("affiliate", "copy", "Copy")}
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                        <FaMoneyBillWave size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{t("affiliate", "balance", "Affiliate Balance")}</h3>
                    <p className="text-4xl font-extrabold text-emerald-600 mb-2">{stats.affiliateBalance} EGP</p>
                    <p className="text-sm text-gray-400 max-w-[200px]">{t("affiliate", "balanceDesc", "This balance can be used for your next booking.")}</p>
                </div>
            </div>

            {/* Referral History Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaHistory className="text-blue-600" />
                    {t("affiliate", "referralHistory", "Referral History")}
                </h3>

                {isLoadingReferrals ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : referrals.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">{t("affiliate", "student", "Student")}</th>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">{t("affiliate", "date", "Date")}</th>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">{t("affiliate", "reward", "Reward")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {referrals.map((ref, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-800">{ref.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{new Date(ref.createdAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 font-bold text-emerald-600">+{ref.rewardAmount} EGP</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 italic">
                        {t("affiliate", "noReferrals", "No referrals yet. Start sharing your code!")}
                    </div>
                )}
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl">
                <h3 className="text-xl font-bold mb-4">{t("affiliate", "howItWorks", "How it works?")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                        <div className="text-2xl font-black mb-1 text-blue-200">01</div>
                        <p className="text-sm">{t("affiliate", "step1", "Share your unique promo code with friends or family.")}</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                        <div className="text-2xl font-black mb-1 text-blue-200">02</div>
                        <p className="text-sm">{t("affiliate", "step2", "They get an immediate discount when they book their first package.")}</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                        <div className="text-2xl font-black mb-1 text-blue-200">03</div>
                        <p className="text-sm">{t("affiliate", "step3", "Once their booking is confirmed, your balance will be credited!")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
