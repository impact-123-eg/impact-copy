import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/Logo White 1.png';
import logo2 from '../assets/logoblue.png';
import { useTranslationContext } from '../TranslationContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarth } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const { t, i18n, changeLanguage } = useTranslationContext();
  const [isOpen, setIsOpen] = useState(false);
  const activeTab = "text-[var(--Yellow)] text-sm md:text-xl font-bold";
  const tabStyle = "text-white text-sm md:text-xl hover:text-gray-200";
  const nav = useNavigate();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'ar' : 'en';
    changeLanguage(newLanguage);
    localStorage.setItem("lang",newLanguage);
    document.documentElement.dir = i18n.language === 'en' ? 'ltr' : 'rtl';
  };
  useEffect( ()=> {
    document.documentElement.dir = i18n.language === 'en' ? 'ltr' : 'rtl';
    const lang = localStorage.getItem("lang");
    changeLanguage(lang);
  },[])
  return (
    <nav className="md:bg-[var(--Main)] w-full md:w-[850px] lg:w-[1050px] px-4 sm:px-6 lg:px-8 py-4 my-5 mx-auto rounded-none md:rounded-full">
      <div className="h-full w-full flex justify-between items-center">
        {/* Logo */}
        <div className="hidden md:flex items-center">
          <NavLink to="/">
            <img src={logo} alt="logo" className="h-10" />
          </NavLink>
        </div>
        <div className="md:hidden flex items-center">
          <NavLink to="/">
            <img src={logo2} alt="logo" className="h-10" />
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-[var(--Main)] focus:outline-none" aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center">
          <div className="flex gap-x-8 xl:gap-x-12">
            <NavLink to="/" className={({ isActive }) => isActive ? activeTab : tabStyle}>
              {t('Home')}
            </NavLink>
            <NavLink to="/courses" className={({ isActive }) => isActive ? activeTab : tabStyle}>
              {t('Courses')}
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? activeTab : tabStyle}>
              {t('AboutUs')}
            </NavLink>
          </div>

          <div className="flex items-center space-x-8 ms-7 lg:ms-20 xl:ms-28">
            <button onClick={() => nav('/bookTest', { state: { option: "Free Test" } })}
              className={`bg-white p-3 rounded-3xl hover:bg-gray-100 mx-4`}>
              {t('BookFree')}
            </button>
            <div onClick={toggleLanguage} className="flex cursor-pointer mx-4 text-white items-center space-x-2">
              <FontAwesomeIcon icon={faEarth} />
              {i18n.language === 'en' ? <span className=' mx-2'>{t('Arabic')}</span> : <span>{t('English')}</span>}
            </div>
          </div>
        </div>
      </div>


      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 text-center sm:px-3">
            <div onClick={toggleLanguage} className="flex justify-center cursor-pointer text-[var(--Main)] items-center space-x-2">
              <FontAwesomeIcon icon={faEarth} />
              {i18n.language === 'en' ? <span>{t('Arabic')}</span> : <span>{t('English')}</span>}
            </div>
            <NavLink to="/" className={({ isActive }) => isActive ? "text-[var(--Yellow)] font-bold block" : "text-[var(--Main)] block"}>
              {t('Home')}
            </NavLink>
            <NavLink to="/courses" className={({ isActive }) => isActive ? "text-[var(--Yellow)] font-bold block" : "text-[var(--Main)] block"}>
              {t('Courses')}
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? "text-[var(--Yellow)] font-bold block" : "text-[var(--Main)] block"}>
              {t('AboutUs')}
            </NavLink>
            <NavLink to="/bookTest" state={{ option: "Free Test" }} className="text-[var(--Main)] block">
              {t('BookFree')}
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;