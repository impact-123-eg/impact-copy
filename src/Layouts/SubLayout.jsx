import React, { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Footer from '../Components/Footer';
import { TranslationProvider } from '../TranslationContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import logo from '../assets/logoblue.png';
import { FaWhatsapp } from 'react-icons/fa';
import { useTranslationContext } from '../TranslationContext';

const SubLayout = () => {
    useEffect( ()=> {
        document.documentElement.dir = i18n.language === 'en' ? 'ltr' : 'rtl';
      },[])
    
 return (
  <main className="w-full overflow-x-hidden">
   <I18nextProvider i18n={i18n}>
    <TranslationProvider>
     <Link to="">
      <img src={logo} data-aos="fade-down" data-aos-duration="5000" className=" h-12 my-12 md:px-40 px-4" alt="Logo" />
     </Link>
     <Link to='https://wa.me/+201091085271' target='_blank' className="fixed bottom-5 right-5 lg:bottom-10 lg:right-10 bg-[#25D366] text-white p-4 rounded-full text-5xl z-50">
      <FaWhatsapp />
     </Link>
     <Outlet />
     <Footer />
    </TranslationProvider>
   </I18nextProvider>
  </main>
 );
};

export default SubLayout;