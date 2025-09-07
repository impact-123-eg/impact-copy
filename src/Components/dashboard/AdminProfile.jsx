import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaEdit } from "react-icons/fa";
import { useAdmin } from "../../AdminContext";
import { useGetUserProfile } from "@/hooks/Actions/users/useCurdsUsers";
import { useNavigate } from "react-router-dom";

function AdminProfile() {
  const { data: userData } = useGetUserProfile();
  const admin = userData?.data?.user || {};
  const navigate = useNavigate();
  // const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleEditProfile = () => {
    navigate(`/dash/settings/update-employee/${admin._id}`);
  };

  return (
    <div className="relative">
      {/* Edit Button */}
      <button
        onClick={handleEditProfile}
        className="absolute -top-2 -right-2 bg-[var(--Yellow)] text-white p-3 rounded-full shadow-lg hover:bg-opacity-90 transition-colors duration-200 z-10"
        aria-label="Edit profile"
      >
        <FaEdit size={20} />
      </button>

      <article className="grid grid-cols-3 p-8 gap-x-12 gap-y-6 rounded-3xl bg-[var(--Light)] relative">
        <div className="w-full space-y-2">
          <h4 className="text-md text-[var(--SubText)]">Name</h4>
          <p className="text-2xl">{admin.name || "Not available"}</p>
        </div>
        <div className="w-full space-y-2">
          <h4 className="text-md text-[var(--SubText)]">Phone</h4>
          <p className="text-2xl">{admin.phoneNumber || "Not available"}</p>
        </div>
        <div className="w-full space-y-2">
          <h4 className="text-md text-[var(--SubText)]">Role</h4>
          <p className="text-2xl capitalize">{admin.role || "Not available"}</p>
        </div>
        <div className="w-full space-y-2">
          <h4 className="text-md text-[var(--SubText)]">Email</h4>
          <p className="text-2xl">{admin.email || "Not available"}</p>
        </div>
        {/* <div className="w-full space-y-2">
          <h4 className="text-md text-[var(--SubText)]">Password</h4>
          <div className="flex space-x-4 items-center">
            <p className="text-2xl">
              {isPasswordVisible ? admin.Password : "••••••••"}
            </p>
            <button
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="text-2xl"
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div> */}
      </article>
    </div>
  );
}

export default AdminProfile;
