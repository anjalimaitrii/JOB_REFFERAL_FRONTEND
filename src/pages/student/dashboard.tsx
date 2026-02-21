import { useNavigate } from "react-router-dom";
import Companies from "./companies";
import {
  LogOut,
  User,
  Mail,
  Briefcase,
  TrendingUp,
  Users,
  Building2,
  ChevronRight,
  Star,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import NotificationBell from "../../components/NotificationBell";
import { useEffect } from "react";
import ApplyNow from "./applyNow";
import HowItWorks from "./howItWorks";
import Alumni from "./alumni";
import SuccessStories from "./successStories";
import Footer from "../../components/footer";
import Blog from "./blog";
import LoadingScreen from "./loadingScreen";
import ReviewFloater from "../../components/ui/ReviewFloater";

// ── Mock Data ─────────────────────────────────────────────────
const STATS = [
  {
    icon: Building2,
    label: "Companies",
    value: "500+",
    color: "text-amber-500",
  },
  {
    icon: Users,
    label: "Referrers",
    value: "2,000+",
    color: "text-emerald-500",
  },
  {
    icon: TrendingUp,
    label: "Referrals",
    value: "8,500+",
    color: "text-sky-500",
  },
  { icon: Star, label: "Colleges", value: "150+", color: "text-rose-400" },
];

// ── Component ─────────────────────────────────────────────────
const StudentDashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };
  const [isLoading, setIsLoading] = useState(
    localStorage.getItem("justLoggedIn") === "true",
  );
  useEffect(() => {
    if (isLoading) {
      localStorage.removeItem("justLoggedIn");
    }
  }, [isLoading]);
  return (
    <>
    <motion.div
  initial={{ opacity: 0, x: 40 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -40 }}
  transition={{ duration: 0.3 }}
>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      <main className="bg-rudra-black min-h-screen">
        {/* ── NAVBAR ─────────────────────────────────────────── */}
        <nav className="h-16 bg-black flex items-center justify-between px-4 sm:px-8 text-white sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-amber-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-black" />
            </div>
            <h1 className="text-base font-semibold tracking-wide">
              Job<span className="text-amber-400">Referral</span>
            </h1>
          </div>

          <div className="flex items-center gap-1">
            {role === "employee" && (
              <div className="relative group flex items-center mr-2">
                <button
                  onClick={() => navigate("/employee/dashboard")}
                  className="relative w-14 h-7 flex items-center rounded-full bg-purple-600 transition-all duration-300"
                >
                  <span className="absolute w-6 h-6 bg-white rounded-full shadow-md translate-x-7" />
                </button>

                <div
                  className="absolute -top-1 -right-1 -translate-x-1/2 
      whitespace-nowrap px-3 py-1.5 rounded-md 
      text-white text-xs 
      opacity-0 group-hover:opacity-100 
      transition-opacity duration-200 pointer-events-none"
                >
                  Switch to Employee Mode
                </div>
              </div>
            )}
            <button
              onClick={() => navigate("/profile")}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Profile"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={() => navigate("/student/requests")}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="My Requests"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <NotificationBell role="student" />

            <div className="w-px h-5 bg-white/20 mx-1" />

            <button
              onClick={logout}
              className="p-2 rounded-full hover:bg-red-900/40 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            </button>
          </div>
        </nav>

        {/* ── HERO ───────────────────────────────────────────── */}
        <div
          className="relative w-full h-72 sm:h-96 flex flex-col items-center justify-center overflow-hidden"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/65 to-amber-900/40" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="relative z-10 text-center px-4">
            <p className="text-amber-400 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase mb-3">
              Your Career Starts Here
            </p>
            <h2 className="text-3xl sm:text-5xl font-semibold text-white leading-tight">
              Discover Opportunities
            </h2>
            <p className="text-gray-300 text-sm sm:text-base font-light mt-3 max-w-md mx-auto leading-relaxed">
              Connect with top companies through referrals and land your dream
              role.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2">
              <div className="h-px w-10 bg-amber-400/50" />
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="h-px w-10 bg-amber-400/50" />
            </div>
          </div>
        </div>

        {/* ── STATS ──────────────────────────────────────────── */}
        <div className="mt-14 px-4 sm:px-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 flex items-center gap-3 hover:shadow-md transition-shadow"
              >
                <Icon className={`w-5 h-5 shrink-0 ${color}`} />
                <div>
                  <p className="text-lg font-semibold text-slate-800 leading-tight">
                    {value}
                  </p>
                  <p className="text-xs text-slate-400 font-light mt-0.5">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ApplyNow />
        <HowItWorks />
        <Alumni />
        <Blog />
        <SuccessStories />
        <ReviewFloater designation={""} />
        <Footer />
      </main>
      </motion.div>
    </>
  );
};

export default StudentDashboard;
