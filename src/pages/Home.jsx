import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../hooks/useI18n";
import { Toaster } from "react-hot-toast";

import photo from "../assets/student.png";
import students from "../assets/studentsgroup.png";
import offer from "../assets/offer.png";
import thinking from "../assets/thinking.png";
import { useLocation } from "react-router-dom";

import video from "../assets/video.mp4";

import { RiGlobeLine } from "react-icons/ri";
import {
  PiGraduationCapBold,
  PiBookBold,
  PiGlobeStandFill,
} from "react-icons/pi";
import { ImBooks } from "react-icons/im";
import { FaLaptop, FaMoneyBillWave } from "react-icons/fa";

import Bnfts from "../Components/Bnfts";
import Service from "../Components/Service";
import Course from "../Components/Course";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../data/firebaseConfig";
import { useGetAllcategories } from "@/hooks/Actions/categories/useCategoryCruds";
import SEO from "../Components/SEO";

function Home() {
  const { t, loadPageContent, initialize, loading, localizePath, currentLocale } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const { data: catData } = useGetAllcategories();
  const categories = catData?.data || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--Yellow)]"></div>
      </div>
    );
  }

  return (
    <main className="space-y-20">
      <SEO
        title={t("home-hero", "fluencyStartsHere1", "Fluency Starts") + " " + t("home-hero", "here", "Here")}
        description={t("home-hero", "learnFromInstructors", "Learn from the best instructors around the world.")}
        keywords="English learning, English courses, Impact platform, live English classes"
      />
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-12 md:px-[100px] px-10">
        <article
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="1000"
          className="container flex flex-col justify-center space-y-8"
        >
          <h1 className="text-2xl md:text-3xl lg:text-6xl font-bold">
            {t("home-hero", "fluencyStartsHere1", "Fluency Starts")}{" "}
            <span className="text-[var(--Yellow)]">
              {t("home-hero", "fluencyStartsHere2", "Here")}
            </span>{" "}
            {t("home-hero", "fluencyStartsHere3", "With Us")}
          </h1>
          <p className="text-sm md:text-xl">
            {t("home-hero", "learnFromInstructors", "Learn from the best instructors around the world.")}
          </p>

          <div className="flex items-center space-x-4 md:space-x-8 text-xl">
            <img src={students} alt="students" className="w-28 md:w-40" />
            <p className="text-xl md:text-3xl">
              {t("home-hero", "studentsCount", "50,000+ Students")}
            </p>
          </div>

          <div className="flex md:justify-between flex-col md:flex-row items-center gap-4 text-xs md:text-xl">
            <button
              onClick={() => {
                navigate(localizePath("/free-session"), {
                  state: { option: "Free Session" },
                });
                window.scroll(0, 0);
              }}
              className="p-4 sm:px-6 w-[150px] md:w-[250px] rounded-3xl bg-[var(--Yellow)]"
            >
              {t("home-hero", "bookFreeTrial", "Book Free Trial")}
            </button>
            <button
              onClick={() => {
                navigate(localizePath("/courses"));
                window.scroll(0, 0);
              }}
              className="p-4 sm:px-6 w-[150px] md:w-[250px] rounded-3xl border-2 border-[var(--Yellow)]"
            >
              {t("home-hero", "exploreCourses", "Explore Courses")}
            </button>
          </div>
        </article>

        <article
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="1000"
          className="container flex justify-center lg:justify-end"
        >
          <img className="w-full" src={photo} alt="student" />
        </article>
      </section>

      <section className="text-center space-y-4 md:px-[120px] px-10">
        <h1 className="text-2xl md:text-3xl font-bold">{t("home-journey", "ourJourney", "Our Journey, Your Future")}</h1>
        <div
          data-aos="fade-up"
          data-aos-duration="2500"
          data-aos-delay="400"
          className="flex justify-center items-center"
        >
          <video className="w-[83.5%] px-4 rounded-4xl" controls src={video} />
        </div>
      </section>

      <section className="text-center w-full my-8 bg-[var(--Light)] text-[var(--LightTxt)] px-10 md:px-12 lg:px-64">
        <h1 className="font-bold text-2xl md:text-3xl py-5">
          {t("home-stats", "academyInNumbers", "Academy in Numbers")}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 pb-5 gap-y-6 px-10 sm:px-20 lg:px-0 xl:px-32">
          <article
            data-aos="fade-up"
            data-aos-duration="2000"
            data-aos-delay="1000"
            className="flex justify-center text-center my-2 flex-col items-center space-y-2"
          >
            <PiBookBold className="text-8xl font-bold text-white bg-[var(--Main)] p-6 rounded-full" />
            <h1 className="font-bold text-2xl">+30</h1>
            <p className="md:text-xl lg:text-[18px]">{t("home-stats", "coursesAvailable", "Courses Available")}</p>
          </article>

          <article
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="2000"
            className="flex justify-center text-center my-2 flex-col items-center space-y-2"
          >
            <PiGraduationCapBold className="text-8xl text-white bg-[var(--Main)] p-6 rounded-full" />
            <h1 className="font-bold text-2xl">+360</h1>
            <p className="md:text-xl lg:text-[18px]">
              {t("home-stats", "certifiedGraduates", "Graduates")}
            </p>
          </article>

          <article
            data-aos="fade-up"
            data-aos-duration="2000"
            data-aos-delay="3000"
            className="flex justify-center text-center my-2 flex-col items-center space-y-2"
          >
            <RiGlobeLine className="text-8xl text-white bg-[var(--Main)] p-6 rounded-full" />
            <h1 className="font-bold text-2xl">+15</h1>
            <p className="md:text-xl lg:text-[18px]">{t("home-stats", "globalResearch", "Countries")}</p>
          </article>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="font-bold text-center text-2xl sm:text-3xl md:text-4xl mb-12 text-[var(--Main)]">
          {t("home-trial", "bookFreeTrialLesson", "Book Your Free Trial Lesson")}
        </h1>

        <article className="bg-gradient-to-br from-[var(--Light)] to-white rounded-3xl shadow-xl p-6 md:p-10">
          {/* Three Column Row Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-10">
            {/* Left Card - First Step */}
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              className="bg-white rounded-2xl p-6 shadow-md border border-[var(--SubTextBorder)]"
            >
              <h3 className="font-semibold text-lg md:text-xl mb-3">
                {t("home-trial", "firstStep1", "Take the First Step Towards")}{" "}
                <span className="text-[var(--Yellow)]">{t("home-trial", "firstStep2", "English Fluency")}</span>
                {t("home-trial", "firstStep3", " – It's Free!")}
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                {t("home-trial", "freeSession", "Get a free one-on-one session with our expert instructors")}
              </p>
            </div>

            {/* Center - Offer Image */}
            <div
              data-aos="fade-up"
              data-aos-duration="1000"
              className="flex justify-center"
            >
              <img
                src={offer}
                className="w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-xl"
                alt="Special Offer"
              />
            </div>

            {/* Right Card - Benefits */}
            <div
              data-aos="fade-left"
              data-aos-duration="1000"
              className="bg-white rounded-2xl p-6 shadow-md"
            >
              <h2 className="font-bold text-lg md:text-xl mb-4 text-[var(--Main)]">
                {t("home-trial", "benefits", "Benefits")}
              </h2>
              <div className="space-y-3">
                <Bnfts text={t("home-trial", "freeTrialSession", "Free 30-minute Trial Session")} />
                <Bnfts text={t("home-trial", "personalizedFeedback", "Personalized feedback")} />
                <Bnfts text={t("home-trial", "noObligations", "No obligations")} />
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            className="flex justify-center"
          >
            <button
              onClick={() => {
                navigate(localizePath("/free-session"), { state: { option: "Free Session" } });
                window.scroll(0, 0);
              }}
              className="px-8 py-4 rounded-2xl bg-[var(--Yellow)] hover:bg-opacity-90 text-white font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {t("home-hero", "bookFreeTrial", "Book Free Trial")}
            </button>
          </div>
        </article>
      </section>

      <section className="px-10 md:px-12 lg:px-60">
        <h1 className="font-bold text-center text-2xl lg:text-3xl py-5 mb-8">
          {t("home-services", "discoverOurServices", "Discover Our Services")}
        </h1>

        <article className="grid grid-cols-1 gap-x-2 my-6 lg:grid-cols-8 lg:gap-x-8 lg:my-12">
          <div className="mb-6 lg:mb-0 lg:col-span-3 hidden lg:flex flex-col items-center justify-end">
            <img src={thinking} className="w-full" alt="thinking" />
          </div>

          <div className="space-y-4 lg:space-y-8 lg:col-span-5 flex flex-col justify-end">
            <Service
              data-aos="fade-left"
              icon={FaLaptop}
              title={t("home-services", "interactiveLiveClasses", "Interactive Live Classes")}
              details={t("home-services", "interactiveLiveClassesDetails", "Learn in real-time with top instructors.")}
            />
            <Service
              data-aos="fade-left"
              icon={FaMoneyBillWave}
              title={t("home-services", "affordablePlans", "Affordable Plans")}
              details={t("home-services", "affordablePlansDetails", "Access premium courses within your budget.")}
            />
            <Service
              data-aos="fade-left"
              icon={PiGlobeStandFill}
              title={t("home-services", "globalAccess", "Global Access")}
              details={t("home-services", "globalAccessDetails", "Learn anytime, anywhere.")}
            />
            <Service
              data-aos="fade-left"
              icon={ImBooks}
              title={t("home-services", "comprehensiveResources", "Comprehensive Resources")}
              details={t("home-services", "comprehensiveResourcesDetails", "Benefit from a library of rich materials.")}
            />
          </div>

          <div className="mb-6 lg:mb-0 lg:col-span-3 lg:hidden flex flex-col items-center justify-end">
            <img src={thinking} className="w-[60%]" alt="thinking" />
          </div>
        </article>
      </section>

      <section className="px-10 md:px-12 lg:px-60">
        <h1 className="font-bold text-center text-xl md:text-3xl py-5 mb-8">
          {t("home-courses", "masterEnglish", "Master English with These Courses")}
        </h1>

        <article
          data-aos="fade-up"
          data-aos-delay="1000"
          className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-6"
        >
          {categories.map((cat) => (
            <Course key={cat._id} category={cat} />
          ))}
        </article>
      </section>
    </main>
  );
}

export default Home;
