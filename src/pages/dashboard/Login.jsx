import React, { useState } from "react";
import photo from "../../assets/login.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";
import { loginValidationSchema } from "@/Validation";
import ErrorMsg from "@/Components/auth/ErrorMsg";
import useLogin from "@/hooks/Actions/auth/useLogin";
import { useI18n } from "@/hooks/useI18n";

function Login() {
  const { t } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useLogin();
  const initialValues = {
    email: "",
    password: "",
  };
  const formik = useFormik({
    initialValues,
    validationSchema: loginValidationSchema(t),
    enableReinitialize: true,
    onSubmit: async (values) => {
      const userData = {
        ...values,
      };

      mutate({ data: userData });
    },
  });



  // const [formData, setFormData] = useState({ Email: "", Password: "" }),
  // const navigate = useNavigate();
  // const { login } = useAuth();
  // const { setAdmin } = useAdmin();
  // const location = useLocation();

  // useEffect(() => {
  //   const storedAdmin = localStorage.getItem("admin");
  //   if (storedAdmin) {
  //     setAdmin(JSON.parse(storedAdmin));
  //     navigate("/dash/");
  //   }
  // }, [setAdmin, navigate]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevState) => ({ ...prevState, [name]: value }));
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!formData.Email || !formData.Password) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Please fill all fields",
  //       timer: 1000,
  //       showConfirmButton: false,
  //     });
  //     return;
  //   }

  //   try {
  //     const q = query(
  //       collection(db, "Admins"),
  //       where("Email", "==", formData.Email),
  //       where("Password", "==", formData.Password)
  //     );
  //     const querySnapshot = await getDocs(q);

  //     if (querySnapshot.empty) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: "Invalid Email or Password",
  //         timer: 1000,
  //         showConfirmButton: false,
  //       });
  //       return;
  //     } else {
  //       const adminData = querySnapshot.docs[0].data();

  //       localStorage.setItem("admin", JSON.stringify(adminData));

  //       setAdmin(adminData);
  //       login();
  //       window.scroll(0, 0);
  //       navigate("/dash/");
  //     }
  //   } catch (e) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Something went wrong. Please try again.",
  //       timer: 1000,
  //       showConfirmButton: false,
  //     });
  //     console.error("Error during login: ", e);
  //   }
  // };

  return (
    <main className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 shadow-xl rounded-3xl overflow-hidden">
        {/* Image Section */}
        <section className="hidden md:block relative">
          <img
            src={photo}
            className="w-full h-full object-cover"
            alt="Login illustration"
          />
          {/* Optional overlay for better text contrast if needed */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800/10 to-purple-800/10"></div>
        </section>

        {/* Form Section */}
        <section className="flex flex-col justify-center items-center py-12 px-8 md:px-12 bg-white space-y-8">
          <div className="text-center">
            <h1 className="font-bold text-4xl md:text-5xl text-gray-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="w-full space-y-6 max-w-md"
          >
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="email"
                className="text-lg font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="py-3 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <ErrorMsg formik={formik} type="email" />
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="password"
                className="text-lg font-medium text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  required
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  className="py-3 px-4 w-full rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEye size={18} />
                  ) : (
                    <FaEyeSlash size={18} />
                  )}
                </button>
              </div>
              <ErrorMsg formik={formik} type="password" />
            </div>

            <button
              disabled={!(formik.isValid && formik.dirty) || isPending}
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[var(--Yellow)]  font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isPending ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* <div className="text-center pt-4">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Sign up
              </a>
            </p>
          </div> */}
        </section>
      </div>
    </main>
  );
}

export default Login;
