import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";
import { userUpdateValidationSchema } from "@/Validation";
import {
  useGetEmployeeById,
  useUpdateUser,
  useGetAllEmployees,
} from "@/hooks/Actions/users/useCurdsUsers";

function EditAdmin() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: userData } = useGetEmployeeById(id);
  const user = userData?.data?.data;
  const { mutate: mutateUpdateUser, isPending } = useUpdateUser();
  const { data: employeesData } = useGetAllEmployees();

  const employees = employeesData?.data?.data || [];
  const teamLeaders = employees.filter(e => e.role === "team_leader");

  const [showPassword, setShowPassword] = useState(false);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "admin",
      shiftStart: "13:00",
      shiftEnd: "22:00",
      dailyLeadQuota: 10,
      teamId: "",
    },
    validationSchema: userUpdateValidationSchema,
    onSubmit: (values) => {
      handleUpdate(values);
    },
    enableReinitialize: true,
  });

  // Update form values when user data is available
  useEffect(() => {
    if (user) {
      formik.setValues({
        name: user.name || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        role: user.role || "admin",
        shiftStart: user.shiftStart || "13:00",
        shiftEnd: user.shiftEnd || "22:00",
        dailyLeadQuota: user.dailyLeadQuota || 10,
        teamId: user.teamId || "",
      });
    }
  }, [user]);

  const handleUpdate = (values) => {
    const updateData = {
      id: id,
      data: {
        name: values.name,
        email: values.email,
        phoneNumber: values.phone,
        ...(values.password && { password: values.password }),
        role: values.role,
        ...(values.role === "sales" && {
          shiftStart: values.shiftStart,
          shiftEnd: values.shiftEnd,
          dailyLeadQuota: values.dailyLeadQuota,
          teamId: values.teamId || null,
        }),
      },
    };

    //Update data with React Query
    mutateUpdateUser(updateData, {
      onSuccess: () => {
        navigate("/dash/settings");
      },
      onError: (error) => {
        console.error("Update failed:", error);
      },
    });
  };

  return (
    <main className="space-y-10">
      <h1 className="font-bold text-2xl">Settings</h1>

      <section className="space-y-6">
        <h2 className="font-semibold text-xl">Update Admin Details</h2>

        <form
          onSubmit={formik.handleSubmit}
          className="space-y-4 border-2 rounded-3xl p-10"
        >
          <article className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">Name</h4>
              <input
                id="name"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                placeholder="Ahmed Ali"
                type="text"
                className={`py-3 px-4 w-full rounded-lg bg-[var(--Input)] border ${formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : "border-transparent"
                  }`}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-sm">{formik.errors.name}</div>
              ) : null}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">Phone</h4>
              <input
                id="phone"
                name="phone"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                placeholder="0123456789"
                type="tel"
                className={`py-3 px-4 w-full rounded-lg bg-[var(--Input)] border ${formik.touched.phone && formik.errors.phone
                  ? "border-red-500"
                  : "border-transparent"
                  }`}
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.phone}
                </div>
              ) : null}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">Email</h4>
              <input
                id="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                placeholder="1234@gmail.com"
                type="email"
                className={`py-3 px-4 w-full rounded-lg bg-[var(--Input)] border ${formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-transparent"
                  }`}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            {/* Password Field - Consider making this optional for updates */}
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">Password</h4>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  placeholder="Enter new password (leave empty to keep current)"
                  type={showPassword ? "text" : "password"}
                  className={`py-3 px-4 w-full rounded-lg bg-[var(--Input)] border ${formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-transparent"
                    } pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.password}
                </div>
              ) : null}
              <p className="text-sm text-gray-500 mt-1">
                Leave password field empty to keep the current password
              </p>
            </div>

            {/* Role Field */}
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">Privilege</h4>
              <select
                id="role"
                name="role"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.role}
                className="py-3 px-4 w-full rounded-lg bg-[var(--Input)] cursor-pointer opacity-70"
              >
                <option value="admin">Admin</option>
                <option value="supervisor">Supervisor</option>
                <option value="instructor">Instructor</option>
                <option value="cs">Customer Service</option>
                <option value="sales">Sales Agent</option>
                <option value="team_leader">Team Leader</option>
                <option value="student">Student</option>
              </select>
            </div>

            {/* Sales Specific Fields */}
            {formik.values.role === "sales" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-[var(--Yellow)]">
                <div className="space-y-2">
                  <h4 className="font-semibold">Shift Start</h4>
                  <input
                    name="shiftStart"
                    type="time"
                    onChange={formik.handleChange}
                    value={formik.values.shiftStart}
                    className="py-3 px-4 w-full rounded-lg bg-white border border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Shift End</h4>
                  <input
                    name="shiftEnd"
                    type="time"
                    onChange={formik.handleChange}
                    value={formik.values.shiftEnd}
                    className="py-3 px-4 w-full rounded-lg bg-white border border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Daily Lead Quota</h4>
                  <input
                    name="dailyLeadQuota"
                    type="number"
                    onChange={formik.handleChange}
                    value={formik.values.dailyLeadQuota}
                    className="py-3 px-4 w-full rounded-lg bg-white border border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Team Leader</h4>
                  <select
                    name="teamId"
                    onChange={formik.handleChange}
                    value={formik.values.teamId}
                    className="py-3 px-4 w-full rounded-lg bg-white border border-gray-200"
                  >
                    <option value="">No Team Leader</option>
                    {teamLeaders.map(tl => (
                      <option key={tl._id} value={tl._id}>{tl.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </article>

          {/* Buttons */}
          <article className="flex justify-between items-center text-xl pt-6">
            <button
              type="button"
              onClick={() => navigate("/dash/settings")}
              className="py-3 px-12 text-xl rounded-2xl border-2 border-[var(--Yellow)] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formik.isValid || isPending}
              className="py-3 px-12 text-xl rounded-2xl bg-[var(--Yellow)] hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </article>
        </form>
      </section>
    </main>
  );
}

export default EditAdmin;
