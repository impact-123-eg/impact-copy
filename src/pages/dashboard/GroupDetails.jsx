import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { ChevronDown, Search, Loader2, Send, Users, Calendar as CalendarIcon, User as UserIcon, ShieldCheck, Mail, Info, Clock, Activity, ExternalLink, XCircle, CheckCircle, Settings, Save, Edit2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper Component for Countdown Timer
const SessionTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(targetDate) - new Date();
            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);

                if (days > 0) return `${days}d ${hours}h`;
                return `${hours}h ${minutes}m`;
            } else if (difference > -1000 * 60 * 60 * 2) { // Within 2 hours after start
                return "In Progress";
            } else {
                return "Ended";
            }
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 60000);

        setTimeLeft(calculateTimeLeft());

        return () => clearInterval(timer);
    }, [targetDate]);

    return <span className="font-mono text-xs font-semibold text-blue-600">{timeLeft}</span>;
};


const GroupDetails = () => {
    const { id } = useParams();
    const { user, token } = useAuth();
    const [group, setGroup] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState("sessions"); // "sessions" or "students"
    const [isGroupEditModalOpen, setIsGroupEditModalOpen] = useState(false);
    const [groupEditData, setGroupEditData] = useState({
        name: "",
        instructor: "",
        maxSessions: 0,
        telegramLink: "",
        status: ""
    });

    // Quick Edit Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentSession, setCurrentSession] = useState(null);
    const [modalData, setModalData] = useState({
        topic: "",
        zoomLink: "",
        notes: "",
        attendance: [],
        instructor: "",
        maxSessions: 0,
        telegramLink: ""
    });
    const [savingModal, setSavingModal] = useState(false);
    const [instructors, setInstructors] = useState([]);
    const [applyToFuture, setApplyToFuture] = useState(false);

    // Add Student Logic
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
    const [allStudents, setAllStudents] = useState([]);
    const [studentSearchTerm, setStudentSearchTerm] = useState("");
    const [isStudentSelectOpen, setIsStudentSelectOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState("");

    useEffect(() => {
        fetchGroupDetails();
        fetchInstructors();
        fetchStudents();
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
            setSessions(res.data.sort((a, b) => new Date(a.date) - new Date(b.date)));
        } catch (_error) {
            toast.error("Failed to load sessions");
        }
    };

    const handleUpdateSessionStatus = async (sessionId, status) => {
        try {
            await axios.patch(`${API_BASE_URL}/sessions/${sessionId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success(`Session ${status} successfully`);
            fetchSessions(group._id);
        } catch (_error) {
            toast.error("Failed to update session status");
        }
    };

    const handleGenerateSessions = async () => {
        if (!group) return;
        setGenerating(true);
        try {
            await axios.post(`${API_BASE_URL}/sessions/generate-next`, { groupId: group._id }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Next session scheduled successfully");
            fetchSessions(group._id);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to schedule session");
        } finally {
            setGenerating(false);
        }
    };

    const openGroupEditModal = () => {
        setGroupEditData({
            name: group.name,
            instructor: group.instructor?._id || group.instructor || "",
            maxSessions: group.maxSessions || 0,
            telegramLink: group.telegramLink || "",
            status: group.status || "active"
        });
        setIsGroupEditModalOpen(true);
    };

    const handleGroupUpdate = async () => {
        try {
            setSavingModal(true);
            const res = await axios.patch(`${API_BASE_URL}/groups/${group._id}`, {
                name: groupEditData.name,
                instructor: groupEditData.instructor,
                maxSessions: groupEditData.maxSessions,
                telegramLink: groupEditData.telegramLink,
                status: groupEditData.status
            }, { headers: { Authorization: `Bearer ${token}` } });

            setGroup(res.data);
            toast.success("Group settings updated");
            setIsGroupEditModalOpen(false);
        } catch (_error) {
            toast.error("Failed to update group");
        } finally {
            setSavingModal(false);
        }
    };

    const openEditModal = (session) => {
        setCurrentSession(session);
        setModalData({
            topic: session.topic || "",
            zoomLink: session.zoomLink || "",
            notes: session.notes || "",
            attendance: session.attendance || [],
            instructor: session.instructor?._id || session.instructor || "",
            maxSessions: group.maxSessions || 0,
            telegramLink: group.telegramLink || ""
        });
        setApplyToFuture(false);
        setIsEditModalOpen(true);
    };

    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/users?role=student`, { headers: { Authorization: `Bearer ${token}` } });
            setAllStudents(res.data.data);
        } catch (error) {
            console.error("Error fetching students", error);
        }
    };

    const fetchInstructors = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/users?role=instructor`, { headers: { Authorization: `Bearer ${token}` } });
            setInstructors(res.data.data);
        } catch (error) {
            console.error("Error fetching instructors", error);
        }
    };

    const handleAddStudent = async () => {
        if (!selectedStudentId) return;
        try {
            await axios.post(`${API_BASE_URL}/groups/students`, {
                groupId: group._id,
                studentIds: [selectedStudentId]
            }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Student added successfully");
            setIsAddStudentModalOpen(false);
            setStudentSearchTerm("");
            setSelectedStudentId("");
            fetchGroupDetails();
        } catch (_error) {
            toast.error("Failed to add student");
        }
    };

    const handleModalSave = async () => {
        try {
            setSavingModal(true);
            await axios.patch(`${API_BASE_URL}/sessions/${currentSession._id}`, {
                topic: modalData.topic,
                zoomLink: modalData.zoomLink,
                notes: modalData.notes,
                instructor: modalData.instructor,
                applyToFuture: applyToFuture
            }, { headers: { Authorization: `Bearer ${token}` } });

            if (modalData.maxSessions !== group.maxSessions || modalData.telegramLink !== group.telegramLink) {
                await axios.patch(`${API_BASE_URL}/groups/${group._id}`, {
                    maxSessions: modalData.maxSessions,
                    telegramLink: modalData.telegramLink
                }, { headers: { Authorization: `Bearer ${token}` } });
            }

            await axios.post(`${API_BASE_URL}/sessions/${currentSession._id}/attendance`, {
                attendance: modalData.attendance.map(a => ({
                    studentId: a.student?._id || a.student,
                    status: a.status,
                    note: a.note
                }))
            }, { headers: { Authorization: `Bearer ${token}` } });

            toast.success("Session updated successfully");
            setIsEditModalOpen(false);
            fetchGroupDetails();
        } catch (error) {
            console.error("Error saving session:", error);
            toast.error("Failed to update session");
        } finally {
            setSavingModal(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
        </div>
    );
    if (!group) return <div className="p-8 text-center text-gray-500">Group not found or access denied.</div>;

    const filteredStudents = allStudents.filter(s =>
        !group.students.some(gs => gs._id === s._id) &&
        (s.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(studentSearchTerm.toLowerCase()))
    );

    const selectedStudentObj = allStudents.find(s => s._id === selectedStudentId);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header Section - Modern Profile Style */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-gradient-to-br from-[#0d5cae] via-[#0d5cae] to-[#f5d019] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Users size={120} />
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-black tracking-tight drop-shadow-md">{group.name}</h1>
                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border border-white/20 backdrop-blur-sm ${group.status === "active" ? "bg-green-500/20 text-white" : "bg-yellow-500/20 text-white"}`}>
                                    {group.status}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm font-bold">
                                <span className="flex items-center gap-1.5 bg-black/10 px-3 py-1 rounded-full"><ShieldCheck size={16} /> Level {group.package?.levelno}</span>
                                <span className="flex items-center gap-1.5 bg-black/10 px-3 py-1 rounded-full"><Info size={16} /> {group.package?.category?.en?.title}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                                {group.maxSessions > 0 && (
                                    <span className="bg-white/10 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2 border border-white/10">
                                        <CalendarIcon size={12} /> {group.maxSessions} Sessions Limit
                                    </span>
                                )}
                                {group.telegramLink && (
                                    <a
                                        href={group.telegramLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white text-blue-700 hover:bg-yellow-400 hover:text-blue-900 transition-all px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg"
                                    >
                                        <Send size={12} /> Telegram Community
                                    </a>
                                )}
                            </div>
                        </div>
                        {(user?.role === 'admin' || user?.role === 'cs') && (
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={openGroupEditModal}
                                    className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold transition-all border border-white/20 backdrop-blur-sm flex items-center gap-2"
                                >
                                    <Settings size={18} /> Edit Group
                                </button>
                                <button
                                    onClick={() => setIsAddStudentModalOpen(true)}
                                    className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold transition-all border border-white/20 backdrop-blur-sm flex items-center gap-2"
                                >
                                    <Users size={18} /> Add Student
                                </button>
                                <button
                                    onClick={handleGenerateSessions}
                                    disabled={generating}
                                    className="bg-white text-blue-700 hover:bg-blue-50 px-5 py-2.5 rounded-xl font-black transition-all shadow-xl shadow-blue-900/20 flex items-center gap-2 disabled:opacity-50"
                                >
                                    <CalendarIcon size={18} /> {generating ? "Scheduling..." : "Plan Session"}
                                </button>
                            </div>
                        )}
                        {user?.role === 'instructor' && (
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={openGroupEditModal}
                                    className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold transition-all border border-white/20 backdrop-blur-sm flex items-center gap-2"
                                >
                                    <Settings size={18} /> Edit Group
                                </button>
                                <button
                                    onClick={() => setIsAddStudentModalOpen(true)}
                                    className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold transition-all border border-white/20 backdrop-blur-sm flex items-center gap-2"
                                >
                                    <Users size={18} /> Add Student
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
                    <div className="p-6 text-center">
                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Total Students</p>
                        <p className="text-2xl font-black text-gray-900">{group.students?.length}</p>
                    </div>
                    <div className="p-6 text-center">
                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Total Sessions</p>
                        <p className="text-2xl font-black text-gray-900">{sessions.length}</p>
                    </div>
                    <div className="p-6 text-center">
                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Instructor</p>
                        <p className="text-xl font-black text-blue-600 truncate px-2">{group.instructor?.name || "Unassigned"}</p>
                    </div>
                    <div className="p-6 text-center">
                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Start Date</p>
                        <p className="text-xl font-black text-gray-900">{new Date(group.startDate).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-2 p-1 bg-gray-100/50 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab("sessions")}
                    className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === "sessions" ? "bg-white text-blue-600 shadow-md translate-y-[-1px]" : "text-gray-400 hover:text-gray-600"}`}
                >
                    Sessions View
                </button>
                <button
                    onClick={() => setActiveTab("students")}
                    className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === "students" ? "bg-white text-blue-600 shadow-md translate-y-[-1px]" : "text-gray-400 hover:text-gray-600"}`}
                >
                    Student Progress
                </button>
            </div>

            {activeTab === "sessions" ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-[10px] uppercase font-black text-gray-400 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-5">Date & Time</th>
                                <th className="px-6 py-5">Timer</th>
                                <th className="px-6 py-5">Instructor</th>
                                <th className="px-6 py-5">Topic</th>
                                <th className="px-6 py-5">Zoom</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {sessions.map((session) => (
                                <tr key={session._id} className={session.status === 'cancelled' ? 'bg-gray-50 text-gray-400' : ''}>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-black text-gray-900">
                                            {new Date(session.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </div>
                                        <div className="text-xs text-gray-400 font-medium">
                                            {session.startTime} - {session.endTime}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {session.status === 'scheduled' ? (
                                            <SessionTimer targetDate={`${session.date.split('T')[0]}T${session.startTime}`} />
                                        ) : (
                                            <span className="text-xs text-gray-300 font-black uppercase">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-700">
                                        {session.instructor?.name || group.instructor?.name || "Pending"}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                        {session.topic || "No Topic Set"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {session.zoomLink ? (
                                            <a href={session.zoomLink} target="_blank" rel="noopener noreferrer" className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors inline-block">
                                                <ExternalLink size={16} />
                                            </a>
                                        ) : (
                                            <span className="text-gray-300"><Clock size={16} /></span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md 
                                            ${session.status === 'completed' ? 'bg-green-50 text-green-600' :
                                                session.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                            {session.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEditModal(session)} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                                                <Activity size={18} />
                                            </button>
                                            {(user?.role === 'admin' || user?.role === 'cs') && (
                                                <>
                                                    {session.status !== 'cancelled' ? (
                                                        <button onClick={() => handleUpdateSessionStatus(session._id, 'cancelled')} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                                            <XCircle size={18} />
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => handleUpdateSessionStatus(session._id, 'scheduled')} className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-[10px] uppercase font-black text-gray-400 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-5">Student</th>
                                <th className="px-6 py-5">Attendance Progress</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5">Financial</th>
                                <th className="px-6 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {group.students?.map((student) => {
                                const progress = group.maxSessions > 0 ? (student.booking?.attendedSessions / group.maxSessions) * 100 : 0;
                                return (
                                    <tr key={student._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-black uppercase tracking-tighter shadow-inner">
                                                    {student.name.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900">{student.name}</p>
                                                    <p className="text-xs font-medium text-gray-400 flex items-center gap-1"><Mail size={12} /> {student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4 w-60">
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${progress > 75 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]' : progress > 40 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-black text-gray-700 whitespace-nowrap">
                                                    {student.booking?.attendedSessions || 0} / {group.maxSessions || "-"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${student.booking?.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {student.booking?.status || "No Booking"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${student.booking?.paymentStatus === 'paid' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                                                    {student.booking?.paymentStatus || "Unpaid"}
                                                </span>
                                                {student.booking?.remainingAmount > 0 && (
                                                    <p className="text-[10px] font-bold text-red-400 tracking-tighter">Debt: {student.booking.remainingAmount} EGP</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link to={`/dash/users/${student._id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors inline-block">
                                                <UserIcon size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Group Edit Modal */}
            {isGroupEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60] overflow-y-auto backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl p-8 relative animate-in zoom-in-95 duration-300">
                        <button onClick={() => setIsGroupEditModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
                            <XCircle size={28} />
                        </button>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                                <Edit2 size={24} />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Group Settings</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">Internal Title</label>
                                <input
                                    type="text"
                                    value={groupEditData.name}
                                    onChange={(e) => setGroupEditData({ ...groupEditData, name: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300"
                                    placeholder="Enterprise Blue Team..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">Max Sessions</label>
                                    <input
                                        type="number"
                                        value={groupEditData.maxSessions}
                                        onChange={(e) => setGroupEditData({ ...groupEditData, maxSessions: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">Status</label>
                                    <select
                                        value={groupEditData.status}
                                        onChange={(e) => setGroupEditData({ ...groupEditData, status: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all"
                                    >
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">Main Instructor</label>
                                <select
                                    value={groupEditData.instructor}
                                    onChange={(e) => setGroupEditData({ ...groupEditData, instructor: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    <option value="">Select Instructor</option>
                                    {instructors.map(inst => <option key={inst._id} value={inst._id}>{inst.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">Telegram Community Link</label>
                                <input
                                    type="text"
                                    value={groupEditData.telegramLink}
                                    onChange={(e) => setGroupEditData({ ...groupEditData, telegramLink: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300"
                                    placeholder="https://t.me/..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-10">
                            <button onClick={() => setIsGroupEditModalOpen(false)} className="flex-1 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-50 transition-colors uppercase text-xs tracking-widest">Discard</button>
                            <button onClick={handleGroupUpdate} disabled={savingModal} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2 uppercase text-xs tracking-widest">
                                <Save size={18} /> {savingModal ? "Updating..." : "Persist Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative">
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <XCircle size={24} />
                        </button>
                        <h2 className="text-2xl font-bold mb-6">Manage Session</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                                    <input type="text" value={modalData.topic} onChange={(e) => setModalData({ ...modalData, topic: e.target.value })} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Zoom Link</label>
                                    <input type="text" value={modalData.zoomLink} onChange={(e) => setModalData({ ...modalData, zoomLink: e.target.value })} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 font-medium" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea value={modalData.notes} onChange={(e) => setModalData({ ...modalData, notes: e.target.value })} className="w-full border rounded-lg p-2 h-20 focus:ring-2 focus:ring-blue-500 font-medium" />
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <label className="block text-sm font-bold text-blue-900 mb-2">Session Instructor</label>
                                <select value={modalData.instructor} onChange={(e) => setModalData({ ...modalData, instructor: e.target.value })} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 font-medium mb-2">
                                    <option value="">Select Instructor</option>
                                    {instructors.map(inst => <option key={inst._id} value={inst._id}>{inst.name}</option>)}
                                </select>
                                <div className="flex items-center gap-2 mb-4">
                                    <input type="checkbox" id="applyFuture" checked={applyToFuture} onChange={(e) => setApplyToFuture(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                                    <label htmlFor="applyFuture" className="text-sm text-blue-800 font-medium">Apply change to all future sessions</label>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-blue-100">
                                    <div>
                                        <label className="block text-xs font-bold text-blue-700 mb-1">Max Sessions</label>
                                        <input type="number" value={modalData.maxSessions} onChange={(e) => setModalData({ ...modalData, maxSessions: parseInt(e.target.value) || 0 })} className="w-full border rounded p-1.5 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-blue-700 mb-1">Telegram Link</label>
                                        <input type="text" value={modalData.telegramLink} onChange={(e) => setModalData({ ...modalData, telegramLink: e.target.value })} className="w-full border rounded p-1.5 text-sm" />
                                    </div>
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <h3 className="font-bold mb-3 uppercase text-[10px] tracking-widest text-gray-400">Attendance Log</h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                    {group.students?.map((student) => {
                                        const attRecord = modalData.attendance.find(a => (a.student?._id || a.student) === student._id);
                                        const currentStatus = attRecord?.status || 'pending';
                                        return (
                                            <div key={student._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <div className="flex flex-col"><span className="font-bold text-gray-900 text-sm">{student.name}</span></div>
                                                <div className="flex bg-white rounded-lg p-0.5 border shadow-sm">
                                                    {['present', 'absent', 'late', 'excused'].map(status => (
                                                        <button key={status} onClick={() => {
                                                            const newAtt = [...modalData.attendance];
                                                            const idx = newAtt.findIndex(a => (a.student?._id || a.student) === student._id);
                                                            if (idx > -1) newAtt[idx] = { ...newAtt[idx], status };
                                                            else newAtt.push({ student: student._id, status });
                                                            setModalData({ ...modalData, attendance: newAtt });
                                                        }} className={`px-2 py-1 rounded-md text-[9px] font-black uppercase transition-all ${currentStatus === status ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}>{status}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-gray-50 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-100 text-xs uppercase tracking-widest transition-colors">Cancel</button>
                            <button onClick={handleModalSave} disabled={savingModal} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 disabled:opacity-50">{savingModal ? "Saving..." : "Commit Data"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Student Modal */}
            {isAddStudentModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative">
                        <button onClick={() => setIsAddStudentModalOpen(false)} className="absolute top-6 right-6 text-gray-300 hover:text-gray-500"><XCircle size={28} /></button>
                        <h2 className="text-3xl font-black text-gray-900 mb-8">Add New Student</h2>
                        <div className="space-y-6">
                            <div className="relative">
                                <label className="block text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">Select From Database</label>
                                <button
                                    onClick={() => setIsStudentSelectOpen(!isStudentSelectOpen)}
                                    className="flex items-center justify-between w-full px-5 py-4 text-base bg-gray-50 border border-gray-100 rounded-2xl hover:border-blue-300 transition-all duration-300 focus:outline-none"
                                >
                                    <span className={`block truncate ${!selectedStudentObj ? 'text-gray-400' : 'text-gray-900 font-bold'}`}>
                                        {selectedStudentObj ? `${selectedStudentObj.name} (${selectedStudentObj.email})` : "Choose a student..."}
                                    </span>
                                    <ChevronDown className="h-5 w-5 text-gray-400" />
                                </button>
                                {isStudentSelectOpen && (
                                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                                        <div className="px-4 py-2 border-b border-gray-50">
                                            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                                                <Search className="h-4 w-4 text-gray-400" />
                                                <input type="text" autoFocus className="bg-transparent border-none outline-none text-sm w-full" placeholder="Search students..." value={studentSearchTerm} onChange={(e) => setStudentSearchTerm(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                            {filteredStudents.map(student => (
                                                <button key={student._id} onClick={() => { setSelectedStudentId(student._id); setIsStudentSelectOpen(false); }} className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:font-bold transition-all flex flex-col">
                                                    <span className="font-bold">{student.name}</span>
                                                    <span className="text-[10px] text-gray-400">{student.email}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button onClick={handleAddStudent} disabled={!selectedStudentId} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 mt-4">Bond Student to Group</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupDetails;
