import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import group from '../assets/group.png';
import light from '../assets/light.png';
import Instructor from '../Components/Instructor';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

import Fatma from '../assets/instructors/Fatma.jpg';
import Hanady from '../assets/instructors/Hanady.jpg';
import Haneen from '../assets/instructors/Haneen.jpg';
import Mazen from '../assets/instructors/Mazen.jpg';
import Nada from '../assets/instructors/Nada.jpg';
import Shaza from '../assets/instructors/Shaza.jpg';

import vid from '../assets/video.mp4';

import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';

function AboutUs() {
 const { t, i18n } = useTranslation();
 const [show, setShow] = useState("hidden");
 const [show2, setShow2] = useState("hidden");

 const rotation1 = i18n.language === 'en' ? (show ? "-right-60 md:top-28 lg:top-24 xl:top-18" : "-right-60 md:top-28 lg:top-40 xl:top-30") : "-left-60 md:top-28 lg:top-20 xl:top-18",
  rotation2 = i18n.language === 'en' ? " -left-56" : "-right-60";

 const btn_pos = i18n.language === 'en' ? "pe-14" : "pe-24";

 const [sliderRef, instanceRef] = useKeenSlider({
  slides: {
   perView: 3,
   spacing: 3,
  },
  breakpoints: {
   '(max-width: 992px)': {
    slides: {
     perView: 2,
     spacing: 5,
    },
   },
   '(max-width: 576px)': {
    slides: {
     perView: 1,
     spacing: 5,
    },
   },
  },
 });

 const features = {
  en: [
   {
    number: '1',
    title: t('PersonalizedFeedback'),
    description: t('aboutDecOne'),
   },
   {
    number: '2',
    title: t('LivePracticeSessions'),
    description: t('aboutDectwo'),
   },
   {
    number: '3',
    title: t('ProgressTracking'),
    description: t('aboutDecthree'),
   },
   {
    number: '4',
    title: t('FlexibleLearningPaths'),
    description: t('aboutDecfour'),
   },
  ],
  ar: [
   {
    number: '1',
    title: t('تعليقات مخصصة'),
    description: t('توجيه فردي من مدربين خبراء.'),
   },
   {
    number: '2',
    title: t('جلسات تدريبية مباشرة'),
    description: t('تمارين تحدث واستماع في الوقت الفعلي.'),
   },
   {
    number: '3',
    title: t('تتبع التقدم'),
    description: t('تقييمات منتظمة لقياس التحسن.'),
   },
   {
    number: '4',
    title: t('مسارات تعلم مرنة'),
    description: t('تجارب تعلم مخصصة مصممة لتتناسب مع أسلوبك الفريد، سرعتك، وأهدافك.'),
   },
  ],
 }
 
 const currentFeatures = features[i18n.language] || features.en;
 const ins = [
  {
   "img": Haneen,
   "name": {
    "en": t("insOne"),
   },
   "years": 4
  },
  {
   "img": Fatma,
   "name": {
    "en":  t("insTwo"),
   },
   "years": 5
  },
  {
   "img": Nada,
   "name": {
    "en":  t("insThree"),
   },
   "years": 5
  },
  {
   "img": Shaza,
   "name": {
    "en": t("insFour"),
   },
   "years": 10
  },
  {
   "img": Mazen,
   "name": {
    "en":  t("insFive"),
   },
   "years": 4
  },
  {
   "img": Hanady,
   "name": {
    "en":  t("insSix"),
   },
   "years": 6
  }
 ]
  ;

 return (
  <main className='space-y-10 lg:space-y-20'>
   <h1 className='font-bold text-3xl py-5 mb-8 px-10 md:px-12 lg:px-60'>{t('AboutUs')}</h1>

   <section data-aos-duration="1000" data-aos-delay="1000" data-aos="fade-up" className='px-10 md:px-12 lg:px-60'>
  <article className='my-10 space-y-10 md:px-1 w-full'>
    <h1 className='text-2xl font-bold'>{t('AboutOur')}</h1>
    <div className='flex flex-col items-center'>
      <video className='h-full w-full rounded-2xl' controls controlsList='nodownload' src={vid} />
    </div>
  </article>
</section>


   <section className='relative grid grid-cols-1 lg:grid-cols-3'>
    {/* Image on Top */}
    <article data-aos="fade-left" data-aos-duration="1000" className="relative z-20">
     <img src={group} className={`md:pr-2 hidden px-1 lg:block absolute w-full ${show ? 'h-80' : 'h-80'} ${rotation1}`} alt="Meeting" />
    </article>

    {/* Text Below the Image */}
    <div className="ps-8 lg:ps-20 col-span-2">
     <article data-aos="fade-right" data-aos-duration="1000" className={`space-y-10 py-20 text-[var(--LightTxt)] bg-[var(--Light)] p-8 ${i18n.language == 'en' ? 'md:pl-12 lg:pl-60 pl-12' : "md:pr-12 lg:pr-60 pr-12"} rounded-s-[100px]`}>
      <h1 className='text-3xl font-bold text-black'>{t('AcademyBackground')}</h1>
      <h3 className='font-bold text-2xl'>{t('OurJourney')}</h3>
      <p className='w-full lg:w-3/4'>{t('acadback')}</p>

      <section className={`my-3 space-y-3 ${show}`}>
       <h1 className='text-2xl font-bold'>{t('OurAchievements')}</h1>
       <p className='w-full lg:w-3/4'>{t('OurAchievementsDescription')}</p>
      </section>

      <div className={`flex justify-end ${i18n.language === 'en' ? 'md:pr-40' : 'md:pl-40'} ${btn_pos}`}>
       <button onClick={() => show == "" ? setShow("hidden") : setShow("")} className='p-4 text-black rounded-3xl bg-[var(--Yellow)] transition-colors'>
        {show ? t('ExploreMore') : t('ExploreLess')}
       </button>
      </div>
     </article>
    </div>
   </section>

   <section className='relative grid grid-cols-1 lg:grid-cols-3'>
    <div className="pe-8 lg:pe-20 col-span-2">
     <article data-aos="fade-right" data-aos-duration="1000" className={`space-y-6 text-[var(--LightTxt)] bg-[var(--Light)] py-20 p-8 ${i18n.language == 'en' ? 'md:pl-12 lg:pl-60 pl-12' : "md:pr-12 lg:pr-60 pr-12"} rounded-e-[100px]`}>
      <h1 className='text-xl md:text-2xl font-bold'>{t('WhyWeAreUnique')}</h1>
      <h3 className='text-lg font-bold'>{t('ExpertGuidance')}</h3>
      <p className='w-full lg:w-3/4 text-lg'>{t('Learn from certified instructors with years of experience.')}</p>
      <h3 className='text-lg font-bold'>{t('Tailored Learning')}</h3>
      <p className='w-full lg:w-3/4 text-lg'>{t('Courses customized to match your proficiency level and goals.')}</p>

      <section className={`my-3 space-y-3 ${show2}`}>
       <div className="space-y-3">
        <h3 className='text-lg font-bold'>{t('BilingualSupport')}</h3>
        <p className='w-full lg:w-3/4 text-lg'>{t('BilingualSupportDescription')}</p>
       </div>
       <div className="space-y-3">
        <h1 className='text-lg font-bold'>{t('FlexibleScheduling')}</h1>
        <p className='w-full lg:w-3/4 text-lg'>{t('FlexibleSchedulingDescription')}</p>
       </div>
      </section>
      <div className={`flex justify-end md:${btn_pos}  ${i18n.language == 'en' ? 'md:pr-40' : 'md:pl-40'}`}>
       <button onClick={() => show2 == "" ? setShow2("hidden") : setShow2("")} className='p-4 text-black rounded-3xl bg-[var(--Yellow)] transition-colors'>
        {show2 ? t('ExploreMore') : t('ExploreLess')}
       </button>
      </div>
     </article>
    </div>

    <article data-aos="fade-left" data-aos-duration="1000" className="relative">
     <img src={light} className={`w-full h-90 top-0 hidden lg:block absolute ${rotation2}`} alt="Meeting" />
    </article>
   </section>

   <section data-aos="fade-up" className='px-10 md:px-12 lg:px-60 space-y-10 lg:space-y-40'>
    <h1 className='text-2xl md:text-3xl font-bold'>
     {t('OurTeachingApproach')}
    </h1>

    <div className="xl:block hidden">
     <div className="grid grid-cols-1 lg:grid-cols-4 lg:my-20 gap-2 md:gap-8">
      { currentFeatures.length === 0 ? null:currentFeatures.map((feature, index) => (
       <article data-aos="fade-up" data-aos-delay={feature.number * 100} key={index} className="bg-[var(--Light)] text-[var(--LightTxt)] p-4 rounded-3xl shadow-lg lg:my-0"
        style={{ marginTop: `-${feature.number * 30}px` }}>
        <p className="text-4xl font-bold my-6 text-center">{feature.number}</p>
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
      {currentFeatures.map((feature, index) => (
       <article data-aos="fade-up" data-aos-delay={feature.number * 100} key={index} className="bg-[var(--Light)] text-[var(--LightTxt)] p-4 rounded-3xl shadow-lg">
        <p className="text-4xl font-bold mb-4 text-center">{feature.number}</p>
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

   <section data-aos="fade-up" className='px-10 md:px-12 lg:px-60 space-y-10'>
    <h1 className='font-bold text-2xl md:text-3xl'>{t('MeetOurInstructors')}</h1>

    <article className="px-1.5">
     <div ref={sliderRef} className="keen-slider" dir="ltr">
      {ins.sort((a, b) => b.years - a.years).map(inst => <div data-aos="fade-up" data-aos-duration="2000" data-aos-delay="100" className="keen-slider__slide">
       <Instructor pic={inst.img} name={inst.name[i18n.language] || inst.name.en} years={inst.years} />
      </div>)}
     </div>

     <div className="flex justify-between mt-4 space-x-4" dir="ltr">
      <button onClick={() => instanceRef.current?.prev()} className="p-2 text-black font-bold">
       <IoMdArrowBack />
      </button>
      <button onClick={() => instanceRef.current?.next()} className="p-2 text-black font-bold">
       <IoMdArrowForward />
      </button>
     </div>
    </article>
   </section>
  </main>
 );
}

export default AboutUs;