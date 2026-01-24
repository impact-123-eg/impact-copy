import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import Nav from "../Components/dashboard/Nav";
import { AdminProvider } from "../AdminContext";
import { useDrawer } from "@/hooks/useDrawer";
import { HiMenu, HiX } from "react-icons/hi";

const DashLayout = () => {
  const location = useLocation();
  const { isDrawerOpen, isMobile, toggleDrawer, drawerProps, overlayProps } =
    useDrawer();

  useEffect(() => {
    document.documentElement.dir = location.pathname.includes("/dash")
      ? "ltr"
      : "";
  }, [location.pathname]);

  return (
    <I18nextProvider i18n={i18n}>
      <main className="flex h-screen w-full overflow-hidden">
        {/* Mobile menu button */}
        {isMobile && (
          <button
            className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[var(--Main)] text-white shadow-lg"
            onClick={toggleDrawer}
            aria-label="Toggle navigation menu"
          >
            {isDrawerOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        )}

        {/* Navigation drawer */}
        <div {...drawerProps}>
          <Nav />
        </div>

        {/* Overlay for mobile when nav is open */}
        {overlayProps && <div {...overlayProps} />}

        {/* Main content area */}
        <div
          className={`flex-1 flex flex-col overflow-hidden ${isMobile ? "pt-10" : ""
            }`}
        >
          <div className="flex-1 overflow-auto p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </I18nextProvider>
  );
};

export default DashLayout;
