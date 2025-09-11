import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/Logo White 1.png";
import { RxCalendar, RxDashboard } from "react-icons/rx";
import { GiPapers, GiWallet } from "react-icons/gi";
import { CiSettings } from "react-icons/ci";
import { BiSolidTime } from "react-icons/bi";
import { MdOutlineLogout } from "react-icons/md";
import { PiBooksBold } from "react-icons/pi";
import { MdPersonOutline } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";

function Nav() {
  const location = useLocation();
  const { user, handleLogout } = useAuth();
  const isAdmin = user?.role === "admin";

  const menuItems = [
    isAdmin && {
      name: "Dashboard",
      icon: <RxDashboard size={24} />,
      path: "/dash/",
    },
    {
      name: "Availabilities",
      icon: <BiSolidTime size={24} />,
      path: "/dash/availabilities",
    },
    {
      name: "Student Booking",
      icon: <RxCalendar size={24} />,
      path: "/dash/booking",
    },
    isAdmin && {
      name: "Courses & Plans",
      icon: <PiBooksBold size={24} />,
      path: "/dash/courses",
    },
    { name: "Requests", icon: <GiPapers size={24} />, path: "/dash/requests" },
    isAdmin && {
      name: "Payment",
      icon: <GiWallet size={24} />,
      path: "/dash/payment",
    },
    isAdmin && {
      name: "Settings",
      icon: <CiSettings size={24} />,
      path: "/dash/settings",
    },
  ].filter(Boolean); // Filter out any false values

  const isActive = (itemPath) => {
    if (itemPath === "/dash/") {
      return location.pathname === itemPath;
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <nav className="bg-[var(--Main)] flex flex-col h-full py-8 px-6">
      {/* Logo */}
      <div className="mb-12 px-2">
        <img src={logo} className="w-40" alt="Logo" />
      </div>

      {/* User Profile Section */}
      <section className="flex items-center gap-4 text-white mb-10 px-2">
        <div className="flex items-center justify-center w-16 h-16 bg-white/10 rounded-full">
          <MdPersonOutline size={32} />
        </div>
        <div>
          <h1 className="text-xl font-semibold truncate max-w-[140px]">
            {user?.name}
          </h1>
          <p className="text-md text-[var(--Yellow)] capitalize">
            {user?.role}
          </p>
        </div>
      </section>

      {/* Navigation Menu */}
      <section className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={() => window.scroll(0, 0)}
            className={`flex items-center gap-4 text-lg rounded-xl py-3 px-4 transition-all duration-200 ${
              isActive(item.path)
                ? "bg-white text-[var(--Main)] shadow-md"
                : "text-white hover:bg-white/10"
            }`}
          >
            <span
              className={`${
                isActive(item.path) ? "text-[var(--Main)]" : "text-white"
              }`}
            >
              {item.icon}
            </span>
            <p className="font-medium">{item.name}</p>
          </Link>
        ))}
      </section>

      {/* Logout Button */}
      <div className="mt-auto pt-6 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 text-[var(--Yellow)] text-lg font-semibold w-full py-3 px-4 rounded-xl hover:bg-white/5 transition-colors duration-200"
        >
          <MdOutlineLogout size={24} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Nav;
