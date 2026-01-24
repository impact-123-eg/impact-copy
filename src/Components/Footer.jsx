import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo White 1.png";
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { useI18n } from "../hooks/useI18n";

const Footer = () => {
  const { t, currentLocale, localizePath } = useI18n();
  const navigate = useNavigate();

  return (
    <footer
      className={`grid grid-cols-1 lg:grid-cols-2 p-10 lg:p-20 lg:px-40 text-white bg-gradient-to-r from-[var(--GradBg)] to-[var(--Main)] mt-12 ${currentLocale === "ar" ? "rtl" : ""
        }`}
    >
      <section
        data-aos="fade-right"
        data-aos-duration="1000"
        className="space-y-6"
      >
        <img src={logo} className="w-40 lg:w-60" alt="Logo" />

        <h1 className="font-bold text-2xl">{t("footer", "AboutUs", "About Us")}</h1>

        <p className="md:text-md">{t("footer", "footerDescription")}</p>
      </section>

      <article
        data-aos="fade-left"
        data-aos-duration="1000"
        className="flex justify-evenly space-x-10 lg:space-x-15 space-y-5 lg:space-y-0 flex-row mt-10 lg:mt-0"
      >
        <section className="text-center space-y-4">
          <h1 className="underline font-bold text-xl">{t("footer", "quickLinks", "Quick Links")}</h1>

          <ul className="space-y-2 md:space-y-4 text-sm md:text-lg">
            <li>
              <Link onClick={() => window.scroll(0, 0)} to={localizePath("/")}>
                {t("footer", "Home", "Home")}
              </Link>
            </li>
            <li>
              <Link onClick={() => window.scroll(0, 0)} to={localizePath("/courses")}>
                {t("footer", "Courses", "Courses")}
              </Link>
            </li>
            <li>
              <Link onClick={() => window.scroll(0, 0)} to={localizePath("/about")}>
                {t("footer", "AboutUs", "About Us")}
              </Link>
            </li>
          </ul>
        </section>

        <section className="text-center space-y-6">
          <h1 className="underline font-bold text-xl">{t("footer", "followUs", "Follow Us")}</h1>

          <ul className="flex justify-center space-x-3 lg:space-x-6 text-xl md:text-2xl">
            <Link
              className="lg:ml-6"
              to="https://www.instagram.com/impactenglishcourses"
            >
              <FaInstagram />
            </Link>
            <Link to="https://www.facebook.com/impactenglishcourses">
              <FaFacebook />
            </Link>
            <Link to="https://www.tiktok.com/@impactacademy1">
              <FaTiktok />
            </Link>
            <a href="mailto:impactenglishcourses@gmail.com">
              <IoMdMail />
            </a>
          </ul>

          <div className="text-center space-y-3 lg:space-y-6">
            <h1 className="underline font-bold text-xl">{t("footer", "contactUs", "Contact Us")}</h1>
            <div className="flex gap-x-2 items-center justify-center text-lg md:text-xl my-2">
              <FaWhatsapp className="" />
              <a href="tel:+201091085271" target="_blank">
                01091085271
              </a>
            </div>
          </div>
        </section>
      </article>

      <article
        data-aos="fade-right"
        data-aos-duration="1000"
        className="space-y-4 mt-12 text-md"
      >
        <div className=" cursor-pointer flex gap-2">
          <span
            onClick={() => navigate(localizePath("/privacy-policy"))}
            className="border-b-2"
          >
            {t("footer", "privacyPolicy", "Privacy Policy")}
          </span>{" "}
          |
          <span
            onClick={() => navigate(localizePath("/refund-policy"))}
            className="border-b-2"
          >
            {t("footer", "contentPolicy", "Refund Policy")}
          </span>{" "}
          |
          <span
            onClick={() => navigate(localizePath("/terms-of-use"))}
            className="border-b-2"
          >
            {t("footer", "termsOfUse", "Terms of Use")}
          </span>
        </div>
        <p className="my-3 flex gap-2">
          {t("footer", "designedBy", "Designed & Developed by:")}
          <a href="https://ABSai.dev" target="_blank" className=" underline">
            ABSai.dev
          </a>
          &
          <a
            href="https://www.linkedin.com/in/ahmed-assem-325116318/"
            target="_blank"
            className=" underline"
          >
            Ahmed Assem
          </a>
        </p>
        <p>{t("footer", "allRightsReserved", "All Rights Reserved @2025 impact.com")}</p>
      </article>
    </footer>
  );
};

export default Footer;
