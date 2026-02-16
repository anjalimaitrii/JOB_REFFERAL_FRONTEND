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
import AdminEmployees from "./pages/admin/AdminEmployees";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/employee" element={<EmployeeRegister />} />
        <Route path="/register/company" element={<CompanyRegister />} />
        <Route path="/admin/companies" element={<AdminCompanies />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/employees" element={<AdminEmployees />} />
        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>} />

        <Route path="/employee/dashboard" element={
          <ProtectedRoute allowedRole="employee">
            <EmployeeDashboard />
          </ProtectedRoute>} />


        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRole={["employee", "student"]}>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* 
          <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      /> */}



        <Route
          path="/employee/companies"
          element={
            <ProtectedRoute allowedRole="employee">
              <Companies />
            </ProtectedRoute>
          }
        />


        <Route
          path="/student/requests"
          element={
            <ProtectedRoute allowedRole="student">
              <Request />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<h2>NO ROUTE MATCHED</h2>} />
      </Routes>
    </>
  );
}

export default App;
