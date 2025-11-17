import React, { useState } from "react";
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
    <>
      <tr className="border-b border-[var(--SubTextBorder)] hover:bg-gray-50">
        <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap max-w-[220px] overflow-hidden text-ellipsis">{employee?.name}</td>
        <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap max-w-[180px] overflow-hidden text-ellipsis">{employee?.phoneNumber}</td>
        <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap max-w-[160px] overflow-hidden text-ellipsis">{employee?.role}</td>
        <td className="px-4 py-3 text-right align-middle">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={editAdminInfo}
              className="px-4 py-2 rounded-xl border-2 border-[var(--Yellow)]"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setOpenModal(true)}
              className="px-4 py-2 rounded-xl bg-[var(--Yellow)] text-white"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>

      {/* Confirm Deletion Modal */}
      <ConfirmModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleDeleteClick}
        title="Confirm Deletion"
        description="This action cannot be undone. Are you sure you want to delete?"
        confirmText="Delete"
      />
    </>
  );
};

export default Employee;
