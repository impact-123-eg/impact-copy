import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePostData from "@/hooks/curdsHook/usePostData";
import endPoints from "@/config/endPoints";
import { toast } from "react-hot-toast";

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().trim().required("Phone is required"),
  country: Yup.string().trim().required("Country is required"),
  packageId: Yup.string().required("Package is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .min(0, "Amount cannot be negative"),
  paidAt: Yup.date().nullable(),
  manualReference: Yup.string().trim().optional(),
  recordedBy: Yup.string().trim().optional(),
  method: Yup.string().trim().optional(),
});

export default function ManualPayment() {
  const navigate = useNavigate();

  const { data: packagesRes } = useGetData({
    url: endPoints.packages,
    queryKeys: ["packages"],
  });
  const packages = packagesRes?.data || [];

  const { mutate, isPending } = usePostData(
    `${endPoints.bookings}manual`,
    ["createManualPayment"],
    ["bookings"]
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      country: "",
      packageId: "",
      amount: "",
      paidAt: "",
      manualReference: "",
      recordedBy: "",
      method: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim(),
        country: values.country.trim(),
        packageId: values.packageId,
        amount: Number(values.amount),
        paidAt: values.paidAt
          ? new Date(values.paidAt).toISOString()
          : undefined,
        manualReference: values.manualReference || undefined,
        recordedBy: values.recordedBy || undefined,
        method: values.method || undefined,
      };

      mutate(
        { data: payload },
        {
          onSuccess: () => {
            toast.success("Manual payment recorded successfully");
            navigate("/dash/payment");
          },
          onError: (err) => {
            toast.error(
              err?.response?.data?.message || "Failed to record manual payment"
            );
          },
        }
      );
    },
  });

  return (
    <main className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl text-[var(--Main)]">
          Record Manual Payment
        </h1>
        <Link
          to="/dash/payment"
          className="px-4 py-2 border border-[var(--SubText)] text-[var(--SubText)] rounded-xl hover:bg-gray-100"
        >
          Back
        </Link>
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-6 rounded-2xl shadow space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full bg-[var(--Input)] py-3 px-4 rounded-xl border ${
                formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : "border-transparent"
              }`}
              placeholder="Customer name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.name}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full bg-[var(--Input)] py-3 px-4 rounded-xl border ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-transparent"
              }`}
              placeholder="customer@example.com"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Phone
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full bg-[var(--Input)] py-3 px-4 rounded-xl border ${
                formik.touched.phoneNumber && formik.errors.phoneNumber
                  ? "border-red-500"
                  : "border-transparent"
              }`}
              placeholder="+2010..."
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.phoneNumber}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formik.values.country}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full bg-[var(--Input)] py-3 px-4 rounded-xl border ${
                formik.touched.country && formik.errors.country
                  ? "border-red-500"
                  : "border-transparent"
              }`}
              placeholder="EG"
            />
            {formik.touched.country && formik.errors.country && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.country}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Package
            </label>
            <select
              name="packageId"
              value={formik.values.packageId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full bg-[var(--Input)] py-3 px-4 rounded-xl border ${
                formik.touched.packageId && formik.errors.packageId
                  ? "border-red-500"
                  : "border-transparent"
              }`}
            >
              <option value="">Select a package</option>
              {packages?.map((pkg) => (
                <option key={pkg._id} value={pkg._id}>
                  {`${pkg.category?.name} — ${pkg.levelno} Level`} —{" "}
                  {pkg.priceAfter} USD
                </option>
              ))}
            </select>
            {formik.touched.packageId && formik.errors.packageId && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.packageId}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full bg-[var(--Input)] py-3 px-4 rounded-xl border ${
                formik.touched.amount && formik.errors.amount
                  ? "border-red-500"
                  : "border-transparent"
              }`}
              placeholder="Amount in EGP"
            />
            {formik.touched.amount && formik.errors.amount && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.amount}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Paid At (optional)
            </label>
            <input
              type="datetime-local"
              name="paidAt"
              value={formik.values.paidAt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Reference (optional)
            </label>
            <input
              type="text"
              name="manualReference"
              value={formik.values.manualReference}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent"
              placeholder="Invoice/Bank ref"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Recorded By (optional)
            </label>
            <input
              type="text"
              name="recordedBy"
              value={formik.values.recordedBy}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent"
              placeholder="admin@impact.com"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Payment Method
            </label>
            <select
              name="method"
              value={formik.values.method}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent"
            >
              <option value="">Select method</option>
              <option value="taptap_send">Taptap Send</option>
              <option value="bank_account">Bank Account</option>
              <option value="instapay">Instapay</option>
              <option value="vodafone_cash">Vodafone Cash</option>
              <option value="western">Western</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            to="/dash/payment"
            className="px-6 py-2 border border-[var(--SubText)] text-[var(--SubText)] rounded-xl hover:bg-gray-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 bg-[var(--Yellow)] hover:bg-opacity-90 transition-colors rounded-xl disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save Manual Payment"}
          </button>
        </div>
      </form>
    </main>
  );
}
