import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import StudentRegister from "./pages/register/StudentRegister";
import EmployeeRegister from "./pages/register/EmployeeRegister";
import CompanyRegister from "./pages/register/CompanyRegister";
import StudentDashboard from "./pages/student/dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import EmployeeDashboard from "./pages/employee/dashboard";
import Profile from "./pages/profile/ProfilePage";
import Companies from "./pages/student/companies";
import Request from "./pages/student/request";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import AdminEmployees from "./pages/admin/AdminEmployees";
import AdminSuccessStories from "./pages/admin/AdminSuccessStories";
import NotificationsPage from "./components/NotificationsPage";
import RequestSection from "./pages/employee/request";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Feed from "./pages/student/Feed";
import EmployeeFeed from "./pages/employee/EmployeeFeed";
import Wallet from "./pages/Wallet";
import NotificationBell from "./components/NotificationBell";
import MobileBottomNav from "./pages/employee/bottomNavbar";
import Header from "./components/headers/index.jsx";

function App() {
  const location = useLocation();
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const role = localStorage.getItem("role") || user?.role;
  const isAuthPage = ["", "/", "/register/student", "/register/employee", "/register/company", "/admin"].includes(location.pathname.replace(/\/$/, "")) || location.pathname.startsWith("/admin/");

  return (
    <div className={`relative min-h-screen ${!isAuthPage ? "pb-20 md:pb-0" : ""}`}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Login />} />
          <Route path="/register/student" element={<StudentRegister />} />
          <Route path="/register/employee" element={<EmployeeRegister />} />
          <Route path="/register/company" element={<CompanyRegister />} />
          <Route path="/admin" element={<AdminLogin />} />

          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/companies"
            element={
              <AdminProtectedRoute>
                <AdminCompanies />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/students"
            element={
              <AdminProtectedRoute>
                <AdminStudents />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/employees"
            element={
              <AdminProtectedRoute>
                <AdminEmployees />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/stories"
            element={
              <AdminProtectedRoute>
                <AdminSuccessStories />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRole={["student", "employee"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute allowedRole="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRole={["employee", "student"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRole={["employee", "student"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/profile"
            element={
              <ProtectedRoute allowedRole="employee">
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute allowedRole={["employee", "student"]}>
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/wallet"
            element={
              <ProtectedRoute allowedRole={["employee", "student"]}>
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/wallet"
            element={
              <ProtectedRoute allowedRole="employee">
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/notifications"
            element={<NotificationsPage />}
          />
          <Route
            path="/employee/notifications"
            element={<NotificationsPage />}
          />

          <Route
            path="/student/companies"
            element={
              <ProtectedRoute allowedRole={["student", "employee"]}>
                <Companies />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/requests"
            element={
              <ProtectedRoute allowedRole={["student", "employee"]}>
                <Request />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/requests"
            element={
              <ProtectedRoute allowedRole="employee">
                <RequestSection />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/posts"
            element={
              <ProtectedRoute allowedRole="employee">
                <EmployeeFeed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/posts"
            element={
              <ProtectedRoute allowedRole={["employee", "student"]}>
                <Feed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/posts"
            element={
              <AdminProtectedRoute>
                <AdminPosts />
              </AdminProtectedRoute>
            }
          />

          <Route path="*" element={<h2>NO ROUTE MATCHED</h2>} />
        </Routes>
      </AnimatePresence>

      {!isAuthPage && (role === "student" || role === "employee") && (
        <div style={{ position: 'relative', zIndex: 9999 }}>
          <Header />
          <NotificationBell role={role} />
          <MobileBottomNav />
        </div>
      )}
    </div>
  );
}

export default App;
