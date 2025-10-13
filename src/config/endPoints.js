const endPoints = {
  login: "/auth/login/",
  register: "/auth/register/",
  forgotPassword: "/auth/forgot-password/",
  resetPassword: "/auth/reset-password/",
  updatePassword: "/auth/update-password/",
  userProfile: "/auth/me",

  allEmployees: "users/employees/",
  allStudents: "users/students/",
  users: "users/",

  packages: "/packages/",
  packagesByCategory: "/packages/category/",
  categories: "/categories/",
  availabilities: "/availability/",
  bookings: "/bookings/",
  //Admin
  freeSessionSlots: "/free-session-slots/",
  freeSessionSlotByDate: "/free-session-slots/by-date/",
  freeSessionSlotByDateForAdmin: "/free-session-slots/admin/by-date/",
  freeSessionAvailableDays: "/free-session-slots/available-days/",
  moveFreeSessionBooking: "/free-session-groups/move-booking/",

  //User
  getFreeSessionSlots: "/free-session-slots/upcoming?days=14",
};

export default endPoints;
