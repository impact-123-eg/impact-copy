import { useState, useEffect } from "react";

export const useDrawer = (defaultOpen = false) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typically md breakpoint
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);
  const toggleDrawer = () => setIsOpen((prev) => !prev);

  // Close drawer when route changes
  useEffect(() => {
    closeDrawer();
  }, [window.location.pathname]); // You might need to adjust this based on your router

  return {
    isDrawerOpen: isOpen,
    isMobile,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    drawerProps: {
      className: `fixed md:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`,
    },
    overlayProps:
      isOpen && isMobile
        ? {
            className: "fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden",
            onClick: closeDrawer,
          }
        : null,
  };
};
