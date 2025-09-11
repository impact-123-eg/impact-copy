import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useDeleteCategory,
  useGetAllcategories,
} from "@/hooks/Actions/categories/useCategoryCruds";
import ConfirmModal from "@/Components/ConfirmModal";
import { FaArrowLeft } from "react-icons/fa";

function CategoryManagement() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const { data: categoriesRes, isLoading, refetch } = useGetAllcategories();
  const categories = categoriesRes?.data || [];
  const { mutate: mutateDeleteCategory } = useDeleteCategory();

  const handleDelete = (id) => {
    if (!id) {
      console.error("id is undefined or null");
      return;
    }
    mutateDeleteCategory(
      { id: id },
      {
        onSuccess: () => {
          setOpenModal(false);
          setCategoryToDelete(null);
          refetch();
        },
      }
    );
  };

  if (isLoading) {
    return (
      <main className="space-y-6">
        <h1 className="font-bold text-2xl">Category Management</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--Yellow)]"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="font-bold text-2xl">Category Management</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => navigate("/dash/courses/")}
            className="px-6 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <FaArrowLeft className="inline-block mr-2" /> Back To Plans
          </button>
          <button
            onClick={() => navigate("/dash/categories/add-category")}
            className="px-6 py-2 rounded-xl bg-[var(--Yellow)] hover:bg-opacity-90 transition-colors whitespace-nowrap"
          >
            Add New Category
          </button>
        </div>
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Categories Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Get started by creating your first course category.
            </p>
          </>

          <button
            onClick={() => navigate("/dash/categories/add-category")}
            className="px-6 py-2 rounded-xl bg-[var(--Yellow)] hover:bg-opacity-90 transition-colors"
          >
            Create First Category
          </button>
        </div>
      )}

      {/* Categories Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <article
            key={category._id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            {/* Category Header */}
            <div className="flex justify-between items-center mb-4 pb-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800 capitalize">
                {category.name}
              </h2>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  category.sessionType === "online"
                    ? "bg-[var(--Yellow)] text-black"
                    : "bg-blue-600 text-gray-100"
                }`}
              >
                {category.sessionType === "online" ? "Online" : "Recorded"}
              </span>
            </div>

            {/* English Content */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                English
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="block text-sm text-gray-600">Title:</span>
                  <span className="block font-medium">{category.en.title}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-600">
                    Description:
                  </span>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {category.en.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Arabic Content */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                العربية
              </h3>
              <div className="space-y-2" dir="rtl">
                <div>
                  <span className="block text-sm text-gray-600">العنوان:</span>
                  <span className="block font-medium">{category.ar.title}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-600">الوصف:</span>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {category.ar.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <span className="block text-2xl font-bold text-blue-600">
                  {category.packageCount || 0}
                </span>
                <span className="block text-xs text-blue-500">Packages</span>
              </div>
            </div> */}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <button
                onClick={() => {
                  setCategoryToDelete(category._id);
                  setOpenModal(true);
                }}
                className="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors text-sm"
              >
                Delete
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    navigate(`/dash/categories/edit-category/${category._id}`)
                  }
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors text-sm"
                >
                  Edit
                </button>
                {/* <button
                  onClick={() =>
                    navigate(`/dash/courses?category=${category._id}`)
                  }
                  className="px-4 py-2 rounded-lg bg-[var(--Yellow)] hover:bg-opacity-90 transition-colors text-sm"
                >
                  View Packages
                </button> */}
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={() => handleDelete(categoryToDelete)}
        title="Confirm Category Deletion"
        description="This will permanently delete the category and all associated packages. This action cannot be undone."
        confirmText="Delete Category"
        cancelText="Cancel"
        type="delete"
      />

      {/* Add Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button
          onClick={() => navigate("/dash/categories/add-category")}
          className="w-14 h-14 rounded-full bg-[var(--Yellow)] shadow-lg flex items-center justify-center hover:bg-opacity-90 transition-colors"
        >
          <span className="text-2xl">+</span>
        </button>
      </div>
    </main>
  );
}

export default CategoryManagement;
