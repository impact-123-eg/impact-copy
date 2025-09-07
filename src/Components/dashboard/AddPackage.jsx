import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { packageValidationSchema } from "@/Validation";
import {
  useAddpackage,
  useGetpackageById,
  useUpdatepackage,
} from "@/hooks/Actions/packages/usePackageCruds";
import { useGetAllcategories } from "@/hooks/Actions/categories/useCategoryCruds";

// Validation Schema

function AddPackage() {
  const navigate = useNavigate();
  const { id: packageId } = useParams();
  const [mode, setMode] = useState(packageId ? "edit" : "add");

  const { mutate: mutateAddPackage, isPending } = useAddpackage();
  const { mutate: mutateUpdatePackage, isPending: isUpdating } =
    useUpdatepackage();
  const { data: categoryData } = useGetAllcategories();
  const categories = categoryData?.data || [];
  const { data: packData } = useGetpackageById({
    packageId,
    enabled: mode === "edit" && !!packageId,
  });
  const packDetails = packData?.data?.data || {};

  useEffect(() => {
    if (mode === "edit" && packageId) {
      // Fetch package details for editing
      formik.setValues({
        category: packDetails.category || "",
        levelno: packDetails.levelno || null,
        priceBefore: packDetails.priceBefore || null,
        priceAfter: packDetails.priceAfter || null,
        duration: packDetails.duration || null,
        durationUnit: packDetails.durationUnit || null,
        sessionNo: packDetails.sessionNo || null,
        sessionPerWeek: packDetails.sessionPerWeek || "",
        hours: packDetails.hours || null,
        scheduleType: packDetails.scheduleType || "",
        studentNo: packDetails.studentNo || "",
      });
    }
  }, [packageId]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      category: "",

      // Package fields
      levelno: null,
      priceBefore: null,
      priceAfter: null,
      duration: null,
      durationUnit: null,
      sessionNo: null,
      sessionPerWeek: "",
      hours: null,
      scheduleType: "",
      studentNo: "",
    },
    validationSchema: packageValidationSchema,
    onSubmit: (values) => {
      if (mode === "edit") {
        handleUpdatePackage(values);
      } else {
        handleAddPackage(values);
      }
    },
  });

  const handleAddPackage = async (values) => {
    const packageObject = {
      category: values.category, // REQUIRED: Category ID
      levelno: parseInt(values.levelno),
      priceBefore: parseFloat(values.priceBefore),
      priceAfter: parseFloat(values.priceAfter),
      duration: parseInt(values.duration),
      totalTimeInWeeks: values.duration * values.durationUnit, // Convert to weeks
      sessionNo: parseInt(values.sessionNo),
      sessionPerWeek: values.sessionPerWeek,
      hours: parseFloat(values.hours),
      scheduleType: values.scheduleType,
      studentNo: values.studentNo,
    };

    mutateAddPackage(
      { data: packageObject },
      {
        onSuccess: () => {
          navigate("/dash/courses");
        },
        onError: (error) => {
          console.error("Failed to add package:", error);
        },
      }
    );
  };

  const handleUpdatePackage = async (values) => {
    const packageObject = {
      category: values.category,
      levelno: parseInt(values.levelno),
      priceBefore: parseFloat(values.priceBefore),
      priceAfter: parseFloat(values.priceAfter),
      duration: parseInt(values.duration),
      totalTimeInWeeks: values.duration * values.durationUnit, // Convert to weeks
      sessionNo: parseInt(values.sessionNo),
      sessionPerWeek: values.sessionPerWeek,
      hours: parseFloat(values.hours),
      scheduleType: values.scheduleType,
      studentNo: values.studentNo,
    };

    mutateUpdatePackage(
      { id: packageId, data: packageObject },
      {
        onSuccess: () => {
          navigate("/dash/courses");
        },
        onError: (error) => {
          console.error("Failed to update package:", error);
        },
      }
    );
  };

  return (
    <main className="space-y-10">
      <h1 className="font-bold text-2xl">
        {mode === "edit" ? "Edit Plan" : "Add New Plan"}
      </h1>

      <form className="space-y-10" onSubmit={formik.handleSubmit}>
        <section className="grid grid-cols-2 gap-x-8 gap-y-6">
          <article className="space-y-2 ">
            <h3 className="font-bold text-lg">Category</h3>
            <select
              name="category"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.category}
              className={`w-full bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg border ${
                formik.touched.category && formik.errors.category
                  ? "border-red-500"
                  : "border-transparent"
              }`}
              required
            >
              <option value="">Select a Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {formik.touched.category && formik.errors.category && (
              <div className="text-red-500 text-sm">
                {formik.errors.category}
              </div>
            )}
          </article>

          <article className="space-y-2">
            <h3 className="font-bold text-lg">Student Capacity</h3>
            <input
              name="studentNo"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.studentNo}
              placeholder="e.g., 1-5"
              className={`w-full bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg border ${
                formik.touched.studentNo && formik.errors.studentNo
                  ? "border-red-500"
                  : "border-transparent"
              }`}
              required
            />
            {formik.touched.studentNo && formik.errors.studentNo && (
              <div className="text-red-500 text-sm">
                {formik.errors.studentNo}
              </div>
            )}
          </article>

          <article className="space-y-2">
            <h3 className="font-bold text-lg">Price Before (USD)</h3>
            <input
              name="priceBefore"
              type="number"
              min="0"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.priceBefore}
              className={`w-full bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg border ${
                formik.touched.priceBefore && formik.errors.priceBefore
                  ? "border-red-500"
                  : "border-transparent"
              }`}
            />
            {formik.touched.priceBefore && formik.errors.priceBefore && (
              <div className="text-red-500 text-sm">
                {formik.errors.priceBefore}
              </div>
            )}
          </article>

          <article className="space-y-2">
            <h3 className="font-bold text-lg">Price After (USD)</h3>
            <input
              name="priceAfter"
              type="number"
              min="0"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.priceAfter}
              className={`w-full bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg border ${
                formik.touched.priceAfter && formik.errors.priceAfter
                  ? "border-red-500"
                  : "border-transparent"
              }`}
              required
            />
            {formik.touched.priceAfter && formik.errors.priceAfter && (
              <div className="text-red-500 text-sm">
                {formik.errors.priceAfter}
              </div>
            )}
          </article>

          <article className="space-y-2">
            <h3 className="font-bold text-lg">Number Of Levels</h3>
            <input
              name="levelno"
              type="number"
              min="0"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.levelno}
              className={`w-full bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg border ${
                formik.touched.levelno && formik.errors.levelno
                  ? "border-red-500"
                  : "border-transparent"
              }`}
              required
            />
            {formik.touched.levelno && formik.errors.levelno && (
              <div className="text-red-500 text-sm">
                {formik.errors.levelno}
              </div>
            )}
          </article>

          <article className="space-y-2">
            <h3 className="font-bold text-lg">Number of Sessions</h3>
            <input
              name="sessionNo"
              type="number"
              min="0"
              placeholder="e.g., 2/3"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.sessionNo}
              className={`w-full bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg border ${
                formik.touched.sessionNo && formik.errors.sessionNo
                  ? "border-red-500"
                  : "border-transparent"
              }`}
              required
            />
            {formik.touched.sessionNo && formik.errors.sessionNo && (
              <div className="text-red-500 text-sm">
                {formik.errors.sessionNo}
              </div>
            )}
          </article>

          <article className="space-y-2">
            <h3 className="font-bold text-lg">Duration</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                min="0"
                name="duration"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.duration}
                className={`bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg border ${
                  formik.touched.duration && formik.errors.duration
                    ? "border-red-500"
                    : "border-transparent"
                }`}
              />

              <select
                name="durationUnit"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.durationUnit}
                className={`bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg border ${
                  formik.touched.durationUnit && formik.errors.durationUnit
                    ? "border-red-500"
                    : "border-transparent"
                }`}
              >
                <option value={1}>Week</option>
                <option value={4}>Month</option>
              </select>
            </div>
            {formik.touched.duration && formik.errors.duration && (
              <div className="text-red-500 text-sm">
                {formik.errors.duration}
              </div>
            )}
          </article>

          <article className="space-y-2">
            <h3 className="font-bold text-lg">Sessions Per Week</h3>
            <input
              name="sessionPerWeek"
              type="text"
              placeholder="e.g., 2/3"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.sessionPerWeek}
              className={`w-full bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg border ${
                formik.touched.sessionPerWeek && formik.errors.sessionPerWeek
                  ? "border-red-500"
                  : "border-transparent"
              }`}
              required
            />
            {formik.touched.sessionPerWeek && formik.errors.sessionPerWeek && (
              <div className="text-red-500 text-sm">
                {formik.errors.sessionPerWeek}
              </div>
            )}
          </article>

          <article className="space-y-2">
            <h3 className="font-bold text-lg">Hours Per Session</h3>
            <input
              name="hours"
              type="number"
              min="0"
              step={0.5}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.hours}
              className={`w-full bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg border ${
                formik.touched.hours && formik.errors.hours
                  ? "border-red-500"
                  : "border-transparent"
              }`}
              required
            />
            {formik.touched.hours && formik.errors.hours && (
              <div className="text-red-500 text-sm">{formik.errors.hours}</div>
            )}
          </article>

          <article className="space-y-2">
            <h3 className="font-bold text-lg">Schedule Type</h3>
            <select
              name="scheduleType"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.scheduleType}
              className={`w-full bg-[var(--Input)] focus:outline-none py-2 px-4 rounded-lg border ${
                formik.touched.scheduleType && formik.errors.scheduleType
                  ? "border-red-500"
                  : "border-transparent"
              }`}
              required
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
          </article>
        </section>

        <div className="flex justify-between items-center text-xl">
          <button
            type="button"
            onClick={() => navigate("/dash/courses")}
            className="px-20 py-4 shadow-md rounded-xl border-2 border-[var(--Yellow)] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-20 py-4 shadow-md rounded-xl bg-[var(--Yellow)] hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            {formik.isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddPackage;
