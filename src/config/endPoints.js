const endPoints = {
  login: "/auth/login/",
  register: "/auth/register/",
  forgotPassword: "/auth/forgot-password/",
  resetPassword: "/auth/reset-password/",
  updatePassword: "/auth/update-password/",
  verifyOTP: "/auth/verify-otp/",
  resendOTP: "/auth/resend-otp/",
  userProfile: "/auth/me",
  updateMe: "/users/profile",
  history: "/users/history",

  allEmployees: "users/employees/",
  allStudents: "users/students/",
  users: "users/",

  packages: "/packages/",
  packagesByCategory: "/packages/category/",
  categories: "/categories/",
  availabilities: "/availability/",
  bookings: "/bookings/",
  //Admin
  freeSessionSlots: "/free-session-slots",
  freeSessionSlotByDate: "/free-session-slots/by-date",
  freeSessionSlotByDateForAdmin: "/free-session-slots/admin/by-date",
  freeSessionAvailableDays: "/free-session-slots/available-days",
  moveFreeSessionBooking: "/free-session-groups/move-booking",
  updateGroupTeacher: "/free-session-groups/update-teacher",
  autoAssignInstructors: "/free-session-groups/auto-assign",
  cancelFreeSessionBooking: "/free-session-bookings",
  dashboard: "/dashboard/",

  //User
  getFreeSessionSlots: "/free-session-slots/upcoming?days=14",
  freeSessionBookings: "/free-session-bookings",
  createPayment: "/payments/create-booking",
  paymentStatus: "/payments/status/",

  startTest: "freetests/start/",
  submitTest: "freetests/submit/",
  getTest: "freetests/",
  bulkReassign: "/free-session-bookings/bulk-reassign",
  suggestAgents: "/free-session-bookings/suggest-agents",
  // Admin User Management
  adminAllUsers: "users/admin/all",
  addUserNote: "users/admin/add-note",
  toggleSubscription: "users/admin/toggle-subscription",

  // Roles
  roles: "roles/",
};

export default endPoints;
