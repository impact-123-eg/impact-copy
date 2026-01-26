import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/Logo White 1.png";
import logo2 from "../assets/logoblue.png";
import { useI18n } from "../hooks/useI18n";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEarth,
  faUserCircle,
  faChalkboardUser,
  faHome,
  faBookOpen,
  faInfoCircle,
  faRightToBracket,
  faUserPlus,
  faFlask,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { t, currentLocale, switchLanguage, localizePath } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const activeTab = "text-[var(--Yellow)] text-xs font-semibold";
  const tabStyle = "text-white text-xs hover:text-gray-200 transition-colors";
  const { isLoggedIn, user, handleLogout: authLogout } = useAuth();
  const nav = useNavigate();
  const handleNavigate = (to) => {
    nav(localizePath(to));
    setIsOpen(false);
  };

  const toggleLanguage = () => {
    const newLanguage = currentLocale === "en" ? "ar" : "en";
    switchLanguage(newLanguage);
  };

  useEffect(() => {
    document.documentElement.dir = currentLocale === "ar" ? "rtl" : "ltr";
  }, [currentLocale]);

  return (
    <nav className="relative lg:bg-[var(--Main)] w-full md:w-[850px] lg:w-[1050px] xl:w-[1200px] px-3 sm:px-4 lg:px-6 py-2 my-3 mx-auto rounded-none md:rounded-full">
      <div className="h-full w-full flex justify-between items-center">
        {/* Logo */}
        <div className="hidden lg:flex items-center">
          <NavLink to={localizePath("/")}>
            <img src={logo} alt="logo" className="h-7 w-auto object-contain flex-shrink-0" />
          </NavLink>
        </div>
        <div className="lg:hidden flex items-center">
          <NavLink to={localizePath("/")}>
            <img src={logo2} alt="logo" className="h-7 w-auto object-contain flex-shrink-0" />
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[var(--Main)] focus:outline-none p-1"
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center justify-between w-full">
          <div className="flex gap-x-5 whitespace-nowrap w-full justify-center items-center">
            <NavLink
              to={localizePath("/")}
              className={({ isActive }) => (isActive ? activeTab : tabStyle)}
              end
            >
              {/* <FontAwesomeIcon icon={faHome} className="mr-1" /> */}
              {t("navbar", "Home", "Home")}
            </NavLink>
            <NavLink
              to={localizePath("/courses")}
              className={({ isActive }) => (isActive ? activeTab : tabStyle)}
            >
              {/* <FontAwesomeIcon icon={faBookOpen} className="mr-1" /> */}
              {t("navbar", "Courses", "Courses")}
            </NavLink>
            <NavLink
              to={localizePath("/about")}
              className={({ isActive }) => (isActive ? activeTab : tabStyle)}
            >
              {/* <FontAwesomeIcon icon={faInfoCircle} className="mr-1" /> */}
              {t("navbar", "AboutUs", "About")}
            </NavLink>
          </div>

          <div className="flex gap-1.5 items-center space-x-2 lg:space-x-3 ms-4 lg:ms-8 whitespace-nowrap">
            <button
              onClick={() => handleNavigate("/free-test")}
              className={`border border-white text-white px-2.5 py-1.5 rounded-full hover:brightness-95 transition text-xs flex items-center gap-1`}
            >
              <FontAwesomeIcon icon={faFlask} />
              {t("navbar", "BookFreeTest", "Test")}
            </button>
            <button
              onClick={() => handleNavigate("/free-session")}
              className={`bg-white px-2.5 py-1.5 rounded-full hover:bg-gray-100 text-xs text-[var(--Main)] flex items-center gap-1`}
            >
              <FontAwesomeIcon icon={faCalendarCheck} />
              {t("navbar", "BookFree", "Session")}
            </button>
            <button
              onClick={toggleLanguage}
              className="flex cursor-pointer text-white items-center justify-center w-7 h-7 rounded-full hover:bg-white/10 transition"
              title={currentLocale === "en" ? "Switch to Arabic" : "Switch to English"}
            >
              <FontAwesomeIcon icon={faEarth} className="text-xs" />
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2 ml-2">
                {user?.role === "student" ? (
                  <NavLink
                    to={localizePath("/profile")}
                    className={({ isActive }) => (isActive ? activeTab : tabStyle)}
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="text-sm" />
                  </NavLink>
                ) : (
                  <NavLink
                    to="/dash"
                    className={({ isActive }) => (isActive ? activeTab : tabStyle)}
                  >
                    <FontAwesomeIcon icon={faChalkboardUser} className="text-sm" />
                  </NavLink>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <NavLink
                  to={localizePath("/login")}
                  className={({ isActive }) => (isActive ? activeTab : tabStyle)}
                  title={t("login", "Login")}
                >
                  <FontAwesomeIcon icon={faRightToBracket} className="text-sm" />
                </NavLink>
                <NavLink
                  to={localizePath("/register")}
                  className="bg-[var(--Yellow)] text-[var(--Main)] w-6 h-6 rounded-full flex items-center justify-center hover:brightness-110 transition"
                  title={t("register", "Register")}
                >
                  <FontAwesomeIcon icon={faUserPlus} className="text-xs" />
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className={`fixed z-50 top-0 ${currentLocale === "ar" ? "left-0" : "right-0"
              } h-full w-64 max-w-[80vw] bg-white shadow-xl transition-transform duration-200 ease-out`}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center">
                <img src={logo2} alt="logo" className="h-6 w-auto object-contain flex-shrink-0" />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="text-[var(--Main)] p-1.5 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-3 space-y-1.5">
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center justify-center gap-2 text-[var(--Main)] py-2 px-3 border rounded-lg text-xs"
              >
                <FontAwesomeIcon icon={faEarth} />
                {currentLocale === "en" ? (
                  <span>{t("navbar", "Arabic", "العربية")}</span>
                ) : (
                  <span>{t("navbar", "English", "English")}</span>
                )}
              </button>
              <NavLink
                to={localizePath("/")}
                onClick={() => setIsOpen(false)}
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg py-2 px-3 text-xs ${isActive
                    ? "bg-[var(--Main)]/10 text-[var(--Main)] font-semibold"
                    : "text-[var(--Main)] hover:bg-gray-50"
                  }`
                }
              >
                <FontAwesomeIcon icon={faHome} />
                {t("navbar", "Home", "Home")}
              </NavLink>
              <NavLink
                to={localizePath("/courses")}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg py-2 px-3 text-xs ${isActive
                    ? "bg-[var(--Main)]/10 text-[var(--Main)] font-semibold"
                    : "text-[var(--Main)] hover:bg-gray-50"
                  }`
                }
              >
                <FontAwesomeIcon icon={faBookOpen} />
                {t("navbar", "Courses", "Courses")}
              </NavLink>
              <NavLink
                to={localizePath("/about")}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg py-2 px-3 text-xs ${isActive
                    ? "bg-[var(--Main)]/10 text-[var(--Main)] font-semibold"
                    : "text-[var(--Main)] hover:bg-gray-50"
                  }`
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                {t("navbar", "AboutUs", "About")}
              </NavLink>
              <button
                onClick={() => handleNavigate("/free-test")}
                className="w-full flex items-center justify-center gap-2 bg-[var(--Yellow)] text-[var(--Main)] py-2 px-3 rounded-lg font-semibold hover:brightness-95 text-xs"
              >
                <FontAwesomeIcon icon={faFlask} />
                {t("navbar", "FreeTest", "Free Test")}
              </button>
              <button
                onClick={() => handleNavigate("/free-session")}
                className="w-full flex items-center justify-center gap-2 bg-white text-[var(--Main)] py-2 px-3 rounded-lg border hover:bg-gray-50 text-xs"
              >
                <FontAwesomeIcon icon={faCalendarCheck} />
                {t("navbar", "BookFree", "Book Session")}
              </button>

              {/* Auth Section for Mobile */}
              {isLoggedIn ? (
                <>
                  {user?.role === "student" ? (
                    <NavLink
                      to={localizePath("/profile")}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-lg py-2 px-3 text-xs ${isActive
                          ? "bg-[var(--Main)]/10 text-[var(--Main)] font-semibold"
                          : "text-[var(--Main)] hover:bg-gray-50"
                        }`
                      }
                    >
                      <FontAwesomeIcon icon={faUserCircle} />
                      {user?.name?.split(" ")[0]}
                    </NavLink>
                  ) : (
                    <NavLink
                      to="/dash"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 rounded-lg py-2 px-3 text-xs bg-[var(--Main)]/10 text-[var(--Main)] font-semibold"
                    >
                      <FontAwesomeIcon icon={faChalkboardUser} />
                      Dashboard
                    </NavLink>
                  )}
                  <button
                    onClick={authLogout}
                    className="w-full flex items-center gap-2 rounded-lg py-2 px-3 text-xs text-red-500 hover:bg-gray-50"
                  >
                    <FontAwesomeIcon icon={faRightToBracket} />
                    {t("logout", "Logout")}
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <NavLink
                    to={localizePath("/login")}
                    onClick={() => setIsOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2 px-3 text-xs text-[var(--Main)] border hover:bg-gray-50"
                  >
                    <FontAwesomeIcon icon={faRightToBracket} />
                    {t("login", "Login")}
                  </NavLink>
                  <NavLink
                    to={localizePath("/register")}
                    onClick={() => setIsOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[var(--Yellow)] text-[var(--Main)] rounded-lg py-2 px-3 text-xs font-semibold hover:brightness-95"
                  >
                    <FontAwesomeIcon icon={faUserPlus} />
                    {t("register", "Register")}
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
