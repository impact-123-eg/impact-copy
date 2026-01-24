import React, { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import Instructor from "../Components/Instructor";
import { useI18n } from "../hooks/useI18n";
import SEO from "../Components/SEO";

import Haneen from "../assets/instructors/Haneen.jpg";
import Fatma from "../assets/instructors/Fatma.jpg";
import Nada from "../assets/instructors/Nada.jpg";
import Shaza from "../assets/instructors/Shaza.jpg";
import Mazen from "../assets/instructors/Mazen.jpg";
import Hanady from "../assets/instructors/Hanady.jpg";
import group from "../assets/group.png";
import vid from "../assets/video.mp4";
import light from "../assets/light.png";

function AboutUs() {
  const { t, currentLocale, initialize, loading } = useI18n();
  const [show, setShow] = useState("hidden");
  const [show2, setShow2] = useState("hidden");

  useEffect(() => {
    initialize();
  }, [initialize]);

  const AR = currentLocale === "ar";
  const rotation1 =
    !AR
      ? show === "hidden"
        ? "-right-60 md:top-28 lg:top-40 xl:top-30"
        : "-right-60 md:top-28 lg:top-24 xl:top-18"
      : "-left-60 md:top-28 lg:top-20 xl:top-18",
    rotation2 = !AR ? " -left-56" : "-right-60";

  const btn_pos = !AR ? "pe-14" : "pe-24";

  const [sliderRef, instanceRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 3,
    },
    breakpoints: {
      "(max-width: 992px)": {
        slides: {
          perView: 2,
          spacing: 5,
        },
      },
      "(max-width: 576px)": {
        slides: {
          perView: 1,
          spacing: 5,
        },
      },
    },
  });

  const features = [
    {
      number: "1",
      title: t("about-us", "PersonalizedFeedback", "Personalized Feedback"),
      description: t("about-us", "aboutDecOne"),
    },
    {
      number: "2",
      title: t("about-us", "LivePracticeSessions", "Live Practice Sessions"),
      description: t("about-us", "aboutDectwo"),
    },
    {
      number: "3",
      title: t("about-us", "ProgressTracking", "Progress Tracking"),
      description: t("about-us", "aboutDecthree"),
    },
    {
      number: "4",
      title: t("about-us", "FlexibleLearningPaths", "Flexible Learning Paths"),
      description: t("about-us", "aboutDecfour"),
    },
  ];

  const ins = [
    {
      img: Haneen,
      nameKey: "insOne",
      years: 4,
    },
    {
      img: Fatma,
      nameKey: "insTwo",
      years: 5,
    },
    {
      img: Nada,
      nameKey: "insThree",
      years: 5,
    },
    {
      img: Shaza,
      nameKey: "insFour",
      years: 10,
    },
    {
      img: Mazen,
      nameKey: "insFive",
      years: 4,
    },
    {
      img: Hanady,
      nameKey: "insSix",
      years: 6,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--Yellow)]"></div>
      </div>
    );
  }

  return (
    <main className="space-y-10 lg:space-y-20">
      <SEO
        title={t("about-us", "AboutUs", "About Us")}
        description="Learn more about Impact Academy, our mission, our expert instructors, and our teaching approach to help you master English."
      />
      <h1 data-aos="fade-up" className="font-bold text-3xl md:text-5xl py-5 mb-12 text-center">
        {t("about-us", "AboutUs", "About Us")}
      </h1>

      <section
        data-aos-duration="1000"
        data-aos-delay="1000"
        data-aos="fade-up"
        className="px-10 md:px-12 lg:px-60"
      >
        <article className="my-10 space-y-10 md:px-1 w-full">
          <h1 className="text-2xl font-bold">{t("about-us", "AboutOur", "About Our Academy")}</h1>
          <div className="flex flex-col items-center">
            <video
              className="h-full w-full rounded-2xl"
              controls
              controlsList="nodownload"
              src={vid}
            />
          </div>
        </article>
      </section>

      <section className="relative grid grid-cols-1 lg:grid-cols-3">
        {/* Image on Top */}
        <article
          data-aos="fade-left"
          data-aos-duration="1000"
          className="relative z-20"
        >
          <img
            src={group}
            className={`md:pr-2 hidden px-1 lg:block absolute w-full ${show === "hidden" ? "h-80" : "h-80"
              } ${rotation1}`}
            alt="Meeting"
          />
        </article>

        {/* Text Below the Image */}
        <div className="ps-8 lg:ps-20 col-span-2">
          <article
            data-aos="fade-right"
            data-aos-duration="1000"
            className={`space-y-10 py-20 text-[var(--LightTxt)] bg-[var(--Light)] p-8 ${!AR
              ? "md:pl-12 lg:pl-60 pl-12"
              : "md:pr-12 lg:pr-60 pr-12"
              } rounded-s-[100px]`}
          >
            <h1 className="text-3xl font-bold text-black">
              {t("about-us", "AcademyBackground", "Academy Background")}
            </h1>
            <h3 className="font-bold text-2xl">{t("about-us", "OurJourney", "Our Journey")}</h3>
            <p className="w-full lg:w-3/4">{t("about-us", "acadback")}</p>

            <section className={`my-3 space-y-3 ${show}`}>
              <h1 className="text-2xl font-bold">{t("about-us", "OurAchievements", "Our Achievements")}</h1>
              <p className="w-full lg:w-3/4">
                {t("about-us", "OurAchievementsDescription")}
              </p>
            </section>

            <div
              className={`flex justify-end ${!AR ? "md:pr-40" : "md:pl-40"
                } ${btn_pos}`}
            >
              <button
                onClick={() => (show === "" ? setShow("hidden") : setShow(""))}
                className="p-4 text-black rounded-3xl bg-[var(--Yellow)] transition-colors"
              >
                {show === "hidden" ? t("about-us", "ExploreMore", "Explore More") : t("about-us", "ExploreLess", "Explore Less")}
              </button>
            </div>
          </article>
        </div>
      </section>

      <section className="relative grid grid-cols-1 lg:grid-cols-3">
        <div className="pe-8 lg:pe-20 col-span-2">
          <article
            data-aos="fade-right"
            data-aos-duration="1000"
            className={`space-y-6 text-[var(--LightTxt)] bg-[var(--Light)] py-20 p-8 ${!AR
              ? "md:pl-12 lg:pl-60 pl-12"
              : "md:pr-12 lg:pr-60 pr-12"
              } rounded-e-[100px]`}
          >
            <h1 className="text-xl md:text-2xl font-bold">
              {t("about-us", "WhyWeAreUnique", "Why We Are Unique")}
            </h1>
            <h3 className="text-lg font-bold">{t("about-us", "ExpertGuidance", "Expert Guidance")}</h3>
            <p className="w-full lg:w-3/4 text-lg">
              {t("about-us", "ExpertGuidanceDetails", "Learn from certified instructors with years of experience.")}
            </p>
            <h3 className="text-lg font-bold">{t("about-us", "TailoredLearning", "Tailored Learning")}</h3>
            <p className="w-full lg:w-3/4 text-lg">
              {t("about-us", "TailoredLearningDetails", "Courses customized to match your proficiency level and goals.")}
            </p>

            <section className={`my-3 space-y-3 ${show2}`}>
              <div className="space-y-3">
                <h3 className="text-lg font-bold">{t("about-us", "BilingualSupport", "Bilingual Support")}</h3>
                <p className="w-full lg:w-3/4 text-lg">
                  {t("about-us", "BilingualSupportDescription")}
                </p>
              </div>
              <div className="space-y-3">
                <h1 className="text-lg font-bold">{t("about-us", "FlexibleScheduling", "Flexible Scheduling")}</h1>
                <p className="w-full lg:w-3/4 text-lg">
                  {t("about-us", "FlexibleSchedulingDescription")}
                </p>
              </div>
            </section>
            <div
              className={`flex justify-end md:${btn_pos}  ${!AR ? "md:pr-40" : "md:pl-40"
                }`}
            >
              <button
                onClick={() =>
                  show2 === "" ? setShow2("hidden") : setShow2("")
                }
                className="p-4 text-black rounded-3xl bg-[var(--Yellow)] transition-colors"
              >
                {show2 === "hidden" ? t("about-us", "ExploreMore", "Explore More") : t("about-us", "ExploreLess", "Explore Less")}
              </button>
            </div>
          </article>
        </div>

        <article
          data-aos="fade-left"
          data-aos-duration="1000"
          className="relative"
        >
          <img
            src={light}
            className={`w-full h-90 top-0 hidden lg:block absolute ${rotation2}`}
            alt="Meeting"
          />
        </article>
      </section>

      <section
        data-aos="fade-up"
        className="px-10 md:px-12 lg:px-60 space-y-10 lg:space-y-40"
      >
        <h1 className="text-2xl md:text-3xl font-bold">
          {t("about-us", "OurTeachingApproach", "Our Teaching Approach")}
        </h1>

        <div className="xl:block hidden">
          <div className="grid grid-cols-1 lg:grid-cols-4 lg:my-20 gap-2 md:gap-8">
            {features.map((feature, index) => (
              <article
                data-aos="fade-up"
                data-aos-delay={feature.number * 100}
                key={index}
                className="bg-[var(--Light)] text-[var(--LightTxt)] p-4 rounded-3xl shadow-lg lg:my-0"
                style={{ marginTop: `-${feature.number * 30}px` }}
              >
                <p className="text-4xl font-bold my-6 text-center">
                  {feature.number}
                </p>
                <h2 className="text-xl md:text-2xl font-semibold my-6 text-center">
                  {feature.title}
                </h2>
                <p className="text-gray-600 text-center md:text-left">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="block xl:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-8">
            {features.map((feature, index) => (
              <article
                data-aos="fade-up"
                data-aos-delay={feature.number * 100}
                key={index}
                className="bg-[var(--Light)] text-[var(--LightTxt)] p-4 rounded-3xl shadow-lg"
              >
                <p className="text-4xl font-bold mb-4 text-center">
                  {feature.number}
                </p>
                <h2 className="text-xl md:text-2xl font-semibold mb-2 text-center">
                  {feature.title}
                </h2>
                <p className="text-gray-600 text-center md:text-left">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        data-aos="fade-up"
        className="px-10 md:px-12 lg:px-60 space-y-10"
      >
        <h1 className="font-bold text-2xl md:text-3xl">
          {t("about-us", "MeetOurInstructors", "Meet Our Expert Instructors")}
        </h1>

        <article className="px-1.5">
          <div ref={sliderRef} className="keen-slider" dir="ltr">
            {ins
              .sort((a, b) => b.years - a.years)
              .map((inst, index) => (
                <div
                  data-aos="fade-up"
                  data-aos-duration="2000"
                  data-aos-delay="100"
                  className="keen-slider__slide"
                  key={index}
                >
                  <Instructor
                    pic={inst.img}
                    name={t("about-us", inst.nameKey)}
                    years={inst.years}
                  />
                </div>
              ))}
          </div>

          <div className="flex justify-between mt-4 space-x-4" dir="ltr">
            <button
              onClick={() => instanceRef.current?.prev()}
              className="p-2 text-black font-bold"
            >
              <IoMdArrowBack />
            </button>
            <button
              onClick={() => instanceRef.current?.next()}
              className="p-2 text-black font-bold"
            >
              <IoMdArrowForward />
            </button>
          </div>
        </article>
      </section>
    </main>
  );
}

export default AboutUs;
