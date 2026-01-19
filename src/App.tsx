import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import StudentRegister from "./pages/register/StudentRegister";
import EmployeeRegister from "./pages/register/EmployeeRegister";
import StudentDashboard from "./pages/student/dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import EmployeeDashboard from "./pages/employee/dashboard";
import Profile from "./pages/profile/ProfilePage";





function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/employee" element={<EmployeeRegister />} />
        <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>} />

        <Route  path="/employee/dashboard"  element={
            <ProtectedRoute allowedRole="employee">
              <EmployeeDashboard />
            </ProtectedRoute>  }  />

            
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRole={["employee", "student"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        

          <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
        
        <Route path="*" element={<h2>NO ROUTE MATCHED</h2>} />
      </Routes>
    </>
  );
}

export default App;
