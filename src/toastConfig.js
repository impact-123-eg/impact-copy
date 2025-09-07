// toastConfig.js
export const toastOptions = {
  // Default options for all toasts
  duration: 3000,
  position: "top-center",

  // Style applied to all toasts
  style: {
    fontSize: "14px",
    fontWeight: "500",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },

  // Success toast
  success: {
    duration: 3000,
    iconTheme: {
      primary: "#f5d019", // Your primary yellow color
      secondary: "#000", // Black text for better contrast on yellow
    },
    style: {
      background: "#fefce8", // Very light yellow background (like yellow-50)
      color: "#854d0e", // Dark yellow/brown text for good readability
      border: "1px solid #f5d019", // Your primary yellow border
    },
  },

  // Error toast
  error: {
    duration: 3000,
    iconTheme: {
      primary: "#ef4444", // Your error color
      secondary: "#fff",
    },
    style: {
      background: "#fef2f2", // Light error background
      color: "#b91c1c", // Error text color
      border: "1px solid #fecaca", // Error border
    },
  },

  // Loading toast
  loading: {
    iconTheme: {
      primary: "#3b82f6", // Your loading color
      secondary: "#fff",
    },
    style: {
      background: "#eff6ff", // Light loading background
      color: "#1e40af", // Loading text color
      border: "1px solid #bfdbfe", // Loading border
    },
  },
};
