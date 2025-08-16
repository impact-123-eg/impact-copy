import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db, doc, getDoc, updateDoc } from "../../data/firebaseConfig";
import Swal from 'sweetalert2';

function EditCourse() {
 const location = useLocation();
 const navigate = useNavigate();

 const tabs = ["Group", "Private", "IELTS"];

 const courseId = location.state?.courseId;
 const activeTab = location.state?.tab;
 const levelId = location.state?.levelId;

 const [courseData, setCourseData] = useState([]);

 const [studentNo, setStudentNo] = useState(null);
 const [levelno, setLevelno] = useState(null);
 const [levelnoAr, setLevelnoAr] = useState(null);
 const [priceBefore, setPriceBefore] = useState(null);
 const [priceAfter, setPriceAfter] = useState(null);
 const [totalTime, setTotalTime] = useState(null);
 const [totalTimeNo, setTotalTimeNo] = useState(null);
 const [totalTimeUnit, setTotalTimeUnit] = useState(null);
 const [totalTimeUnitAr, setTotalTimeUnitAr] = useState(null);
 const [sessionPerWeek, setSessionPerWeek] = useState(null);
  const [sessionPerWeekAr, setSessionPerWeekAr] = useState(null);
 const [sessionNo, setSessionNo] = useState();
  const [sessionNoAr, setSessionNoAr] = useState();
 const [hours, setHours] = useState(null);
 const [hoursAr, setHoursAr] = useState(null);
 const [scheduleType, setScheduleType] = useState(null);
 const [scheduleTypeAr, setScheduleTypeAr] = useState(null);

 useEffect(() => {
  const fetchCourse = async () => {
    try {
      const docRef = doc(db, "courses", courseId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
         ("Fetched data:", data); // Debugging

        setCourseData(data); // Store entire course object
        console.log(data.HoursAr)
        // Set state directly from the object instead of searching for a level
        setStudentNo(data.en?.studentNo || '');
        setLevelno(data.Name || ''); // Assuming "Name" is the level number
        setLevelnoAr(data.NameAr || '');
        setPriceBefore(data.PriceBefore || '');
        setPriceAfter(data.PriceAfter || '');
        setSessionNo(data.SessionNo || '');
        setSessionNoAr(data.SessionNoAr || '');
        setTotalTimeNo(data.TotalTimeNo || '');
        setTotalTimeUnit(data.TotalTimeUnit || '');
        setSessionPerWeek(data.SessionPerWeek || '');
        setSessionPerWeekAr(data.SessionPerWeekAr || '');
        setHours(data.Hours || '');
        setHoursAr(data.HoursAr || '');
        setScheduleType(data.ScheduleType || '');
        setTotalTimeUnitAr(data.TotalTimeUnitAr || '');
        setScheduleTypeAr(data.ScheduleTypeAr || '');
      } else {
        console.error("No such course found");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };


  if (courseId) {
    fetchCourse();
  }
}, [courseId]);
const handleUpdate = async (e) => {
  e.preventDefault();

  if (!priceBefore || !priceAfter || !sessionNo || !sessionPerWeek || !scheduleType || !levelno) {
    Swal.fire({ 
      icon: 'error', 
      title: 'Error', 
      text: 'Please Fill All Fields', 
      timer: 1000, 
      showConfirmButton: false 
    });
    return;
  }

  try {
    const courseRef = doc(db, "courses", courseId);

    // Updated course data object
    const updatedCourseData = {
      PriceBefore: priceBefore,
      PriceAfter: priceAfter,
      SessionNo: sessionNo,
      SessionNoAr: sessionNoAr,
      TotalTimeNo: totalTimeNo,
      TotalTimeUnit: totalTimeUnit,
      SessionPerWeek: sessionPerWeek,
      SessionPerWeekAr: sessionPerWeekAr,
      Hours: hours,
      HoursAr: hoursAr,
      ScheduleType: scheduleType,
      Name: levelno,  // Assuming "Name" is the level number
      TotalTimeUnitAr: totalTimeUnitAr,
      ScheduleTypeAr: scheduleTypeAr
    };

    // Update the document in Firebase
    await updateDoc(courseRef, updatedCourseData);

    Swal.fire({ 
      icon: 'success', 
      title: 'Updated!', 
      text: 'Course details updated successfully.', 
      timer: 1500, 
      showConfirmButton: false 
    });

    setTimeout(() => {
      navigate('/dash/courses');
    }, 1500);

  } catch (error) {
    console.error("Error updating course: ", error);
    Swal.fire({ 
      icon: 'error', 
      title: 'Error', 
      text: 'Something went wrong. Please try again.', 
      timer: 1000, 
      showConfirmButton: false 
    });
  }
};
 return (
  <main className='space-y-10'>
   <section className="flex justify-start space-x-16 text-center">
    {tabs.map((tab) => (
     <p key={tab} className={`pb-2 p-6 w-28 px-0 font-semibold text-xl ${activeTab === tab && "border-b-2 border-[var(--Yellow)] text-[var(--Yellow)]"}`}>
      {tab}
     </p>
    ))}
   </section>

   <form onSubmit={handleUpdate} className='space-y-10'>
    {/* English Part */}
    <section className='grid grid-cols-2 gap-x-8 '>
     <article className='space-y-2'>
      <h3 className='font-bold text-lg'>Price Before</h3>
      <input value={priceBefore} type='number' onChange={e => setPriceBefore(e.target.value)} className='w-full bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg' required />
     </article>
     <article className='space-y-2'>
      <h3 className='font-bold text-lg'>Price After</h3>
      <input value={priceAfter} type='number' onChange={e => setPriceAfter(e.target.value)} className='w-full bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg' required />
     </article>


     <article className='space-y-2'>
      <h3 className='font-bold text-lg'>Number of Sessions</h3>
      <input value={sessionNo} type='text' onChange={e => setSessionNo(e.target.value)} className='w-full bg-[var(--Input)] focus:outline-0 py-2 px-4 rounded-lg' />
     </article>
     <article className='space-y-2'>
      <h3 className='font-bold text-lg'>Duration</h3>
      <div className="grid grid-cols-2 space-x-4">
       <select className='bg-[var(--Input)] focus:outline-0 py-2 px-4 rounded-lg' value={totalTimeNo} onChange={(e) => setTotalTimeNo(e.target.value)}>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
        <option value={6}>6</option>
       </select>
       <select className='bg-[var(--Input)] focus:outline-0 py-2 px-4 rounded-lg' value={totalTimeUnit} onChange={(e) => setTotalTimeUnit(e.target.value)}>
        <option value="Weeks">Weeks</option>
        <option value="Months">Months</option>
        <option value="Week">Week</option>
        <option value="Month">Month</option>
       </select>
      </div>
     </article>

     <article className='space-y-2'>
      <h3 className='font-bold text-lg'>Sessions Per Week</h3>
      <input value={sessionPerWeek} type='text' onChange={e => setSessionPerWeek(e.target.value)} className='w-full bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg' required />
     </article>
     <article className='space-y-2'>
      <h3 className='font-bold text-lg'>Hours Per Session</h3>
      <input value={hours} type='text' onChange={e => setHours(e.target.value)} className='w-full bg-[var(--Input)] focus:outline-0 py-2 px-4 rounded-lg' />
     </article>


     <article className='space-y-2'>
      <h3 className='font-bold text-lg'>Schedule</h3>
      <input value={scheduleType} type='text' onChange={e => setScheduleType(e.target.value)} className='w-full bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg' required />
     </article>

     <article className='space-y-2'>
      <h3 className='font-bold text-lg'>Level Number</h3>
      <input value={levelno} type='text' onChange={e => setLevelno(e.target.value)} className='w-full bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg' required />
     </article>
    </section>

    {/* Arabic Part */}
    <section className='grid grid-cols-2 gap-x-8 ' dir='rtl'>
     <article className='space-y-2'>
      <h3 className='font-bold text-lg'>السعر قبل</h3>
      <input value={priceBefore} type='number' onChange={e => setPriceBefore(e.target.value)} className='w-full bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg' required />
     </article>
     <article className='space-y-2'>
      <h3 className='font-bold text-lg'>السعر بعد</h3>
      <input value={priceAfter} type='number' onChange={e => setPriceAfter(e.target.value)} className='w-full bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg' required />
     </article>


     <article className='space-y-2'>
      <h3 className='font-bold text-lg'>عدد الجلسات</h3>
      <input value={sessionNoAr} type='text' onChange={e => setSessionNoAr(e.target.value)} className='w-full bg-[var(--Input)] focus:outline-0 py-2 px-4 rounded-lg' />
     </article>
     <article className='space-y-2'>
      <h3 className='font-bold text-lg'>المدة</h3>
      <div className="grid grid-cols-2 space-x-4">
       <select className='bg-[var(--Input)] focus:outline-0 py-2 px-4 rounded-lg' value={totalTimeNo} onChange={(e) => setTotalTimeNo(e.target.value)}>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
        <option value={6}>6</option>
       </select>
       <select className='bg-[var(--Input)] focus:outline-0 py-2 px-4 translate-x-[-10px] rounded-lg' value={totalTimeUnitAr} onChange={(e) => setTotalTimeUnitAr(e.target.value)}>
        <option value="أسبوع">أسبوع</option>
        <option value="أسابيع">أسابيع</option>
        <option value="شهر">شهر</option>
        <option value="أشهر">أشهر</option>
       </select>
      </div>
     </article>

     <article className='space-y-2'>
      <h3 className='font-bold text-lg'>الجلسات فى الإسبوع</h3>
      <input value={sessionPerWeekAr} type='text' onChange={e => setSessionPerWeekAr(e.target.value)} className='w-full bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg' required />
     </article>
     <article className='space-y-2'>
      <h3 className='font-bold text-lg'>مدة الجلسة</h3>
      <input value={hoursAr} type='text' onChange={e => setHoursAr(e.target.value)} className='w-full bg-[var(--Input)] focus:outline-0 py-2 px-4 rounded-lg' />
     </article>


     <article className='space-y-2'>
      <h3 className='font-bold text-lg'>الجدول</h3>
      <input value={scheduleTypeAr} type='text' onChange={e => setScheduleTypeAr(e.target.value)} className='w-full bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg' required />
     </article>

     <article className='space-y-2'>
      <h3 className='font-bold text-lg'>عدد المراحل</h3>
      <input value={levelnoAr} type='text' onChange={e => setLevelnoAr(e.target.value)} className='w-full bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg' required />
     </article>
    </section>

    <div className="flex justify-between items-center text-xl">
     <button type="button" onClick={() => navigate('/dash/courses')} className="px-20 py-4 shadow-md rounded-xl border-2 border-[var(--Yellow)]" >
      Cancel
     </button>
     <button type="submit" className="px-20 py-4 shadow-md rounded-xl bg-[var(--Yellow)]">
      Save
     </button>
    </div>
   </form>
  </main>
 );
}

export default EditCourse;
