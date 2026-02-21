import { useNavigate } from "react-router-dom";
import { LogOut, User, Mail } from "lucide-react";
import NotificationBell from "../../components/NotificationBell";
import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
const Scene = lazy(() => import("../../components/ui/scene/index.jsx"));

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
    >
      <div className="min-h-screen bg-slate-100">
        {/* NAVBAR */}
        <div className="h-16 bg-black flex items-center justify-between px-4 sm:px-8 text-white shadow">
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

        {/* HERO SECTION with 3D Scene background */}
        <div
          className="relative w-full h-56 sm:h-72 flex items-center justify-center overflow-hidden"
          style={{ background: "#000" }}
        >
          {/* 3D Scene as background */}
          <div className="absolute inset-0 z-0">
            <Suspense fallback={<div className="w-full h-full bg-black" />}>
              <Scene />
            </Suspense>
          </div>

          {/* Gradient overlay on top of 3D scene */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div
            className="absolute inset-0 z-[1] opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)",
            }}
          />
          <div className="absolute left-0 top-0 h-full w-1 z-[2] bg-gradient-to-b from-transparent via-white/30 to-transparent" />

          {/* Hero text content */}
          <div className="relative z-10 text-center px-6">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/80 text-xs font-medium tracking-widest uppercase">
                Referral Management
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Manage Your <span className="text-white/60">Network,</span>
            </h2>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mt-1">
              Grow Together
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-lg mx-auto">
              Review referral requests, track applications, and build meaningful
              professional connections.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeDashboard;
