// import React from 'react';
// import { Link, Outlet } from 'react-router-dom';
// import Footer from '../Components/Footer';
// import { I18nextProvider } from 'react-i18next';
// import i18n from '../i18n';
// import logo from '../assets/logoblue.png';
// import { AdminProvider } from '../AdminContext';

// const LoginLayout = () => {
//  return (
//   <main className="w-full overflow-x-hidden">
//    <I18nextProvider i18n={i18n}>
//     <AdminProvider>
//      <Link to="">
//      <img src={logo} data-aos="fade-down" data-aos-duration="5000" className="w-[35%] h-12 my-12 md:px-40 px-4" alt="Logo" />
//      </Link>
//      <Outlet />
//      <Footer />
//     </AdminProvider>
//    </I18nextProvider>
//   </main>
//  );
// };

// export default LoginLayout;

import React from "react";
import { Link, Outlet } from "react-router-dom";
import Footer from "../Components/Footer";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import logo from "../assets/logoblue.png";
import { AdminProvider } from "../AdminContext";
import { useI18n } from "../hooks/useI18n";

const LoginLayout = () => {
  const { localizePath } = useI18n();
  return (
    <main className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <I18nextProvider i18n={i18n}>
        <AdminProvider>
          {/* Header with logo */}
          <header className="flex justify-center items-center !pb-1 px-4 sm:py-10">
            <Link to={localizePath("/")} className="flex justify-center">
              <img
                src={logo}
                data-aos="fade-down"
                data-aos-duration="5000"
                className="w-48 max-w-[50%] h-auto object-contain"
                alt="Company Logo"
              />
            </Link>
          </header>

          {/* Main content area */}
          <div className="flex-1 flex items-center justify-center !py-0 px-4 sm:px-6 w-full">
            <div className="w-full max-w-4xl">
              <Outlet />
            </div>
          </div>

          {/* Footer */}
          <Footer />
        </AdminProvider>
      </I18nextProvider>
    </main>
  );
};

export default LoginLayout;
