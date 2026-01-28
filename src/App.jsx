import { useEffect, useState } from "react";
import "./App.css";

import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ReactPixel from "react-facebook-pixel";

import { toastOptions } from "./toastConfig";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import LanguageSync from "./Components/LanguageSync";
import MainLayout from "./Layouts/MainLayout";
import SubLayout from "./Layouts/SubLayout";
import DashLayout from "./Layouts/DashLayout";
import LoginLayout from "./Layouts/LoginLayout";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/info";
import Checkout from "./pages/Checkout";
import PaymentResult from "./pages/PaymentResult";
import AppForm from "./pages/AppForm";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
import Refund from "./pages/Refund";

import FreeSessionForm from "./pages/FreeSession";
import FreeSessionSuccess from "./pages/FreeSessionSuccess";
import FreeSessionConfirmed from "./pages/FreeSessionConfirmed";
import FreeSessionCancelled from "./pages/FreeSessionCancelled";
import FreeTestContainer from "./Components/free-test/FreeTestContainer";

import HomePage from "./pages/dashboard/HomePage";
import FreeSessionManagement from "./pages/dashboard/FreeSessions";
import Settings from "./pages/dashboard/Settings";
import AddEmployee from "./pages/dashboard/AddEmployee";
import EditAdmin from "./pages/dashboard/UpdateEmployee";
import Requests from "./pages/dashboard/Requests";
import Payment from "./pages/dashboard/payment";
import ManualPayment from "./pages/dashboard/ManualPayment";
import StudentsBooking from "./pages/dashboard/StudentsBooking";
import StudentsFreeTests from "./pages/dashboard/StudentsFreeTests";
import BookingDetails from "./pages/dashboard/BookingDetails";
import CategoryManagement from "./pages/dashboard/Categories";
import AddCategory from "./Components/dashboard/AddCategory";
import CoursesPlans from "./pages/dashboard/CoursesPlans";
import AddEditPackage from "./Components/dashboard/AddEditPackage";
import PageManagement from "./pages/dashboard/PageManagement";
import UsersManagement from "./pages/dashboard/UsersManagement";
import UserDetailedProfile from "./pages/dashboard/UserDetailedProfile";
import Login from "./pages/Login";
import DashboardLogin from "./pages/dashboard/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import Profile from "./pages/Profile";

import Groups from "./pages/dashboard/Groups";
import GroupDetails from "./pages/dashboard/GroupDetails";
import Revenues from "./pages/dashboard/finance/Revenues";
import Expenses from "./pages/dashboard/finance/Expenses";
import Payroll from "./pages/dashboard/finance/Payroll";
import SessionAttendance from "./pages/dashboard/SessionAttendance";
import InstructorPendingRequests from "./pages/dashboard/InstructorPendingRequests";
import AffiliateSettings from "./pages/dashboard/AffiliateSettings";

const pixelId = import.meta.env.VITE_PIXEL_ID;

const options = {
  autoConfig: true, // auto load the pixel script
  debug: false, // set true to log events in console
};

const DEFAULT_LOCALE = localStorage.getItem('app_locale') || 'ar';

function App() {
  const location = useLocation();
  const [pixelReady, setPixelReady] = useState(false);

  useEffect(() => {
    if (!pixelId) return;
    ReactPixel.init(pixelId, {}, options);
    ReactPixel.pageView();
    setPixelReady(true);
  }, []);

  useEffect(() => {
    if (!pixelReady) return;
    ReactPixel.trackCustom("RouteChange", {
      path: location.pathname,
    });
  }, [pixelReady, location.pathname]);

  return (
    <>
      <AuthProvider>
        <Routes>
          {/* Redirect root to default language */}
          <Route path="/" element={<Navigate to={`/${DEFAULT_LOCALE}`} replace />} />

          {/* Language-aware routes for non-admin pages */}
          <Route path="/:lang" element={<LanguageSync />}>
            {/* Main layout for general pages */}
            <Route element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:id" element={<CourseDetails />} />
              <Route path="profile" element={<ProtectedRoute element={<Profile />} />} />
            </Route>

            {/* Checkout page with a different layout */}
            <Route element={<SubLayout />}>
              <Route path="checkout" element={<Checkout />} />
              <Route path="payment/result" element={<PaymentResult />} />
              <Route path="free-test" element={<FreeTestContainer />} />
              <Route path="free-session" element={<FreeSessionForm />} />
              <Route
                path="free-session/success"
                element={<FreeSessionSuccess />}
              />
              <Route
                path="free-session-confirmed"
                element={<FreeSessionConfirmed />}
              />
              <Route
                path="free-session-cancelled"
                element={<FreeSessionCancelled />}
              />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="verify-otp" element={<VerifyOTP />} />
              <Route path="terms-of-use" element={<Terms />} />
              <Route path="privacy-policy" element={<Privacy />} />
              <Route path="refund-policy" element={<Refund />} />
              <Route
                path="ApplicationForm/:clientCurrency/:id"
                element={<AppForm />}
              />
            </Route>
          </Route>

          {/* Dashboard layout */}
          <Route path="/dash" element={<DashLayout />}>
            <Route index element={<ProtectedRoute element={<HomePage />} requiredRoles={["admin", "seo"]} />} />
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
            {/* <Route
              path="affiliate-settings"
              element={
                <ProtectedRoute
                  element={<AffiliateSettings />}
                  requiredRoles={["admin"]}
                />
              } */}
            {/* /> */}
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
              path="payment/manual"
              element={
                <ProtectedRoute
                  element={<ManualPayment />}
                  requiredRoles={["admin"]}
                />
              }
            />
            <Route
              path="booking"
              element={<ProtectedRoute element={<StudentsBooking />} />}
            />
            <Route
              path="free-tests"
              element={<ProtectedRoute element={<StudentsFreeTests />} />}
            />
            <Route
              path="booking/:id"
              element={<ProtectedRoute element={<BookingDetails />} />}
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
            <Route
              path="users"
              element={
                <ProtectedRoute
                  element={<UsersManagement />}
                  requiredRoles={["admin"]}
                />
              }
            />
            <Route
              path="users/:id"
              element={
                <ProtectedRoute
                  element={<UserDetailedProfile />}
                  requiredRoles={["admin"]}
                />
              }
            />
            <Route
              path="pages"
              element={
                <ProtectedRoute
                  element={<PageManagement />}
                  requiredRoles={["admin", "seo"]}
                />
              }
            />
            {/* Absence / Teacher Module */}
            <Route
              path="groups"
              element={<ProtectedRoute element={<Groups />} requiredRoles={["admin", "instructor", "supervisor"]} />}
            />
            <Route
              path="groups/:id"
              element={<ProtectedRoute element={<GroupDetails />} requiredRoles={["admin", "instructor", "supervisor", "student"]} />}
            />
            <Route
              path="sessions/:sessionId"
              element={<ProtectedRoute element={<SessionAttendance />} requiredRoles={["admin", "instructor", "supervisor"]} />}
            />
            <Route
              path="pending-assignments"
              element={<ProtectedRoute element={<InstructorPendingRequests />} requiredRoles={["instructor", "admin"]} />}
            />
            {/* Finance Module */}
            <Route
              path="finance/revenues"
              element={<ProtectedRoute element={<Revenues />} requiredRoles={["admin"]} />}
            />
            <Route
              path="finance/expenses"
              element={<ProtectedRoute element={<Expenses />} requiredRoles={["admin"]} />}
            />
            <Route
              path="finance/payroll"
              element={<ProtectedRoute element={<Payroll />} requiredRoles={["admin"]} />}
            />
          </Route>

          <Route path="/dash/login" element={<LoginLayout />}>
            <Route index element={<DashboardLogin />} />
          </Route>
        </Routes>
      </AuthProvider>
      <Toaster position="top-center" toastOptions={toastOptions} />
    </>
  );
}

export default App;
