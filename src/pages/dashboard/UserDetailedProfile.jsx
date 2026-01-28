import { useParams, Link } from "react-router-dom";
import { useAdminGetUsers, useAddUserNote, useToggleSubscription, useUpdateUser, useToggleFreeze } from "@/hooks/Actions/users/useCurdsUsers";
import { useAdminGetReferralHistory } from "@/hooks/Actions/affiliate/useAffiliate";
import {
    Mail, CheckCircle, XCircle,
    ArrowLeft, ClipboardList, Clock, Activity, ExternalLink,
    Tag, Save, History, Briefcase, Users, Snowflake
} from "lucide-react";
import Swal from "sweetalert2";

const UserDetailedProfile = () => {
    const { id } = useParams();
    const { data: usersData, isLoading, refetch } = useAdminGetUsers({ _id: id });
    const { mutate: addNote, isPending: isAddingNote } = useAddUserNote();
    const { mutate: toggleSubscription } = useToggleSubscription();
    const { mutate: toggleFreeze } = useToggleFreeze();
    const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUser();
    const { data: referralsData, isLoading: isLoadingReferrals } = useAdminGetReferralHistory(id);

    const referrals = referralsData?.data || [];

    // The hook returns all users (paginated), we filter for our specific one (which should be the only one if ID is passed and handled)
    const student = usersData?.data?.data?.data?.find(u => u._id === id);

    const handleUpdateAffiliate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            promoCode: formData.get("promoCode").toUpperCase(),
            affiliateDiscount: formData.get("affiliateDiscount") === "" ? null : Number(formData.get("affiliateDiscount")),
            affiliateReward: formData.get("affiliateReward") === "" ? null : Number(formData.get("affiliateReward")),
            affiliateBalance: formData.get("affiliateBalance") === "" ? 0 : Number(formData.get("affiliateBalance")),
        };

        updateUser(
            { id, data },
            {
                onSuccess: () => {
                    refetch();
                    Swal.fire("Updated!", "Affiliate settings have been updated.", "success");
                },
                onError: (err) => {
                    Swal.fire("Error", err.response?.data?.message || "Failed to update affiliate settings", "error");
                }
            }
        );
    };

    const activeEnrollment = student?.packageHistory?.find(pkg => pkg.status === "confirmed" && pkg.group);

    const handleToggleSub = () => {
        const currentStatus = student?.isSubscribed;
        Swal.fire({
            title: "Update Subscription",
            text: `Are you sure you want to ${currentStatus ? "unsubscribe" : "subscribe"} this student?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, update it!",
        }).then((result) => {
            if (result.isConfirmed) {
                toggleSubscription(
                    { data: { userId: id, status: !currentStatus } },
                    { onSuccess: () => refetch() }
                );
            }
        });
    };

    const handleToggleFreeze = () => {
        const currentStatus = student?.isFrozen;
        Swal.fire({
            title: `${currentStatus ? "Unfreeze" : "Freeze"} Account`,
            text: `Are you sure you want to ${currentStatus ? "unfreeze" : "freeze"} this student?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, update it!",
        }).then((result) => {
            if (result.isConfirmed) {
                toggleFreeze(
                    { data: { userId: id, status: !currentStatus } },
                    {
                        onSuccess: () => {
                            refetch();
                            Swal.fire("Updated!", `User has been ${currentStatus ? "unfrozen" : "frozen"}.`, "success");
                        }
                    }
                );
            }
        });
    };

    const handleAddNote = (e) => {
        e.preventDefault();
        const noteText = e.target.note.value;
        if (!noteText.trim()) return;

        addNote(
            { data: { userId: id, noteText } },
            {
                onSuccess: () => {
                    refetch();
                    e.target.reset();
                    Swal.fire("Saved!", "Note has been added.", "success");
                },
            }
        );
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
    );

    if (!student) return <div className="p-8 text-center text-gray-500">Student not found.</div>;

    return (
        <main className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div className="flex items-center gap-4">
                    <Link to="/dash/users" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="h-6 w-6 text-gray-600" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-gray-900">{student.name}</h1>
                            {student.isSubscribed ? (
                                <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                    <CheckCircle size={12} /> Subscribed
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                    <XCircle size={12} /> Inactive
                                </span>
                            )}
                            {student.isFrozen && (
                                <span className="flex items-center gap-1 bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                    <Snowflake size={12} /> Frozen
                                </span>
                            )}
                        </div>
                        <p className="text-gray-500 flex items-center gap-2 mt-1">
                            <Mail className="h-4 w-4" /> {student.email}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleToggleFreeze}
                        className={`px-6 py-2 rounded-xl font-bold transition-all shadow-lg ${student.isFrozen ? "bg-orange-50 text-orange-600 hover:bg-orange-100 shadow-orange-500/10" : "bg-cyan-50 text-cyan-600 hover:bg-cyan-100 shadow-cyan-500/10"
                            }`}
                    >
                        {student.isFrozen ? "Unfreeze Account" : "Freeze Account"}
                    </button>
                    <button
                        onClick={handleToggleSub}
                        className={`px-6 py-2 rounded-xl font-bold transition-all shadow-lg ${student.isSubscribed ? "bg-red-50 text-red-600 hover:bg-red-100 shadow-red-500/10" : "bg-green-50 text-green-600 hover:bg-green-100 shadow-green-500/10"
                            }`}
                    >
                        {student.isSubscribed ? "Deactivate Account" : "Activate Subscription"}
                    </button>
                    {/* <Link
                        to={`/dash/requests?search=${student.email}`}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 hover:bg-blue-700 flex items-center gap-2"
                    >
                        <ExternalLink size={16} /> View All Requests
                    </Link> */}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Basic Info & Stats */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Profile Overview */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gray-50/50 p-6 border-b border-gray-100">
                            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-blue-500" />
                                Student Overview
                            </h2>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none">Phone Number</label>
                                <p className="text-lg font-semibold text-gray-900">{student.phoneNumber || "No phone added"}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none">Preferred Languages</label>
                                <div className="flex gap-2">
                                    {(student.preferredLanguage || []).map(lang => (
                                        <span key={lang} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold capitalize">
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none">Account Status</label>
                                <div className="flex gap-2 items-center">
                                    {student.isVerified ? (
                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-black uppercase">Verified</span>
                                    ) : (
                                        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-black uppercase">Pending Verification</span>
                                    )}
                                    <span className="text-xs text-gray-400">Joined {new Date(student.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none">Analytics</label>
                                <div className="text-sm font-semibold text-gray-600">
                                    {student.history?.length || 0} Free Sessions | {student.packageHistory?.length || 0} Package Bookings
                                </div>
                            </div>
                            {activeEnrollment && (
                                <div className="md:col-span-2 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-[2rem] border border-blue-100 flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                                            <Users size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black text-blue-400 tracking-widest">Currently Enrolled In</p>
                                            <p className="text-xl font-black text-blue-900">{activeEnrollment.group?.name}</p>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/dash/groups/${activeEnrollment.group?._id}`}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                                    >
                                        View Group Details <ExternalLink size={14} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booked Packages History */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gray-50/50 p-6 border-b border-gray-100">
                            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-purple-500" />
                                Course & Package History
                            </h2>
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-[10px] uppercase font-black text-gray-400">
                                    <tr>
                                        <th className="px-6 py-4">Package Name</th>
                                        <th className="px-6 py-4">Group</th>
                                        <th className="px-6 py-4">Progress</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Payment</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {(student.packageHistory || []).length === 0 ? (
                                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">No package history found.</td></tr>
                                    ) : (
                                        student.packageHistory.map(pkg => (
                                            <tr key={pkg._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-gray-800">{pkg.package?.title || "Unknown Package"}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {pkg.group ? (
                                                        <Link to={`/dash/groups/${pkg.group._id}`} className="text-blue-600 hover:underline font-bold text-xs flex items-center gap-1">
                                                            {pkg.group?.name || "View Group"}
                                                            <ExternalLink size={12} />
                                                        </Link>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-blue-500 rounded-full"
                                                                style={{ width: `${Math.min((pkg.attendedSessions / (pkg.group?.maxSessions || 12)) * 100, 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] font-black text-gray-500">{pkg.attendedSessions || 0} Sessions</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-bold">
                                                    <span className={`px-2 py-1 rounded-md ${pkg.status === "confirmed" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                                                        }`}>
                                                        {pkg.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs">
                                                    <span className={`px-2 py-1 rounded-md ${pkg.paymentStatus === "paid" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400"
                                                        }`}>
                                                        {pkg.paymentStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-sm">
                                                    {pkg.amount} {pkg.currency}
                                                </td>
                                                <td className="px-6 py-4 text-xs text-gray-500">
                                                    {new Date(pkg.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Free Session Leads History */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gray-50/50 p-6 border-b border-gray-100">
                            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-amber-500" />
                                Free Session History (Leads)
                            </h2>
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-[10px] uppercase font-black text-gray-400">
                                    <tr>
                                        <th className="px-6 py-4">Slot Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Lead Progress</th>
                                        <th className="px-6 py-4">Assigned Level</th>
                                        <th className="px-6 py-4 text-right">Link</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {(student.history || []).length === 0 ? (
                                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">No session history found.</td></tr>
                                    ) : (
                                        student.history.map(hist => (
                                            <tr key={hist._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium">
                                                    {hist.freeSessionSlotId ? new Date(hist.freeSessionSlotId.startTime).toLocaleDateString() : "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-xs font-bold">
                                                    <span className={`px-2 py-1 rounded-md ${hist.status === "Confirmed" ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-500"
                                                        }`}>
                                                        {hist.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                        {hist.leadStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-bold text-purple-600">
                                                    {hist.level}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link to={`/dash/booking/${hist._id}`} className="text-blue-500 hover:text-blue-700 transition-colors">
                                                        <ExternalLink size={14} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Internal Coordination */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col min-h-[600px]">
                        <div className="bg-gray-50/50 p-6 border-b border-gray-100">
                            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                <ClipboardList className="h-5 w-5 text-indigo-500" />
                                Student Admin Notes
                            </h2>
                        </div>

                        <div className="p-6 flex flex-col h-full space-y-4">
                            {/* Note Form */}
                            <form onSubmit={handleAddNote} className="space-y-2">
                                <textarea
                                    name="note"
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all resize-none h-24"
                                    placeholder="Add an internal note about this student..."
                                />
                                <button
                                    type="submit"
                                    disabled={isAddingNote}
                                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    Log Administrative Note
                                </button>
                            </form>

                            {/* Notes List */}
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                {(student.userNotes || []).length === 0 ? (
                                    <div className="text-center py-12 text-gray-300">
                                        <ClipboardList className="mx-auto h-12 w-12 opacity-20 mb-2" />
                                        <p className="text-xs font-medium uppercase tracking-widest">No notes logs</p>
                                    </div>
                                ) : (
                                    [...student.userNotes].reverse().map((note, idx) => (
                                        <div key={idx} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-2">
                                            <p className="text-sm text-gray-800 leading-relaxed font-medium">&quot;{note.text}&quot;</p>
                                            <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                <span>{note.createdBy}</span>
                                                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Affiliate & Rewards Section */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gray-50/50 p-6 border-b border-gray-100">
                            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                <Tag className="h-5 w-5 text-yellow-500" />
                                Affiliate & Rewards
                            </h2>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleUpdateAffiliate} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Promo Code</label>
                                    <input
                                        name="promoCode"
                                        defaultValue={student.promoCode || ""}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-yellow-500 outline-none font-bold placeholder:font-normal"
                                        placeholder="No code assigned"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Discount (%)</label>
                                        <input
                                            name="affiliateDiscount"
                                            type="number"
                                            defaultValue={student.affiliateDiscount ?? ""}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
                                            placeholder="Global Default"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Reward (EGP)</label>
                                        <input
                                            name="affiliateReward"
                                            type="number"
                                            defaultValue={student.affiliateReward ?? ""}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
                                            placeholder="Global Default"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-emerald-600 tracking-widest">Current Balance (EGP)</label>
                                    <input
                                        name="affiliateBalance"
                                        type="number"
                                        defaultValue={student.affiliateBalance || 0}
                                        className="w-full bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-700"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isUpdatingUser}
                                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Save size={16} /> {isUpdatingUser ? "Saving..." : "Update Affiliate Settings"}
                                </button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-gray-50 space-y-4">
                                <div className="flex items-center gap-2 text-[10px] bg-emerald-50 text-emerald-700 p-3 rounded-xl font-bold">
                                    <Activity size={14} />
                                    Manual balance adjustments are reflected immediately.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Referral History Table (Admin View) */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gray-50/50 p-6 border-b border-gray-100">
                            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                <History className="h-5 w-5 text-blue-500" />
                                Referral History
                            </h2>
                        </div>
                        <div className="p-6">
                            {isLoadingReferrals ? (
                                <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : referrals.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Student</th>
                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Date</th>
                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Reward</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {referrals.map((ref, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{ref.name}</td>
                                                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(ref.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-4 py-3 text-sm font-bold text-emerald-600">+{ref.rewardAmount} EGP</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-500 text-sm italic">
                                    No successful referrals recorded.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default UserDetailedProfile;
