import { LogOut, User, Mail } from "lucide-react";
import NotificationBell from "../../components/NotificationBell";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
      const logout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <div>
         <div className="h-16 w-full bg-black fixed z-30 flex items-center justify-between px-4 sm:px-8 text-white shadow">
                  <h1 className="text-base sm:text-lg font-semibold">
                    Employee Dashboard
                  </h1>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => navigate("/student/dashboard")}
                      className="relative w-14 h-7 flex items-center rounded-full bg-gray-300 transition-all duration-300"
                    >
                      <span className="absolute w-6 h-6 bg-white rounded-full shadow-md translate-x-1" />
                    </button>
                    <button
                      onClick={() => navigate("/profile")}
                      className="p-2 rounded-full hover:bg-gray-800"
                      title="Profile"
                    >
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => navigate("/employee/requests")}
                      className="p-2 rounded-full hover:bg-gray-800"
                      title="My Referrals"
                    >
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
        
                    <NotificationBell role="employee" />
        
                    <button
                      onClick={logout}
                      className="p-2 rounded-full hover:bg-gray-700"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
    </div>
  )
}

export default Navbar