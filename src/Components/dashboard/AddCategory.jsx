import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useI18n } from "@/hooks/useI18n";
import {
  useAddCategory,
  useGetcategoryById,
  useUpdateCategory,
} from "@/hooks/Actions/categories/useCategoryCruds";
import { categorySchema } from "@/Validation";

// Updated validation schema with new fields

function AddCategory() {
  const { t } = useI18n();
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
        hoursPerSession: editedCategory?.hoursPerSession || "",
        sessionsPerWeek: editedCategory?.sessionsPerWeek || "",
        scheduleType: editedCategory?.scheduleType || "24/7",
        studentNo: editedCategory?.studentNo || "",
        sessionType: editedCategory?.sessionType || "online",
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
      hoursPerSession: "",
      sessionsPerWeek: "",
      scheduleType: "24/7",
      studentNo: "",
      sessionType: "online",
      enTitle: "",
      enDescription: "",
      arTitle: "",
      arDescription: "",
    },
    validationSchema: categorySchema(t),
    onSubmit: (values) => {
      const categoryData = {
        name: values.name,
        hoursPerSession: parseFloat(values.hoursPerSession),
        sessionsPerWeek: values.sessionsPerWeek,
        scheduleType: values.scheduleType,
        studentNo: values.studentNo,
        sessionType: values.sessionType,
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
    enableReinitialize: true,
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
        {/* Category Details Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              Category Details
            </h3>

            <div className="space-y-2">
              <label className="font-medium">Category Name *</label>
              <input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., IELTS, Group, Private"
                className={`w-full bg-[var(--Input)] py-2 px-4 rounded-lg border ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500"
                    : "border-transparent"
                }`}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-sm">{formik.errors.name}</div>
              )}
            </div>

            <div className="space-y-2">
              <label className="font-medium">Hours Per Session *</label>
              <input
                name="hoursPerSession"
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                value={formik.values.hoursPerSession}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full bg-[var(--Input)] py-2 px-4 rounded-lg border ${
                  formik.touched.hoursPerSession &&
                  formik.errors.hoursPerSession
                    ? "border-red-500"
                    : "border-transparent"
                }`}
              />
              {formik.touched.hoursPerSession &&
                formik.errors.hoursPerSession && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.hoursPerSession}
                  </div>
                )}
            </div>

            <div className="space-y-2">
              <label className="font-medium">Student Capacity *</label>
              <input
                name="studentNo"
                value={formik.values.studentNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., 1-5, 10-15, 20+"
                className={`w-full bg-[var(--Input)] py-2 px-4 rounded-lg border ${
                  formik.touched.studentNo && formik.errors.studentNo
                    ? "border-red-500"
                    : "border-transparent"
                }`}
              />
              {formik.touched.studentNo && formik.errors.studentNo && (
                <div className="text-red-500 text-sm">
                  {formik.errors.studentNo}
                </div>
              )}
            </div>
          </div>

          {/* Schedule & Session Type */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              Schedule & Type
            </h3>

            <div className="space-y-2">
              <label className="font-medium">Schedule Type *</label>
              <select
                name="scheduleType"
                value={formik.values.scheduleType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full bg-[var(--Input)] py-2 px-4 rounded-lg border ${
                  formik.touched.scheduleType && formik.errors.scheduleType
                    ? "border-red-500"
                    : "border-transparent"
                }`}
              >
                <option value="24/7">All Day (24/7)</option>
                <option value="morning">Morning</option>
                <option value="night">Night</option>
              </select>
              {formik.touched.scheduleType && formik.errors.scheduleType && (
                <div className="text-red-500 text-sm">
                  {formik.errors.scheduleType}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="font-medium">Session Type *</label>
              <select
                name="sessionType"
                value={formik.values.sessionType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full bg-[var(--Input)] py-2 px-4 rounded-lg border ${
                  formik.touched.sessionType && formik.errors.sessionType
                    ? "border-red-500"
                    : "border-transparent"
                }`}
              >
                <option value="online">Online</option>
                <option value="recorded">Recorded</option>
                <option value="both">Both (Online & Recorded)</option>
              </select>
              {formik.touched.sessionType && formik.errors.sessionType && (
                <div className="text-red-500 text-sm">
                  {formik.errors.sessionType}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="font-medium">Sessions Per Week *</label>
              <input
                name="sessionsPerWeek"
                value={formik.values.sessionsPerWeek}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., 2-3, 4, 5+"
                className={`w-full bg-[var(--Input)] py-2 px-4 rounded-lg border ${
                  formik.touched.sessionsPerWeek &&
                  formik.errors.sessionsPerWeek
                    ? "border-red-500"
                    : "border-transparent"
                }`}
              />
              {formik.touched.sessionsPerWeek &&
                formik.errors.sessionsPerWeek && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.sessionsPerWeek}
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Language Content Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* English Content */}
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
