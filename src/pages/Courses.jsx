import { useEffect, useState } from 'react';
import Course from '../Components/Course';
import { useTranslation } from 'react-i18next';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../data/firebaseConfig';

function Courses() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesCollection = collection(db, "courses");
        const courseSnapshot = await getDocs(coursesCollection);
        
        // Convert Firestore documents to an array
        const coursesArray = courseSnapshot.docs.map((doc) => ({
          id: doc.id, 
          ...doc.data(),
        }));
  
        setCourses(coursesArray); // ✅ Set as an array
      } catch (error) {
        console.error("Error fetching courses: ", error);
      }
    };
  
    fetchCourses();
  }, []);
   (courses)

  return (
    <section className='px-10 md:px-60'>
      <h1 data-aos="fade-up" className='font-bold text-3xl py-5 mb-8'>{t('ourcorses')}</h1>

      <article data-aos="fade-up" data-aos-delay="1000" className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6'>
      <Course direc="IELTS" title={t('courses.ielts')}  selectedCourse="IELTS"/>
          <Course direc="Group" title={t('courses.group')} selectedCourse="Group" />
          <Course direc="Private" title={t('courses.private')} selectedCourse="Private" />
        </article>
    </section>
  );
}

export default Courses;
