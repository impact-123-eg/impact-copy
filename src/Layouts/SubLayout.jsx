import { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Footer from '../Components/Footer';
import { useI18n } from '../hooks/useI18n';
import logo from '../assets/logoblue.png';
import { FaWhatsapp } from 'react-icons/fa';

const SubLayout = () => {
  const { currentLocale, initialize, localizePath } = useI18n();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    document.documentElement.dir = currentLocale === 'ar' ? 'rtl' : 'ltr';
  }, [currentLocale]);

  return (
    <main className="w-full overflow-x-hidden">
      <Link to={localizePath("/")}>
        <img src={logo} data-aos="fade-down" data-aos-duration="5000" className=" h-12 my-12 md:px-40 px-4" alt="Logo" />
      </Link>
      <Link to='https://wa.me/+201091085271' target='_blank' className="fixed bottom-5 right-5 lg:bottom-10 lg:right-10 bg-[#25D366] text-white p-4 rounded-full text-5xl z-50">
        <FaWhatsapp />
      </Link>
      <Outlet />
      <Footer />
    </main>
  );
};

export default SubLayout;