# Client Application Overview

This document provides a simple overview of the Client application, its modules, data flow, and structure.

## 1. Modules & Pages

The application is split into two main sections: public-facing pages and a private dashboard.

### **Public Pages**
- **Home**: Landing page (`/`).
- **About Us**: Information about the company (`/about`).
- **Courses**: Catalog of available courses (`/courses`).
- **Course Details**: Specific information for a course (`/courses/:id`).
- **Checkout**: Payment and enrollment process (`/checkout`, `/ApplicationForm`).
- **Free Session**: Booking flow for free trial sessions (`/free-session`).
- **Free Test**: Assessment tests (`/free-test`).
- **Legal**: Terms, Privacy, Refund Policy.

### **Dashboard (Admin/Private)**
- **Authentication**: Login page (`/dash/login`).
- **Overview**: Main stats page (`/dash`).
- **Bookings**: Manage student bookings (`/dash/booking`).
- **Requests**: View and manage requests (`/dash/requests`).
- **Courses & Categories**: Manage catalog content (`/dash/courses`, `/dash/categories`).
- **Free Sessions**: Manage slots and bookings (`/dash/free-sessions`).
- **Settings**: Employee management and system settings (`/dash/settings`).

---

## 2. Architecture & Layouts

The application uses `react-router-dom` with distinct layouts for different sections:

- **MainLayout**: Standard header/footer for public pages.
- **SubLayout**: Simplified layout for checkout/focused flows.
- **DashLayout**: Sidebar + Header layout for the admin dashboard.
- **LoginLayout**: Minimal layout for the login page.

### **Key Components**
- **ProtectedRoute**: Wraps dashboard routes to enforce authentication and role-based access.
- **AuthProvider**: Manages user session state using Context API.
- **Toaster**: Global notification system (`react-hot-toast`).

---

## 3. Data Flow

### **State Management**
- **Context API**: `AuthContext` (User user), `TranslationContext` (Language).
- **React Query** (TanStack Query): Used for fetching and caching server data (e.g., courses, bookings).
- **Local State**: Used for form inputs and UI toggles.

### **API Interaction**
- **Axios**: Configured instance in `services/clientService.js`.
- **Base URL**: Connects to the backend API.
- **Requests**:
    - **Get Courses**: `GET /api/packages`
    - **Login**: `POST /api/auth/login`
    - **Book Session**: `POST /api/free-session-bookings`

---

## 4. Key Workflows

### **Student Booking Flow**
1.  **Selection**: User picks a course on `/courses`.
2.  **Form**: Fills application details (`AppForm`).
3.  **Checkout**: Navigates to payment.
4.  **Payment**: Redirects to Paymob (external).
5.  **Result**: Returns to `/payment/result`.

### **Admin Management Flow**
1.  **Login**: Authenticates at `/dash/login`.
2.  **Dashboard**: Views key metrics.
3.  **Manage**: Can add/edit courses, view bookings, and approve/reject requests.
4.  **Settings**: Can add new employees/admins.

---

## 5. Technology Stack

-   **Framework**: React (Vite)
-   **Routing**: React Router DOM v7
-   **Styling**: Tailwind CSS + Flowbite
-   **Forms**: Formik + Yup validation
-   **Data Fetching**: Axios + React Query
-   **Charts**: Chart.js / ECharts
-   **Internationalization**: i18next
