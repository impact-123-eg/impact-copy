import React, { useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../ConfirmModal";
import { useDeleteUser } from "@/hooks/Actions/users/useCurdsUsers";

const Employee = ({ employee, onDelete }) => {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const { mutate: mutateDeleteEmployee } = useDeleteUser();

  const editAdminInfo = () => {
    navigate(`/dash/settings/update-employee/${employee._id}`);
    window.scroll(0, 0);
  };

  const handleDeleteClick = () => {
    mutateDeleteEmployee({ id: employee._id });
    setOpenModal(false);
    window.scroll(0, 0);
  };

  return (
    <article className="border-2 border-[var(--SubTextBorder)] grid grid-cols-4 p-4 rounded-2xl">
      <div className="w-full space-y-2 flex-col items-center">
        <h4 className="text-md text-[var(--SubText)]">Name</h4>
        <p className="text-xl">{employee?.name}</p>
      </div>
      <div className="w-full space-y-2 flex-col items-center">
        <h4 className="text-md text-[var(--SubText)]">Phone</h4>
        <p className="text-xl">{employee?.phoneNumber}</p>
      </div>
      <div className="w-full space-y-2 flex-col items-center">
        <h4 className="text-md text-[var(--SubText)]">Role</h4>
        <p className="text-xl">{employee?.role}</p>
      </div>
      <div className="flex space-x-6 w-full">
        <button
          onClick={editAdminInfo}
          className="px-8 rounded-xl border-2 border-[var(--Yellow)]"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setOpenModal(true)}
          className="px-8 rounded-xl bg-[var(--Yellow)]"
        >
          Delete
        </button>
      </div>

      {/* Confirm Deletion Modal */}
      <ConfirmModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleDeleteClick}
        title="Confirm Deletion"
        description="This action cannot be undone. Are you sure you want to delete?"
        confirmText="Delete"
      />
    </article>
  );
};

export default Employee;
