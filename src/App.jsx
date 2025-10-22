import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import MainLayout from "./Layouts/MainLayout";
import SubLayout from "./Layouts/SubLayout";
import LoginLayout from "./Layouts/LoginLayout";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import AppForm from "./pages/AppForm";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/info";
import Checkout from "./pages/Checkout";
import Login from "./pages/dashboard/Login";
import HomePage from "./pages/dashboard/HomePage";
import DashLayout from "./Layouts/DashLayout";
import Settings from "./pages/dashboard/Settings";
import EditAdmin from "./pages/dashboard/UpdateEmployee";
import Requests from "./pages/dashboard/Requests";
import StudentsBooking from "./pages/dashboard/StudentsBooking";
import CoursesPlans from "./pages/dashboard/CoursesPlans";

import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Terms from "./pages/terms";
import Payment from "./pages/payment";
import Privacy from "./pages/privacy";
import Refund from "./pages/Refund";
import { useTranslationContext } from "./TranslationContext";
import { useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { toastOptions } from "./toastConfig";
import AddEmployee from "./pages/dashboard/AddEmployee";
import AddCategory from "./Components/dashboard/AddCategory";
import CategoryManagement from "./pages/dashboard/Categories";
import AddEditPackage from "./Components/dashboard/AddEditPackage";
import FreeSessionManagement from "./pages/dashboard/FreeSessions";
import FreeSessionForm from "./pages/FreeSession";
import FreeSessionSuccess from "./pages/FreeSessionSuccess";
import FreeSessionConfirmed from "./pages/FreeSessionConfirmed";
import FreeSessionCancelled from "./pages/FreeSessionCancelled";
import FreeTestContainer from "./Components/free-test/FreeTestContainer";
function App() {
  // const { t, i18n, changeLanguage } = useTranslationContext();

  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Main layout for general pages */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:id" element={<CourseDetails />} />
            </Route>

            {/* Checkout page with a different layout */}
            <Route path="/" element={<SubLayout />}>
              <Route path="checkout" element={<Checkout />} />
              <Route path="free-test" element={<FreeTestContainer />} />
              <Route path="free-session" element={<FreeSessionForm />} />
              <Route
                path="free-session/success"
                element={<FreeSessionSuccess />}
              />
              <Route
                path="/free-session-confirmed"
                element={<FreeSessionConfirmed />}
              />
              <Route
                path="/free-session-cancelled"
                element={<FreeSessionCancelled />}
              />
              <Route path="/terms-of-use" element={<Terms />} />
              <Route path="/privacy-policy" element={<Privacy />} />
              <Route path="/refund-policy" element={<Refund />} />
              <Route
                path="ApplicationForm/:clientCurrency/:id"
                element={<AppForm />}
              />
            </Route>

            {/* Dashboard layout */}
            <Route path="/dash" element={<DashLayout />}>
              <Route
                index
                element={<ProtectedRoute element={<HomePage />} />}
              />
              <Route
                path="free-sessions"
                element={
                  <ProtectedRoute
                    element={<FreeSessionManagement />}
                    requiredRoles={["admin"]}
                  />
                }
              />

              <Route
                path="settings"
                element={
                  <ProtectedRoute
                    element={<Settings />}
                    requiredRoles={["admin"]}
                  />
                }
              />
              <Route
                path="settings/add-employee"
                element={
                  <ProtectedRoute
                    element={<AddEmployee />}
                    requiredRoles={["admin"]}
                  />
                }
              />
              <Route
                path="settings/update-employee/:id"
                element={
                  <ProtectedRoute
                    element={<EditAdmin />}
                    requiredRoles={["admin"]}
                  />
                }
              />
              <Route
                path="requests"
                element={<ProtectedRoute element={<Requests />} />}
              />
              <Route
                path="payment"
                element={
                  <ProtectedRoute
                    element={<Payment />}
                    requiredRoles={["admin"]}
                  />
                }
              />
              <Route
                path="booking"
                element={<ProtectedRoute element={<StudentsBooking />} />}
              />
              <Route
                path="categories"
                element={
                  <ProtectedRoute
                    element={<CategoryManagement />}
                    requiredRoles={["admin"]}
                  />
                }
              />
              <Route
                path="categories/add-category"
                element={
                  <ProtectedRoute
                    element={<AddCategory />}
                    requiredRoles={["admin"]}
                  />
                }
              />
              <Route
                path="categories/edit-category/:id"
                element={
                  <ProtectedRoute
                    element={<AddCategory />}
                    requiredRoles={["admin"]}
                  />
                }
              />
              <Route
                path="courses"
                element={
                  <ProtectedRoute
                    element={<CoursesPlans />}
                    requiredRoles={["admin"]}
                  />
                }
              />
              <Route
                path="courses/editcourse/:id"
                element={
                  <ProtectedRoute
                    element={<AddEditPackage />}
                    requiredRoles={["admin"]}
                  />
                }
              />
              <Route
                path="courses/addcourse"
                element={
                  <ProtectedRoute
                    element={<AddEditPackage />}
                    requiredRoles={["admin"]}
                  />
                }
              />
            </Route>

            <Route path="/dash/login" element={<LoginLayout />}>
              <Route index element={<Login />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
      <Toaster position="top-center" toastOptions={toastOptions} />
    </>
  );
}

export default App;
