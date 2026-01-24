import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/Logo White 1.png";
import logo2 from "../assets/logoblue.png";
import { useI18n } from "../hooks/useI18n";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarth } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const { t, currentLocale, switchLanguage, localizePath } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const activeTab = "text-[var(--Yellow)] text-sm md:text-xl font-bold";
  const tabStyle = "text-white text-sm md:text-xl hover:text-gray-200";
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
    <nav className="relative lg:bg-[var(--Main)] w-full md:w-[850px] lg:w-[1050px] xl:w-[1400px] px-4 sm:px-6 lg:px-8 py-4 my-5 mx-auto rounded-none md:rounded-full">
      <div className="h-full w-full flex justify-between items-center">
        {/* Logo */}
        <div className="hidden lg:flex items-center">
          <NavLink to={localizePath("/")}>
            <img src={logo} alt="logo" className="h-10 w-auto object-contain flex-shrink-0" />
          </NavLink>
        </div>
        <div className="lg:hidden flex items-center">
          <NavLink to={localizePath("/")}>
            <img src={logo2} alt="logo" className="h-10 w-auto object-contain flex-shrink-0" />
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[var(--Main)] focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
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
        <div className="hidden lg:flex items-center">
          <div className="flex gap-x-8 whitespace-nowrap">
            <NavLink
              to={localizePath("/")}
              className={({ isActive }) => (isActive ? activeTab : tabStyle)}
              end
            >
              {t("navbar", "Home", "Home")}
            </NavLink>
            <NavLink
              to={localizePath("/courses")}
              className={({ isActive }) => (isActive ? activeTab : tabStyle)}
            >
              {t("navbar", "Courses", "Courses")}
            </NavLink>
            <NavLink
              to={localizePath("/about")}
              className={({ isActive }) => (isActive ? activeTab : tabStyle)}
            >
              {t("navbar", "AboutUs", "About Us")}
            </NavLink>
          </div>

          <div className="flex gap-2 items-center space-x-4 lg:space-x-6 ms-7 lg:ms-20 whitespace-nowrap">
            <button
              onClick={() => handleNavigate("/free-test")}
              className={`border border-white text-white px-4 py-2 rounded-3xl hover:brightness-95 transition`}
            >
              {t("navbar", "BookFreeTest", "Book Free Test")}
            </button>
            <button
              onClick={() => handleNavigate("/free-session")}
              className={`bg-white p-3 rounded-3xl hover:bg-gray-100 mx-4`}
            >
              {t("navbar", "BookFree", "Book Free Session")}
            </button>
            <div
              onClick={toggleLanguage}
              className="flex cursor-pointer mx-4 text-white items-center space-x-2"
            >
              <FontAwesomeIcon icon={faEarth} />
              {currentLocale === "en" ? (
                <span className=" mx-2">{t("navbar", "Arabic", "Arabic")}</span>
              ) : (
                <span>{t("navbar", "English", "English")}</span>
              )}
            </div>
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
              } h-full w-72 max-w-[85vw] bg-white shadow-xl transition-transform duration-200 ease-out`}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <img src={logo2} alt="logo" className="h-8 w-auto object-contain flex-shrink-0" />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="text-[var(--Main)] p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-5 h-5"
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
            <div className="p-4 space-y-3">
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center justify-center gap-2 text-[var(--Main)] py-2 px-3 border rounded-xl"
              >
                <FontAwesomeIcon icon={faEarth} />
                {currentLocale === "en" ? (
                  <span>{t("navbar", "Arabic", "Arabic")}</span>
                ) : (
                  <span>{t("navbar", "English", "English")}</span>
                )}
              </button>
              <NavLink
                to={localizePath("/")}
                onClick={() => setIsOpen(false)}
                end
                className={({ isActive }) =>
                  `block rounded-xl py-3 px-4 text-base ${isActive
                    ? "bg-[var(--Main)]/10 text-[var(--Main)] font-semibold"
                    : "text-[var(--Main)] hover:bg-gray-100"
                  }`
                }
              >
                {t("navbar", "Home", "Home")}
              </NavLink>
              <NavLink
                to={localizePath("/courses")}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block rounded-xl py-3 px-4 text-base ${isActive
                    ? "bg-[var(--Main)]/10 text-[var(--Main)] font-semibold"
                    : "text-[var(--Main)] hover:bg-gray-100"
                  }`
                }
              >
                {t("navbar", "Courses", "Courses")}
              </NavLink>
              <NavLink
                to={localizePath("/about")}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block rounded-xl py-3 px-4 text-base ${isActive
                    ? "bg-[var(--Main)]/10 text-[var(--Main)] font-semibold"
                    : "text-[var(--Main)] hover:bg-gray-100"
                  }`
                }
              >
                {t("navbar", "AboutUs", "About Us")}
              </NavLink>
              <button
                onClick={() => handleNavigate("/free-test")}
                className="w-full bg-[var(--Yellow)] text-[var(--Main)] py-3 px-4 rounded-2xl font-semibold hover:brightness-95"
              >
                {t("navbar", "FreeTest", "Free Test")}
              </button>
              <button
                onClick={() => handleNavigate("/free-session")}
                className="w-full bg-white text-[var(--Main)] py-3 px-4 rounded-2xl border hover:bg-gray-50"
              >
                {t("navbar", "BookFree", "Book Free Session")}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
