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
import AdminStudents from "./pages/admin/AdminStudents";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import AdminEmployees from "./pages/admin/AdminEmployees";
import NotificationsPage from "./components/NotificationsPage";
import RequestSection from "./pages/employee/request";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  return (
    <>
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
          {/* <Route
          path="/employee/companies"
          element={
            <ProtectedRoute allowedRole="employee">
              <Companies />
            </ProtectedRoute>
          }
        /> */}

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

          <Route path="*" element={<h2>NO ROUTE MATCHED</h2>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
