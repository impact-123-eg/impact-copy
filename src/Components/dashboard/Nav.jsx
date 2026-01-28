import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/Logo White 1.png";
import { RxCalendar, RxDashboard, RxCaretDown, RxCaretRight, RxHamburgerMenu } from "react-icons/rx";
import { GiPapers } from "react-icons/gi";
import { CiSettings } from "react-icons/ci";
import { MdOutlineLogout, MdPersonOutline, MdHome, MdClose } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import ConfirmModal from "../ConfirmModal";
import { HiUserGroup, HiCalendarDays, HiClipboardDocumentList, HiBookOpen, HiAcademicCap, HiCurrencyDollar, HiTrendingUp } from "react-icons/hi2";

function Nav() {
  const location = useLocation();
  const { user, handleLogout } = useAuth();
  const isAdmin = user?.role === "admin";
  const isTeamLeader = user?.role === "team_leader";
  const isSales = user?.role === "sales";
  const isInstructor = user?.role === "instructor";
  const isSeo = user?.role === "seo";
  const [modalOpen, setModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // State for expanded parent items
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (name) => {
    setExpandedItems(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const menuItems = [
    (isAdmin || isTeamLeader) && {
      name: "Dashboard",
      icon: <RxDashboard size={18} />,
      path: "/dash/",
    },
    // Academic Section
    (isAdmin || isInstructor) && {
      name: "Academic",
      icon: <HiAcademicCap size={18} />,
      children: [
        isInstructor && { name: "My Groups", icon: <HiUserGroup size={16} />, path: "/dash/groups" },
        isInstructor && { name: "Assignments", icon: <HiClipboardDocumentList size={16} />, path: "/dash/pending-assignments" },
        isAdmin && { name: "Courses", icon: <HiBookOpen size={16} />, path: "/dash/courses" },
        (isAdmin || isTeamLeader || isSales) && { name: "Free Tests", icon: <HiClipboardDocumentList size={16} />, path: "/dash/free-tests" },
        isAdmin && { name: "Free Sessions", icon: <HiCalendarDays size={16} />, path: "/dash/free-sessions" },
      ].filter(Boolean)
    },
    // Management Section
    (isAdmin || isTeamLeader || isSales) && {
      name: "Management",
      icon: <RxCalendar size={18} />,
      children: [
        { name: "Booking", icon: <HiCalendarDays size={16} />, path: "/dash/booking" },
        isAdmin && { name: "Groups", icon: <HiUserGroup size={16} />, path: "/dash/groups" },
        isAdmin && { name: "Students", icon: <MdPersonOutline size={16} />, path: "/dash/users" },
        isAdmin && { name: "Payments", icon: <RxCalendar size={16} />, path: "/dash/payment" },
        isAdmin && { name: "Affiliate", icon: <HiClipboardDocumentList size={16} />, path: "/dash/affiliate-settings" },
      ].filter(Boolean)
    },
    // Content Section
    (isAdmin || isSeo) && {
      name: "Content",
      icon: <GiPapers size={18} />,
      children: [{ name: "Pages", icon: <GiPapers size={16} />, path: "/dash/pages" }]
    },
    // Finance Section
    isAdmin && {
      name: "Finance",
      icon: <HiCurrencyDollar size={18} />,
      children: [
        { name: "Revenues", icon: <HiTrendingUp size={16} />, path: "/dash/finance/revenues" },
        { name: "Expenses", icon: <HiTrendingUp size={16} />, path: "/dash/finance/expenses" },
        { name: "Payroll", icon: <HiCurrencyDollar size={16} />, path: "/dash/finance/payroll" },
      ]
    },
    // Settings
    isAdmin && {
      name: "Settings",
      icon: <CiSettings size={18} />,
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
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-[var(--Main)] text-white p-2 rounded-lg shadow-lg"
      >
        {isMobileOpen ? <MdClose size={24} /> : <RxHamburgerMenu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <nav className={`
        fixed lg:sticky top-0 left-0 h-screen bg-[var(--Main)] flex flex-col z-40 transition-all duration-300
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isCollapsed ? "w-16" : "w-56"}
      `}>
        {/* Header */}
        <div className="p-3 flex items-center justify-between border-b border-white/10">
          {!isCollapsed && (
            <Link to="/dash" className="flex items-center gap-2">
              <img src={logo} className="w-24" alt="Logo" />
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex text-white/70 hover:text-white p-1 rounded hover:bg-white/10"
          >
            {isCollapsed ? <RxCalendar size={20} /> : <RxCaretDown size={20} />}
          </button>
        </div>

        {/* User Profile - Minimal */}
        {!isCollapsed && (
          <div className="flex items-center gap-2 text-white px-3 py-3 border-b border-white/10">
            <div className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-full shrink-0">
              <MdPersonOutline size={16} />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-xs font-semibold truncate">{user?.name?.split(" ")[0]}</h1>
              <p className="text-[10px] text-[var(--Yellow)] capitalize">{user?.role}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <section className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
          {/* Back to Home */}
          <Link
            to="/"
            className={`
              flex items-center gap-2 rounded-lg py-2 px-2 transition-all text-white/70 hover:text-white hover:bg-white/10
              ${isCollapsed ? "justify-center" : ""}
            `}
            title="Back to Home"
          >
            <MdHome size={18} />
            {!isCollapsed && <span className="text-xs">Home</span>}
          </Link>

          {menuItems.map((item) => {
            if (item.children && item.children.length > 0) {
              const showChildren = expandedItems[item.name] || isParentActive(item.children);

              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className={`
                      w-full flex items-center gap-2 rounded-lg py-2 px-2 transition-all text-white/70 hover:text-white hover:bg-white/10
                      ${isCollapsed ? "justify-center" : ""}
                      ${showChildren ? "bg-white/5" : ""}
                    `}
                    title={isCollapsed ? item.name : ""}
                  >
                    <span className="text-white/80">{item.icon}</span>
                    {!isCollapsed && <span className="text-xs">{item.name}</span>}
                    {!isCollapsed && (
                      <span className="ml-auto">
                        {showChildren ? <RxCaretDown size={14} /> : <RxCaretRight size={14} />}
                      </span>
                    )}
                  </button>

                  {showChildren && !isCollapsed && (
                    <div className="pl-6 pr-2 mt-1 space-y-0.5">
                      {item.children.map(child => (
                        <Link
                          key={child.name}
                          to={child.path}
                          className={`
                            flex items-center gap-2 rounded-lg py-1.5 px-2 transition-all text-xs
                            ${isActive(child.path)
                              ? "bg-white text-[var(--Main)] font-semibold"
                              : "text-white/60 hover:text-white hover:bg-white/10"
                            }
                          `}
                        >
                          {child.icon}
                          <span className="truncate">{child.name}</span>
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
                className={`
                  flex items-center gap-2 rounded-lg py-2 px-2 transition-all
                  ${isActive(item.path)
                    ? "bg-white text-[var(--Main)] font-medium"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
                title={isCollapsed ? item.name : ""}
              >
                <span className={isActive(item.path) ? "text-[var(--Main)]" : "text-white/80"}>
                  {item.icon}
                </span>
                {!isCollapsed && <span className="text-xs">{item.name}</span>}
              </Link>
            );
          })}
        </section>

        {/* Logout */}
        <div className="p-2 border-t border-white/10">
          <button
            onClick={() => setModalOpen(true)}
            className={`
              flex items-center gap-2 text-[var(--Yellow)] rounded-lg py-2 px-2 hover:bg-white/5 transition-all w-full
              ${isCollapsed ? "justify-center" : ""}
            `}
            title="Logout"
          >
            <MdOutlineLogout size={18} />
            {!isCollapsed && <span className="text-xs font-medium">Logout</span>}
          </button>
        </div>
      </nav>

      {/* Logout Modal */}
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
    </>
  );
}

export default Nav;
