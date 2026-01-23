import { useNavigate } from "react-router-dom"
import Companies from "./companies"
import { LogOut, User, Mail } from "lucide-react"

const StudentDashboard = () => {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.clear()
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-slate-100">
      
      {/* NAVBAR */}
      <div
        className="h-16 bg-black flex items-center justify-between
                   px-4 sm:px-8 text-white shadow"
      >
        {/* Left */}
        <h1 className="text-base sm:text-lg font-semibold tracking-wide">
          Student Dashboard
        </h1>

        {/* Right Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="p-2 rounded-full hover:bg-gray-800 transition"
            title="Profile"
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={() => navigate("/student/requests")}
            className="p-2 rounded-full hover:bg-gray-800 transition"
            title="My Requests"
          >
            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={logout}
            className="p-2 rounded-full hover:bg-gray-700 transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

    <div className="px-4 sm:px-10 py-5 sm:py-6">

  {/* Search */}
  <div className="flex justify-center mt-10 sm:mt-6 mb-6 sm:mb-8">
    <input
      placeholder="Search employee name, job..."
      className="w-full sm:max-w-xl px-5 py-3 rounded-full
      bg-white text-gray-700 border border-gray-300
      shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
    />
  </div>

  <Companies />
</div>

    </div>
  )
}

export default StudentDashboard
