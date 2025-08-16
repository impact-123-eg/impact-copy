import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import { IoPersonSharp } from 'react-icons/io5';
import { GiTeacher } from "react-icons/gi";
import { db } from '../data/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Option from '../Components/Option';

function CourseDetails() {
  const { i18n } = useTranslation();
  const { courseName } = useParams();
  const currentLanguage = i18n.language;
  const [course, setCourse] = useState([]);
  // const [courseCount, setCourseCount] = useState(null);
  useEffect(() => {
    const fetchCourse = async () => {
      try {
         ("Fetching course with Tab:", courseName);
  
        const q = query(collection(db, "courses"), where("Tab", "==", courseName));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const coursesArray = querySnapshot.docs.map((doc) => ({
            id: doc.id, 
            ...doc.data(),
          }));
          setCourse(coursesArray);
        } else {
           ("No matching document found!");
        }
      } catch (error) {
        console.error("Error fetching course: ", error);
      }
    };
    localStorage.setItem("course" , courseName)
    fetchCourse();
  }, [courseName, currentLanguage]);
  // if (!course) {
  //   return <div>{currentLanguage === 'en' ? 'Course not found' : 'الدورة غير موجودة'}</div>;
  // }

  return (
    <main className="px-10 md:px-12 xl:px-60 space-y-12">
      <h1 className="text-4xl font-bold mt-5">{currentLanguage === 'en' ? 'Course Details' : 'تفاصيل الدورة'}</h1>

      <section className="space-y-6">
        <h2 data-aos="fade-left" className="text-3xl font-semibold text-[var(--Yellow)]">{courseName === "IELTS"? currentLanguage === 'en' ? "IELTS":"ايلتس":courseName === "Group" ?currentLanguage === 'en' ? "Group":"مجموعه" : courseName === "Private" ?currentLanguage === 'en' ? "Private":"فردي" : ""}</h2>
        <p data-aos="fade-left" data-aos-delay="50" className="md:text-2xl px-4">{courseName === "IELTS"? currentLanguage === 'en' ? "Achieve your target IELTS score with expert-led live sessions, structured study plans, and personalized feedback":"تعلم فردياً مع مدرس خاص بك في حصص تفاعلية":courseName === "Group" ?currentLanguage === 'en' ? "Learn in small groups with interactive live sessions and structured learning plans.":"تعلم في مجموعات صغيرة مع جلسات حية تفاعلية وخطط تعليمية منظمة." : courseName === "Private" ? currentLanguage === 'en' ? "Get personalized one-on-one learning with expert instructors, tailored lessons, and a flexible schedule to fit your needs.":"تعلم فردياً مع مدرس خاص بك في حصص تفاعلية" : "" }</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">{currentLanguage === 'en' ? 'Course Highlights' : 'أبرز النقاط في الدورة'}</h2>

        <ul className="list-none ml-6 space-y-4 text-sm md:text-2xl">
          <li data-aos="fade-left" data-aos-delay="100" key="student">
            <div className="flex gap-7 items-center">
              <IoPersonSharp className="text-[var(--Main)] text-2xl" aria-label="Student" />{courseName === "IELTS" || courseName ===  "Private" ? currentLanguage === 'en' ? "1 student":" 1 طالب":currentLanguage === 'en' ? " 3 - 7 Students": " 3 - 7 طالب"}
            </div>
          </li>
          <li data-aos="fade-left" data-aos-delay="200" key="level-assessment">
            <div className="flex gap-7 items-center">
              <FaChartLine className="text-[var(--Main)] text-2xl" aria-label="Level Assessment" /> {currentLanguage === 'en' ? 'Level Assessment' : 'تقييم المستوى'}
            </div>
          </li>
          <li data-aos="fade-left" data-aos-delay="300" key="live-sessions">
            <div className="flex gap-7 items-center">
              <GiTeacher className="text-[var(--Main)] text-2xl" aria-label="Live Sessions" /> {currentLanguage === 'en' ? 'Live Sessions' : 'جلسات مباشرة'}
            </div>
          </li>
          <li data-aos="fade-left" data-aos-delay="400" key="weekly-conversation">
            <div className="flex gap-7 items-center">
              <FaCalendarAlt className="text-[var(--Main)] text-2xl" aria-label="Weekly Conversation Classes" /> {currentLanguage === 'en' ? 'Weekly Conversation Classes' : 'دروس محادثة أسبوعية'}
            </div>
          </li>
        </ul>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold">{currentLanguage === 'en' ? 'Options' : 'الخيارات'}</h2>

        <article className={`grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 xl:gap-28`}>
          {course && course.map((opt) => (
            
            <Option key={opt.id} id={opt.id} TotalTimeUnitAr={opt.TotalTimeUnitAr} TotalTimeUnit={opt.TotalTimeUnit} SessionPerWeekAr={opt.SessionPerWeekAr} SessionNoAr={opt.SessionNoAr} NameAr={opt.NameAr} number={opt.id} Name={opt.Name} priceBefore={opt.PriceBefore} priceAfter={opt.PriceAfter} duration={opt.TotalTimeNo}
            TotalTimeNo={opt.TotalTimeNo} HoursAr={opt.HoursAr} SessionNo={opt.SessionNo} SessionPerWeek={opt.SessionPerWeek} Hours={opt.Hours} ScheduleType={opt.ScheduleType} ScheduleTypeAr={opt.ScheduleTypeAr}
              courseCategory={courseName === 'IELTS' ? 'IELTS' : 'general'} option={courseName === 'IELTS'? "private" : courseName} />
          )
          
          )}
        </article>
      </section>
    </main>
  );
}

export default CourseDetails;
