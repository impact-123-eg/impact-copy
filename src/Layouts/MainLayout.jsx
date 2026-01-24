import React from "react";
import { Outlet, Link } from "react-router-dom";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

import { FaWhatsapp } from "react-icons/fa";
import { useI18n } from "../hooks/useI18n";

const MainLayout = () => {
  const { initialize, localizePath } = useI18n();

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  // const [error, setError] = useState(null);
  return (
    <main className="overflow-x-hidden">
      <NavBar />
      <Link
        to="https://wa.me/+201091085271"
        target="_blank"
        className="fixed bottom-5 right-5 lg:bottom-10 lg:right-10 bg-[#25D366] text-white p-4 rounded-full text-3xl md:text-4xl z-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Contact us on WhatsApp"
      >
        <FaWhatsapp />
      </Link>
      <Outlet />
      <Footer />
    </main>
  );
};

export default MainLayout;
