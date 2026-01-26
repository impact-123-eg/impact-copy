import * as Yup from "yup";

export const baseValidationSchema = (t) =>
  Yup.object({
    name: Yup.string()
      .min(2, t("validation", "nameMin", "Name must be at least 2 characters"))
      .required(t("validation", "nameRequired", "Name is required")),
    gender: Yup.string()
      .oneOf(["male", "female", "other"], t("validation", "invalidGender", "Please select a valid gender"))
      .required(t("validation", "genderRequired", "Gender is required")),
    dateOfBirth: Yup.string().required(t("validation", "dateOfBirthRequired", "Date of birth is required")),
    email: Yup.string()
      .email(t("validation", "email", "Invalid email address"))
      .required(t("validation", "emailRequired", "Email is required")),
    password: Yup.string()
      .min(6, t("validation", "passwordMin", "Password must be at least 6 characters"))
      .required(t("validation", "passwordRequired", "Password is required")),
    phone: Yup.string()
      .min(10, t("validation", "phoneMin", "Phone number must be at least 10 digits"))
      .required(t("validation", "phoneNumberRequired", "Phone number is required")),
  });

export const loginValidationSchema = (t) =>
  Yup.object({
    email: Yup.string()
      .email(t("validation", "invalidEmail", "Invalid email address"))
      .required(t("validation", "loginEmailRequired", "Email is required")),
    password: Yup.string()
      .min(6, t("validation", "min6", "Password must be at least 6 characters"))
      .required(t("validation", "loginPasswordRequired", "Password is required")),
  });

export const userUpdateValidationSchema = (t) =>
  Yup.object({
    name: Yup.string()
      .required(t("validation", "updateNameRequired", "Name is required"))
      .min(2, t("validation", "nameMin", "Name must be at least 2 characters")),
    email: Yup.string()
      .email(t("validation", "invalidEmail", "Invalid email address"))
      .required(t("validation", "updateEmailRequired", "Email is required")),
    phone: Yup.string()
      .min(10, t("validation", "updatePhoneMin", "Phone number must be at least 10 digits"))
      .required(t("validation", "updatePhoneRequired", "Phone number is required")),
    password: Yup.string().min(8, t("validation", "passwordMin", "Password must be at least 6 characters")),
    role: Yup.string().required(t("validation", "addUserRoleRequired", "Role is required")),
    managedRole: Yup.string().oneOf(["sales", "instructor", ""]).optional(),
    shiftStart: Yup.string().optional(),
    shiftEnd: Yup.string().optional(),
    daysOff: Yup.array().of(Yup.string()).optional(),
  });

export const addUserValidationSchema = (t) =>
  Yup.object({
    name: Yup.string()
      .required(t("validation", "addUserNameRequired", "Name is required"))
      .min(2, t("validation", "nameMin", "Name must be at least 2 characters")),
    email: Yup.string()
      .email(t("validation", "invalidEmail", "Invalid email address"))
      .required(t("validation", "addUserEmailRequired", "Email is required")),
    phone: Yup.string()
      .min(10, t("validation", "addUserPhoneMin", "Phone number must be at least 10 digits"))
      .required(t("validation", "addUserPhoneRequired", "Phone number is required")),
    password: Yup.string()
      .min(8, t("validation", "passwordMin", "Password must be at least 6 characters"))
      .required(t("validation", "addUserPasswordRequired", "Password is required")),
    role: Yup.string().required(t("validation", "addUserRoleRequired", "Role is required")),
    managedRole: Yup.string().oneOf(["sales", "instructor", ""]).optional(),
    shiftStart: Yup.string().optional(),
    shiftEnd: Yup.string().optional(),
    daysOff: Yup.array().of(Yup.string()).optional(),
  });

export const packageValidationSchema = (t) =>
  Yup.object({
    // Category reference
    category: Yup.string().required(t("validation", "categoryRequired", "Category is required")),

    // Package fields
    levelno: Yup.number()
      .required(t("validation", "levelRequired", "Level is required"))
      .min(1, t("validation", "levelMin", "Level must be at least 1"))
      .integer(t("validation", "levelInteger", "Level must be an integer")),

    priceBefore: Yup.number()
      .required(t("validation", "priceBeforeRequired", "Price is required"))
      .min(0, t("validation", "priceMustBePositive", "Price cannot be negative")),

    priceAfter: Yup.number()
      .required(t("validation", "totalPriceRequired", "Price is required"))
      .min(0, t("validation", "totalPriceMustBePositive", "Price cannot be negative"))
      .test(
        "price-comparison",
        t("validation", "priceAfterComparison", "Price after must be less than or equal to price before"),
        function (value) {
          const { priceBefore } = this.parent;
          if (priceBefore === undefined || priceBefore === null) return true;
          return value <= priceBefore;
        }
      ),

    duration: Yup.number()
      .required(t("validation", "durationRequired", "Duration is required"))
      .min(1, t("validation", "durationMin", "Duration must be at least 1 week"))
      .integer(t("validation", "durationInteger", "Duration must be an integer")),

    durationUnit: Yup.number().required(t("validation", "durationUnitRequired", "Duration unit is required")),
    sessionNo: Yup.number()
      .required(t("validation", "sessionsRequired", "Number of sessions is required"))
      .min(1, t("validation", "sessionsMin", "Must have at least 1 session"))
      .integer(t("validation", "sessionsInteger", "Session number must be an integer")),

    sessionPerWeek: Yup.string().required(t("validation", "sessionPerWeekRequired", "Sessions per week is required")),

    hours: Yup.number()
      .required(t("validation", "hoursRequired", "Hours per session is required"))
      .min(0.5, t("validation", "hoursMin", "Minimum 0.5 hours per session"))
      .max(24, t("validation", "hoursMax", "Maximum 24 hours per session")),

    scheduleType: Yup.string().required(t("validation", "scheduleTypeRequired", "Schedule type is required")),
    studentNo: Yup.string().required(t("validation", "studentNoRequired", "Student capacity is required")),
  });

export const categorySchema = (t) =>
  Yup.object({
    name: Yup.string().required(t("validation", "categoryNameRequired", "Category name is required")),
    hoursPerSession: Yup.number()
      .required(t("validation", "categoryHoursRequired", "Hours per session is required"))
      .min(0.5, t("validation", "hoursMin", "Minimum 0.5 hours"))
      .max(24, t("validation", "hoursMax", "Maximum 24 hours")),
    sessionsPerWeek: Yup.string().required(t("validation", "sessionsPerWeekRequired", "Sessions per week is required")),
    scheduleType: Yup.string()
      .required(t("validation", "categoryScheduleTypeRequired", "Schedule type is required"))
      .oneOf(["morning", "night", "24/7"], t("validation", "invalidScheduleType", "Invalid schedule type")),
    studentNo: Yup.string().required(t("validation", "categoryStudentNoRequired", "Student capacity is required")),
    sessionType: Yup.string()
      .required(t("validation", "categorySessionTypeRequired", "Session type is required"))
      .oneOf(["online", "recorded", "both"], t("validation", "invalidSessionType", "Invalid session type")),
    enTitle: Yup.string().required(t("validation", "enTitleRequired", "English title is required")),
    enDescription: Yup.string().required(t("validation", "enDescriptionRequired", "English description is required")),
    arTitle: Yup.string().required(t("validation", "arTitleRequired", "Arabic title is required")),
    arDescription: Yup.string().required(t("validation", "arDescriptionRequired", "Arabic description is required")),
  });

export const bookingApplicationValidationSchema = (t) =>
  Yup.object({
    name: Yup.string().required(
      t("validation", "nameRequired") || "Name is required"
    ),
    email: Yup.string()
      .email(t("validation", "invalidEmail") || "Invalid email address")
      .required(t("validation", "emailRequired") || "Email is required"),
    phoneNumber: Yup.string().required(
      t("validation", "phoneRequired") || "Phone number is required"
    ),
  });

export const freeSessionValidationSchema = (t) =>
  Yup.object({
    name: Yup.string()
      .required(t("validation", "nameRequired") || "Name is required")
      .min(2, t("nameTooShort"))
      .max(50, t("nameTooLong")),
    email: Yup.string()
      .email(t("validation", "invalidEmail") || "Invalid email address")
      .required(t("validation", "emailRequired") || "Email is required"),
    phoneNumber: Yup.string()
      .required(t("validation", "phoneRequired") || "Phone number is required")
      .matches(
        /^[+]?[0-9\s\-()]{10,}$/,
        t("validation", "invalidPhone") || "Invalid phone number"
      ),
    country: Yup.string().required(
      t("validation", "countryRequired") || "Country is required"
    ),
    age: Yup.string()
      .oneOf(["kid", "teen", "adult"], "invalidAge")
      .required(t("validation", "ageRequired")),
    freeSessionSlotId: Yup.string().required(t("validation", "timeSlotRequired")),
    freeTest: Yup.string().optional(),
  });

export const freeSessionPersonalSchema = (t) =>
  Yup.object({
    name: Yup.string()
      .required(t("validation", "nameRequired") || "Name is required")
      .min(2, t("nameTooShort"))
      .max(50, t("nameTooLong")),
    email: Yup.string()
      .email(t("validation", "invalidEmail") || "Invalid email address")
      .required(t("validation", "emailRequired") || "Email is required"),
    phoneNumber: Yup.string()
      .required(t("validation", "phoneRequired") || "Phone number is required")
      .matches(
        /^[+]?[0-9\s\-()]{10,}$/,
        t("validation", "invalidPhone") || "Invalid phone number"
      ),
    country: Yup.string().required(
      t("validation", "countryRequired") || "Country is required"
    ),
    age: Yup.string()
      .oneOf(["kid", "teen", "adult"], "invalidAge")
      .required(t("validation", "ageRequired")),
  });

export const otpValidationSchema = (t) =>
  Yup.object({
    otp: Yup.string()
      .length(6, t("validation", "otpLength", "Code must be 6 digits"))
      .required(t("validation", "otpRequired", "Verification code is required")),
  });
