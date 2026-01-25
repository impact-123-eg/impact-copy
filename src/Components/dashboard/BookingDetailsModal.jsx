import React from "react";
import { Link } from "react-router-dom";
import {
    X,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    UserCheck,
    Clock,
    Activity
} from "lucide-react";
import formatTime from "@/utilities/formatTime";

const BookingDetailsModal = ({ booking, onClose }) => {
    if (!booking) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="relative h-32 bg-[var(--Main)] p-6 flex items-end">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                            <User className="h-8 w-8 text-[var(--Main)]" />
                        </div>
                        <div className="text-white">
                            <h2 className="text-2xl font-bold">{booking.name}</h2>
                            <p className="text-white/80 text-sm flex items-center gap-1">
                                Joined {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${booking.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            }`}>
                            Booking: {booking.status}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">
                            {booking.level}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase">
                            {booking.age}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm truncate" title={booking.email}>{booking.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{booking.phoneNumber}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{booking.country}</span>
                                </div>
                            </div>
                        </div>

                        {/* Assignment Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assignment Details</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <UserCheck className="h-4 w-4 text-gray-400" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 leading-none mb-1">Sales Agent</span>
                                        <span className="text-sm font-medium">{booking.salesAgentId?.name || "N/A"}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 leading-none mb-1">Time Slot</span>
                                        <span className="text-sm font-medium">
                                            {booking.freeSessionSlotId ?
                                                `${formatTime(booking.freeSessionSlotId.startTime)} - ${formatTime(booking.freeSessionSlotId.endTime)}` :
                                                "N/A"
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lead Status */}
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight mb-1">Lead Status</span>
                            <span className="text-sm font-semibold text-[var(--Main)]">{booking.leadStatus || "New Lead"}</span>
                        </div>
                        <Link
                            to={`/dash/booking/${booking._id}`}
                            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-colors border border-gray-200"
                        >
                            View Full File
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsModal;
