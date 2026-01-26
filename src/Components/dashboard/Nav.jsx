import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/Logo White 1.png";
import { RxCalendar, RxDashboard, RxCaretDown, RxCaretRight } from "react-icons/rx";
import { GiPapers, GiWallet } from "react-icons/gi";
import { CiSettings } from "react-icons/ci";
import { BiSolidTime } from "react-icons/bi";
import { MdOutlineLogout, MdPersonOutline } from "react-icons/md";
import { PiBooksBold } from "react-icons/pi";
import { useAuth } from "@/context/AuthContext";
import ConfirmModal from "../ConfirmModal";
import { FaFileInvoice, FaChalkboardTeacher } from "react-icons/fa";

function Nav() {
  const location = useLocation();
  const { user, handleLogout } = useAuth();
  const isAdmin = user?.role === "admin";
  const isTeamLeader = user?.role === "team_leader";
  const isSales = user?.role === "sales";
  const isInstructor = user?.role === "instructor";
  const isSeo = user?.role === "seo";
  const [modalOpen, setModalOpen] = useState(false);

  // State for expanded parent items
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (name) => {
    setExpandedItems(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const menuItems = [
    (isAdmin || isTeamLeader) && {
      name: "Dashboard",
      icon: <RxDashboard size={20} />,
      path: "/dash/",
    },
    // Academic Section (Admin/Instructor)
    (isAdmin || isInstructor) && {
      name: "Academic",
      icon: <FaChalkboardTeacher size={20} />,
      children: [
        isInstructor && {
          name: "My Groups",
          path: "/dash/groups",
        },
        isInstructor && {
          name: "Assignments",
          path: "/dash/pending-assignments",
        },
        isAdmin && {
          name: "Courses & Plans",
          path: "/dash/courses",
        },
        (isAdmin || isTeamLeader || isSales) && {
          name: "Free Tests",
          path: "/dash/free-tests",
        },
        isAdmin && {
          name: "Free Sessions",
          path: "/dash/free-sessions",
        },
      ].filter(Boolean)
    },
    // Management Section (Admin/TL/Sales)
    (isAdmin || isTeamLeader || isSales) && {
      name: "Management",
      icon: <RxCalendar size={20} />,
      children: [
        {
          name: "Student Booking",
          path: "/dash/booking",
        },
        isAdmin && {
          name: "Group Management",
          path: "/dash/groups",
        },
        isAdmin && {
          name: "Students",
          path: "/dash/users",
        },
        isAdmin && {
          name: "Bookings & Payments",
          path: "/dash/payment",
        },
      ].filter(Boolean)
    },
    (isAdmin || isSeo) && {
      name: "Content",
      icon: <GiPapers size={20} />,
      children: [
        {
          name: "Page Management",
          path: "/dash/pages",
        }
      ]
    },
    isAdmin && {
      name: "Settings",
      icon: <CiSettings size={20} />,
      path: "/dash/settings",
    },
  ].filter(Boolean);

  const isActive = (itemPath) => {
    if (!itemPath) return false;
    if (itemPath === "/dash/") {
      return location.pathname === itemPath;
    }
    return location.pathname.startsWith(itemPath);
  };

  const isParentActive = (children) => {
    return children.some(child => isActive(child.path));
  };

  return (
    <nav className="bg-[var(--Main)] flex flex-col h-full py-6 px-4 w-64">
      {/* Logo */}
      <Link to="/dash" className="mb-8 px-2 block">
        <img src={logo} className="w-32" alt="Logo" />
      </Link>

      {/* User Profile Section - Compact */}
      <section className="flex items-center gap-3 text-white mb-6 px-2 pb-6 border-b border-white/10">
        <div className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full shrink-0">
          <MdPersonOutline size={20} />
        </div>
        <div className="overflow-hidden">
          <h1 className="text-sm font-semibold truncate">
            {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-xs text-[var(--Yellow)] capitalize">
            {user?.role}
          </p>
        </div>
      </section>

      {/* Navigation Menu */}
      <section className="flex-1 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
        {menuItems.map((item) => {
          if (item.children && item.children.length > 0) {
            const isExpanded = expandedItems[item.name] || isParentActive(item.children); // Auto-expand if active child
            // Use local state override if user manually toggled, otherwise default to active state check?? 
            // Actually better to just use state, but maybe init state based on location? 
            // For now simple toggle.
            const showChildren = expandedItems[item.name] !== undefined ? expandedItems[item.name] : isParentActive(item.children);

            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => toggleExpand(item.name)}
                  className={`w-full flex items-center justify-between gap-3 text-sm font-medium rounded-lg py-2.5 px-3 transition-all duration-200 text-white hover:bg-white/10 ${showChildren ? 'bg-white/5' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white/80">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  {showChildren ? <RxCaretDown /> : <RxCaretRight />}
                </button>

                {showChildren && (
                  <div className="pl-4 space-y-1 animate-in slide-in-from-top-1 duration-200">
                    {item.children.map(child => (
                      <Link
                        key={child.name}
                        to={child.path}
                        className={`block text-xs font-medium rounded-lg py-2 px-3 transition-colors ${isActive(child.path)
                          ? "bg-white text-[var(--Main)] shadow-sm"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                          }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => window.scroll(0, 0)}
              className={`flex items-center gap-3 text-sm font-medium rounded-lg py-2.5 px-3 transition-all duration-200 ${isActive(item.path)
                ? "bg-white text-[var(--Main)] shadow-md"
                : "text-white hover:bg-white/10"
                }`}
            >
              <span
                className={`${isActive(item.path) ? "text-[var(--Main)]" : "text-white/80"
                  }`}
              >
                {item.icon}
              </span>
              <p>{item.name}</p>
            </Link>
          );
        })}
      </section>

      {/* Logout Button */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-3 text-[var(--Yellow)] text-sm font-semibold w-full py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors duration-200"
        >
          <MdOutlineLogout size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        description="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        icon="warning"
        confirmColor="red"
      />
    </nav>
  );
}

export default Nav;
