import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useAddCategory,
  useGetcategoryById,
  useUpdateCategory,
} from "@/hooks/Actions/categories/useCategoryCruds";

const categorySchema = Yup.object({
  name: Yup.string().required("Category name is required"),
  enTitle: Yup.string().required("English title is required"),
  enDescription: Yup.string().required("English description is required"),
  arTitle: Yup.string().required("Arabic title is required"),
  arDescription: Yup.string().required("Arabic description is required"),
});

function AddCategory() {
  const navigate = useNavigate();
  const { id: categoryId } = useParams();
  const [mode, setMode] = useState(categoryId ? "edit" : "add");

  // Hooks for add and edit operations
  const { mutate: createCategory, isPending: isCreatePending } =
    useAddCategory();
  const { mutate: updateCategory, isPending: isUpdatePending } =
    useUpdateCategory();
  const { data: editCatData, isLoading: isEditLoading } = useGetcategoryById({
    id: categoryId,
    enabled: !!categoryId,
  });

  const editedCategory = editCatData?.data;
  const isPending = isCreatePending || isUpdatePending;

  // Set form values when editing
  useEffect(() => {
    if (editedCategory && mode === "edit") {
      formik.setValues({
        name: editedCategory?.name || "",
        enTitle: editedCategory?.en?.title || "",
        enDescription: editedCategory?.en?.description || "",
        arTitle: editedCategory?.ar?.title || "",
        arDescription: editedCategory?.ar?.description || "",
      });
    }
  }, [editedCategory, mode]);

  const formik = useFormik({
    initialValues: {
      name: "",
      enTitle: "",
      enDescription: "",
      arTitle: "",
      arDescription: "",
    },
    validationSchema: categorySchema,
    onSubmit: (values) => {
      const categoryData = {
        name: values.name,
        en: {
          title: values.enTitle,
          description: values.enDescription,
        },
        ar: {
          title: values.arTitle,
          description: values.arDescription,
        },
      };

      if (mode === "edit" && categoryId) {
        // Update existing category
        updateCategory(
          { id: categoryId, data: categoryData },
          {
            onSuccess: () => {
              navigate("/dash/categories");
            },
            onError: (error) => {
              console.error("Failed to update category:", error);
            },
          }
        );
      } else {
        // Create new category
        createCategory(
          { data: categoryData },
          {
            onSuccess: () => {
              navigate("/dash/categories");
            },
            onError: (error) => {
              console.error("Failed to create category:", error);
            },
          }
        );
      }
    },
    enableReinitialize: true, // Allow reinitialization when values change
  });

  // Show loading state while fetching category data for editing
  if (mode === "edit" && isEditLoading) {
    return (
      <main className="space-y-6 max-w-4xl mx-auto">
        <h1 className="font-bold text-2xl">Edit Category</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--Yellow)]"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6 max-w-4xl mx-auto">
      <h1 className="font-bold text-2xl">
        {mode === "edit" ? "Edit Category" : "Add New Category"}
      </h1>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Category Name */}
        <div className="space-y-2">
          <label className="font-semibold text-lg">Category Name *</label>
          <input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="e.g., IELTS, Group, Private"
            className={`w-full bg-[var(--Input)] py-3 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)] ${
              formik.touched.name && formik.errors.name
                ? "border-red-500"
                : "border-transparent"
            }`}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm">{formik.errors.name}</div>
          )}
        </div>

        {/* English Content */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              English Content
            </h3>
            <div className="space-y-2">
              <label className="font-medium">Title *</label>
              <input
                name="enTitle"
                value={formik.values.enTitle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full bg-[var(--Input)] py-2 px-4 rounded-lg border ${
                  formik.touched.enTitle && formik.errors.enTitle
                    ? "border-red-500"
                    : "border-transparent"
                }`}
              />
              {formik.touched.enTitle && formik.errors.enTitle && (
                <div className="text-red-500 text-sm">
                  {formik.errors.enTitle}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="font-medium">Description *</label>
              <textarea
                name="enDescription"
                value={formik.values.enDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
                className={`w-full bg-[var(--Input)] py-2 px-4 rounded-lg border ${
                  formik.touched.enDescription && formik.errors.enDescription
                    ? "border-red-500"
                    : "border-transparent"
                }`}
              />
              {formik.touched.enDescription && formik.errors.enDescription && (
                <div className="text-red-500 text-sm">
                  {formik.errors.enDescription}
                </div>
              )}
            </div>
          </div>

          {/* Arabic Content */}
          <div className="space-y-4" dir="rtl">
            <h3 className="font-semibold text-lg border-b pb-2">
              المحتوى العربي
            </h3>
            <div className="space-y-2">
              <label className="font-medium">العنوان *</label>
              <input
                name="arTitle"
                value={formik.values.arTitle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full bg-[var(--Input)] py-2 px-4 rounded-lg border ${
                  formik.touched.arTitle && formik.errors.arTitle
                    ? "border-red-500"
                    : "border-transparent"
                }`}
              />
              {formik.touched.arTitle && formik.errors.arTitle && (
                <div className="text-red-500 text-sm">
                  {formik.errors.arTitle}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="font-medium">الوصف *</label>
              <textarea
                name="arDescription"
                value={formik.values.arDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
                className={`w-full bg-[var(--Input)] py-2 px-4 rounded-lg border ${
                  formik.touched.arDescription && formik.errors.arDescription
                    ? "border-red-500"
                    : "border-transparent"
                }`}
              />
              {formik.touched.arDescription && formik.errors.arDescription && (
                <div className="text-red-500 text-sm">
                  {formik.errors.arDescription}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate("/dash/categories")}
            className="px-6 py-2 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending || !formik.isValid}
            className="px-6 py-2 rounded-xl bg-[var(--Yellow)] hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending
              ? mode === "edit"
                ? "Updating..."
                : "Creating..."
              : mode === "edit"
              ? "Update Category"
              : "Create Category"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddCategory;
