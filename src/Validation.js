import * as Yup from "yup";

export const baseValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, "الاسم يجب أن يكون على الأقل حرفين")
    .required("الاسم مطلوب"),
  gender: Yup.string()
    .oneOf(["male", "female", "other"], "يرجى اختيار جنس صحيح")
    .required("الجنس مطلوب"),
  dateOfBirth: Yup.string().required("تاريخ الميلاد مطلوب"),
  email: Yup.string()
    .email("عنوان بريد إلكتروني غير صحيح")
    .required("البريد الإلكتروني مطلوب"),
  password: Yup.string()
    .min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف")
    .required("كلمة المرور مطلوبة"),
  phone: Yup.string()
    .min(10, "رقم الهاتف يجب أن يكون على الأقل 10 أرقام")
    .required("رقم الهاتف مطلوب"),
});

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const userUpdateValidationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters"),
  role: Yup.string().required("Role is required"),
  managedRole: Yup.string().oneOf(["sales", "instructor", ""]).optional(),
  shiftStart: Yup.string().optional(),
  shiftEnd: Yup.string().optional(),
  daysOff: Yup.array().of(Yup.string()).optional(),
});

export const addUserValidationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  role: Yup.string().required("Role is required"),
  managedRole: Yup.string().oneOf(["sales", "instructor", ""]).optional(),
  shiftStart: Yup.string().optional(),
  shiftEnd: Yup.string().optional(),
  daysOff: Yup.array().of(Yup.string()).optional(),
});

export const packageValidationSchema = Yup.object({
  // Category reference
  category: Yup.string().required("Category is required"),

  // Package fields
  levelno: Yup.number()
    .required("Level number is required")
    .min(1, "Level number must be at least 1")
    .integer("Level number must be an integer"),

  priceBefore: Yup.number()
    .required("Price before is required")
    .min(0, "Price cannot be negative"),

  priceAfter: Yup.number()
    .required("Price after is required")
    .min(0, "Price cannot be negative")
    .test(
      "price-comparison",
      "Price after must be less than or equal to price before",
      function (value) {
        const { priceBefore } = this.parent;
        if (priceBefore === undefined || priceBefore === null) return true;
        return value <= priceBefore;
      }
    ),

  duration: Yup.number()
    .required("Duration is required")
    .min(1, "Duration must be at least 1 week")
    .integer("Duration must be an integer"),

  durationUnit: Yup.number().required("Duration unit is required"),
  sessionNo: Yup.number()
    .required("Number of sessions is required")
    .min(1, "Must have at least 1 session")
    .integer("Session number must be an integer"),

  sessionPerWeek: Yup.string().required("Sessions per week is required"),

  hours: Yup.number()
    .required("Hours per session is required")
    .min(0.5, "Minimum 0.5 hours per session")
    .max(24, "Maximum 24 hours per session"),

  scheduleType: Yup.string().required("Schedule type is required"),
  studentNo: Yup.string().required("Student capacity is required"),
});

export const categorySchema = Yup.object({
  name: Yup.string().required("Category name is required"),
  hoursPerSession: Yup.number()
    .required("Hours per session is required")
    .min(0.5, "Minimum 0.5 hours")
    .max(24, "Maximum 24 hours"),
  sessionsPerWeek: Yup.string().required("Sessions per week is required"),
  scheduleType: Yup.string()
    .required("Schedule type is required")
    .oneOf(["morning", "night", "24/7"], "Invalid schedule type"),
  studentNo: Yup.string().required("Student capacity is required"),
  sessionType: Yup.string()
    .required("Session type is required")
    .oneOf(["online", "recorded", "both"], "Invalid session type"),
  enTitle: Yup.string().required("English title is required"),
  enDescription: Yup.string().required("English description is required"),
  arTitle: Yup.string().required("Arabic title is required"),
  arDescription: Yup.string().required("Arabic description is required"),
});

export const bookingApplicationValidationSchema = (t) =>
  Yup.object({
    name: Yup.string().required(
      t("validation.nameRequired") || "Name is required"
    ),
    email: Yup.string()
      .email(t("validation.invalidEmail") || "Invalid email address")
      .required(t("validation.emailRequired") || "Email is required"),
    phoneNumber: Yup.string().required(
      t("validation.phoneRequired") || "Phone number is required"
    ),
  });

export const freeSessionValidationSchema = (t) =>
  Yup.object({
    name: Yup.string()
      .required(t("validation.nameRequired") || "Name is required")
      .min(2, t("nameTooShort"))
      .max(50, t("nameTooLong")),
    email: Yup.string()
      .email(t("validation.invalidEmail") || "Invalid email address")
      .required(t("validation.emailRequired") || "Email is required"),
    phoneNumber: Yup.string()
      .required(t("validation.phoneRequired") || "Phone number is required")
      .matches(
        /^[+]?[0-9\s\-()]{10,}$/,
        t("validation.invalidPhone") || "Invalid phone number"
      ),
    country: Yup.string().required(
      t("validation.countryRequired") || "Country is required"
    ),
    age: Yup.string()
      .oneOf(["kid", "teen", "adult"], "invalidAge")
      .required(t("validation.ageRequired")),
    freeSessionSlotId: Yup.string().required(t("validation.timeSlotRequired")),
    freeTest: Yup.string().optional(),
  });

export const freeSessionPersonalSchema = (t) =>
  Yup.object({
    name: Yup.string()
      .required(t("validation.nameRequired") || "Name is required")
      .min(2, t("nameTooShort"))
      .max(50, t("nameTooLong")),
    email: Yup.string()
      .email(t("validation.invalidEmail") || "Invalid email address")
      .required(t("validation.emailRequired") || "Email is required"),
    phoneNumber: Yup.string()
      .required(t("validation.phoneRequired") || "Phone number is required")
      .matches(
        /^[+]?[0-9\s\-()]{10,}$/,
        t("validation.invalidPhone") || "Invalid phone number"
      ),
    country: Yup.string().required(
      t("validation.countryRequired") || "Country is required"
    ),
    age: Yup.string()
      .oneOf(["kid", "teen", "adult"], "invalidAge")
      .required(t("validation.ageRequired")),
  });
export const otpValidationSchema = Yup.object({
  otp: Yup.string()
    .length(6, "Code must be 6 digits")
    .required("Verification code is required"),
});
