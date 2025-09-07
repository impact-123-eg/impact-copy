import React from "react";
import AdminProfile from "../../Components/dashboard/AdminProfile";
import { Link, Navigate } from "react-router-dom";
import { useGetAllEmployees } from "@/hooks/Actions/users/useCurdsUsers";
import Employee from "@/Components/dashboard/Employee";
import { useAuth } from "@/context/AuthContext";

function Settings() {
  const { data: empData } = useGetAllEmployees();
  const { user } = useAuth();
  const employees =
    empData?.data?.data?.filter((emp) => emp._id !== user.id) || [];

  return (
    <main className="space-y-8">
      {/* Header Section */}
      <div className="pb-2 border-b border-gray-200">
        <h1 className="font-bold text-3xl text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account and team members
        </p>
      </div>

      {/* Profile Section */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="mb-5 pb-2 border-b border-gray-100">
          <h3 className="font-bold text-xl text-gray-800">
            Profile Information
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Update your personal details
          </p>
        </div>
        <AdminProfile />
      </section>

      {/* Employees Section */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-xl text-gray-800">Team Members</h3>
            <p className="text-gray-600 text-sm mt-1">
              {employees.length} employee{employees.length !== 1 ? "s" : ""} in
              your team
            </p>
          </div>
          <Link
            onClick={() => window.scroll(0, 0)}
            to="/dash/settings/add-employee"
            className="px-5 py-3 rounded-xl bg-[var(--Yellow)] text-white font-medium hover:opacity-90 transition-opacity duration-200 shadow-sm hover:shadow-md"
          >
            Add New Employee
          </Link>
        </div>

        {/* Employees List */}
        <div className="space-y-4">
          {employees.length > 0 ? (
            employees.map((emp) => (
              <Employee key={emp._id} employee={emp} onDelete="" />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No employees yet</p>
              <p className="text-sm mt-1">
                Add your first team member to get started
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Settings;
