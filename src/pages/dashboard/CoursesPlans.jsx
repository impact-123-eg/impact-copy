import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useDeletepackage,
  useGetAllpackages,
} from "@/hooks/Actions/packages/usePackageCruds";
import ConfirmModal from "@/Components/ConfirmModal";
import { useGetAllcategories } from "@/hooks/Actions/categories/useCategoryCruds";
import formatDuration from "@/utilities/formatDuration";

function CoursesPlans() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [levelToDelete, setLevelToDelete] = useState(null);

  const { data: coursesRes } = useGetAllpackages();
  const courses = coursesRes?.data || [];
  const { mutate: mutateDeleteCourse } = useDeletepackage();
  const { data: catData } = useGetAllcategories();
  const categories = catData?.data || [];

  const defaultTabs = ["General English", "Business English"];
  // Merge default tabs with categories from DB, ensuring no duplicates and maintaining order
  const tabs = [
    ...defaultTabs,
    ...categories
      .map((cat) => cat.name)
      .filter((name) => !defaultTabs.includes(name)),
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);

  // Find the category object for the active tab if it exists
  const activeCategory = categories.find((cat) => cat.name === activeTab);

  const tabCourses = courses.filter(
    (course) => course?.category?.name === activeTab
  );

  const handleDelete = (id) => {
    console.log(levelToDelete);

    if (!id) {
      console.error("id is undefined or null");
      return;
    }
    mutateDeleteCourse(
      { id },
      {
        onSuccess: () => {
          setOpenModal(false);
          setLevelToDelete(null);
        },
      }
    );
  };

  return (
    <main className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">Courses And Plans</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/dash/categories")}
            className="px-6 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Manage Categories
          </button>
          <button
            onClick={() => navigate("/dash/courses/addcourse")}
            className="px-6 py-3 rounded-xl bg-[var(--Yellow)] hover:bg-opacity-90 transition-colors"
          >
            Add New Package
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <section className="flex justify-start space-x-4 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold text-lg rounded-t-lg transition-colors ${activeTab === tab
              ? "bg-[var(--Yellow)] text-gray-800"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {tab}
          </button>
        ))}
      </section>

      {/* Empty State */}
      {tabCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-gradient-to-b from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No Packages Found
          </h3>
          <p className="text-gray-500 text-center max-w-md mb-8">
            There are currently no packages available for the{" "}
            <span className="font-semibold text-gray-700">{activeTab}</span>{" "}
            category. Start by adding your first package or managing categories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {!activeCategory && (
              <button
                onClick={() => navigate("/dash/categories/add-category")}
                className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
              >
                Create "{activeTab}" Category
              </button>
            )}
            <button
              onClick={() => navigate("/dash/courses/addcourse")}
              className="px-8 py-3 rounded-xl bg-[var(--Yellow)] text-gray-900 font-semibold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-yellow-100"
            >
              Add First Package
            </button>
          </div>
        </div>
      )}

      {/* Course Levels Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tabCourses.map((level) => (
          <article
            key={level._id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            {/* Package Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h2 className="text-2xl font-semibold text-gray-800">
                {level.levelno} {level.levelno < 2 ? "Level" : "Levels"}
              </h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {level.scheduleType}
              </span>
            </div>

            {/* Package Details */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">
                  Original Price
                </span>
                <span className="text-lg font-semibold text-gray-800 line-through">
                  ${level.priceBefore}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">
                  Discounted Price
                </span>
                <span className="text-xl font-bold text-green-600">
                  ${level.priceAfter}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="block text-gray-500 font-medium">
                    Sessions
                  </span>
                  <span className="block font-semibold">{level.sessionNo}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="block text-gray-500 font-medium">
                    Duration
                  </span>
                  <span className="block font-semibold">
                    {formatDuration(level.totalTimeInWeeks)}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="block text-gray-500 font-medium">
                    Sessions/Week
                  </span>
                  <span className="block font-semibold">
                    {typeof level.sessionPerWeek === "object"
                      ? `${level.sessionPerWeek.count}`
                      : level.sessionPerWeek}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="block text-gray-500 font-medium">
                    Hours/Session
                  </span>
                  <span className="block font-semibold">{level.hours} h</span>
                </div>
              </div>

              {/* Students Capacity */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <span className="block text-blue-700 font-medium">
                  Student Capacity
                </span>
                <span className="block font-semibold">
                  {level.studentNo || "Not specified"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setLevelToDelete(level._id);
                  console.log(levelToDelete);
                  setOpenModal(true);
                }}
                className="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() =>
                  navigate(`/dash/courses/editcourse/${level._id}`)
                }
                className="px-6 py-2 rounded-lg bg-[var(--Yellow)] hover:bg-opacity-90 transition-colors"
              >
                Edit
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={() => handleDelete(levelToDelete)}
        title="Confirm Deletion"
        description="This action cannot be undone. Are you sure you want to delete?"
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
      />
      {/* <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        center
        classNames={{ modal: "rounded-2xl" }}
      >
        <h2 className="my-12">
          This action cannot be undone. Are you sure you want to delete?
        </h2>
        <div className="flex justify-end space-x-8 my-8">
          <button
            className="px-8 py-2 rounded-xl border-2 border-[#f5d019]"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </button>
          <button
            className="px-8 py-2 rounded-xl bg-[#f5d019]"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </Modal> */}

      {/* <div className="flex justify-end">
        <button
          onClick={() => navigate("/dash/courses/addcourse")}
          className="px-20 py-4 rounded-xl text-2xl bg-[var(--Yellow)]"
        >
          Add
        </button>
      </div> */}
    </main>
  );
}

export default CoursesPlans;
