import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  description = "This action cannot be undone. Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "yellow", // 'red' or 'yellow'
  icon = "delete", // 'warning', 'delete', 'info', 'success'
}) => {
  // Icon configuration
  const getIcon = () => {
    switch (icon) {
      case "delete":
        return (
          <svg
            className="w-8 h-8 text-var(--Yellow)"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        );
      case "success":
        return (
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "info":
        return (
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "warning":
      default:
        return (
          <svg
            className="w-8 h-8 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
    }
  };

  // Button color based on prop
  const getConfirmButtonClass = () => {
    if (confirmColor === "yellow") {
      return "bg-[var(--Yellow)] text-black hover:bg-opacity-90";
    }
    return "bg-red-600 text-white hover:bg-red-700";
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      center
      classNames={{
        modal: "rounded-2xl p-6 max-w-md w-full mx-4",
        overlay: "bg-black bg-opacity-50",
        closeButton: "top-4 right-4",
      }}
      closeIcon={
        <svg
          className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      }
    >
      {/* Icon Section */}
      <div className="text-center mb-4">
        <div
          className={`w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          {getIcon()}
        </div>
      </div>

      {/* Content Section */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          type="button"
          className="px-6 py-3 rounded-xl border-2 border-[var(--Yellow)] text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose?.();
          }}
        >
          {cancelText}
        </button>
        <button
          type="button"
          className={`px-6 py-3 rounded-xl transition-colors duration-200 font-medium ${getConfirmButtonClass()}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onConfirm?.();
          }}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
