import{ useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { db } from "../../data/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Modal from "react-responsive-modal";

function CoursesPlans() {
  const tabs = ["Group", "Private", "IELTS"];
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Group");
  const [courseData, setCourseData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [levelToDelete, setLevelToDelete] = useState(null);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(collection(db, "courses"));
        const querySnapshot = await getDocs(q);
  
        if (querySnapshot.empty) {
          alert("No courses found");
          setCourseData([]); // Set an empty array instead of null
        } else {
          const courses = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          // Filter courses that match the activeTab
          const filteredCourses = courses.filter((course) => course.Tab === activeTab);
  
          setCourseData(filteredCourses); // Store as an array
        }
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };
  
    fetchCourses();
  }, [activeTab]);

   (levelToDelete)
  const handleDelete = async () => {
    if (!levelToDelete) {
      console.error("levelToDelete is undefined or null");
      return;
    }
  
    try {
      const courseRef = doc(db, "courses", levelToDelete); // Assuming levelToDelete is the document ID
  
      await deleteDoc(courseRef); // Delete the document from Firestore
  
      // Remove the deleted course level from local state
      setCourseData(prevData => prevData.filter(course => course.id !== levelToDelete));

      setOpenModal(false);
      setOpenSuccessModal(true);
      setTimeout(() => setOpenSuccessModal(false), 2000);
    } catch (e) {
      console.error("Error deleting course level:", e);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Failed to delete the course level. Please try again.",
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  return (
    <main className="space-y-6">
      <h1 className="font-bold text-2xl">Courses And Plans</h1>

      {/* Tab Navigation */}
      <section className="flex justify-start space-x-16">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`pb-2 p-6 w-28 px-0 font-semibold text-xl ${activeTab === tab && "border-b-2 border-[var(--Yellow)] text-[var(--Yellow)]"}`}>
            {tab}
          </button>
        ))}
      </section>

      {/* Course Levels */}
      <section className="grid grid-cols-2 gap-4">
        {
        courseData?.length > 0 &&
          courseData.map((level) => (
            <article key={level.id} className="p-4 space-y-8 pr-12 odd:border-r">
              <h2 className="text-2xl font-semibold">{level.levelno}</h2>

              {/* Course details */}
              <div className="flex justify-between items-center text-xl">
                <p>Price Before</p>
                <p className="w-32 text-lg text-center rounded-lg bg-[#e6f1fde5] text-[#031323a6] font-semibold p-4">
                  {level.PriceBefore} $
                </p>
              </div>
              <div className="flex justify-between items-center text-xl">
                <p>Price After</p>
                <p className="w-32 text-lg text-center rounded-lg bg-[var(--Input)] text-[var(--SubText)] font-semibold p-4">
                  {level.PriceAfter} $
                </p>
              </div>
              <div className="flex justify-between items-center text-xl">
                <p>Number of Sessions</p>
                <p className="w-32 text-lg text-center rounded-lg bg-[var(--Input)] text-[var(--SubText)] font-semibold p-4">
                  {level.SessionNo}
                </p>
              </div>
              <div className="flex justify-between items-center text-xl">
                <p>Duration</p>
                <p className="w-32 text-lg text-center rounded-lg bg-[var(--Input)] text-[var(--SubText)] font-semibold p-4">
                  {level.TotalTimeNo}
                </p>
              </div>
              <div className="flex justify-between items-center text-xl">
                <p>Sessions Per Week</p>
                <p className="w-32 text-lg text-center rounded-lg bg-[var(--Input)] text-[var(--SubText)] font-semibold p-4">
                  {level.SessionPerWeek}
                </p>
              </div>
              <div className="flex justify-between items-center text-xl">
                <p>Hours Per Session</p>
                <p className="w-32 text-lg text-center rounded-lg bg-[var(--Input)] text-[var(--SubText)] font-semibold p-4">
                  {level.Hours}
                </p>
              </div>
              <div className="flex justify-between items-center text-xl">
                <p>Schedule</p>
                <p className="w-32 text-lg text-center rounded-lg bg-[var(--Input)] text-[var(--SubText)] font-semibold p-4">
                  {level.ScheduleType}
                </p>
              </div>

              <div className="flex justify-between items-center text-xl my-8">
                <button onClick={() => { setLevelToDelete(level.id); setOpenModal(true); }}
                  className="px-8 py-2 rounded-xl border-2 border-[var(--Yellow)]">
                  Delete
                </button>
                <button onClick={() => navigate("/dash/courses/editcourse", { state: { courseId: level.id, levelId: level.id, tab: activeTab } })}
                  className="px-12 py-2 rounded-xl bg-[var(--Yellow)]">
                  Edit
                </button>
              </div>
            </article>
          ))}
      </section>

      {/* Delete Confirmation Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)} center classNames={{ modal: "rounded-2xl" }}>
        <h2 className="my-12">This action cannot be undone. Are you sure you want to delete?</h2>
        <div className="flex justify-end space-x-8 my-8">
          <button className="px-8 py-2 rounded-xl border-2 border-[#f5d019]" onClick={() => setOpenModal(false)}>
            Cancel
          </button>
          <button className="px-8 py-2 rounded-xl bg-[#f5d019]" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal open={openSuccessModal} onClose={() => setOpenSuccessModal(false)} center classNames={{ modal: "rounded-2xl" }}>
        <h2 className="my-12">Successfully deleted!</h2>
      </Modal>

      <div className="flex justify-end">
        <button onClick={() => navigate('/dash/courses/addcourse', { state: {tab: activeTab } })} className="px-20 py-4 rounded-xl text-2xl bg-[var(--Yellow)]">
          Add
        </button>
      </div>
    </main>
  );
}

export default CoursesPlans;
