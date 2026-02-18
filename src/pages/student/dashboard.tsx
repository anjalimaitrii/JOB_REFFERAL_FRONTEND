import { useNavigate } from "react-router-dom";
import Companies from "./companies";
import {
  LogOut,
  User,
  Mail,
  Bell,
  MapPin,
  Briefcase,
  TrendingUp,
  Users,
  Building2,
  ChevronRight,
  Star,
  Clock,
  Zap,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

import {
  getNotifications,
  markAllRead,
  markAsRead,
} from "../../services/notification.service";

// ── Types ─────────────────────────────────────────────────────
type NotifType = "success" | "info" | "alert";
interface Notification {
  _id: string;
  sender: {
    name: string;
    avatar?: string;
  };
  type: "message" | "request_accepted" | "request_rejected";
  request?: {
    _id: string;
  };
  text: string;
  createdAt: string;
  isRead: boolean;
  receiver?: {
    name: string;
    _id: string;
  };
}

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

const ALUMNI = [
  {
    name: "Priya Sharma",
    role: "SDE-3 @ Google",
    college: "IIT Delhi",
    available: true,
    avatar: "PS",
  },
  {
    name: "Rahul Mehra",
    role: "Lead @ Microsoft",
    college: "BITS Pilani",
    available: true,
    avatar: "RM",
  },
  {
    name: "Ananya Joshi",
    role: "PM @ Razorpay",
    college: "IIT Bombay",
    available: false,
    avatar: "AJ",
  },
  {
    name: "Karan Verma",
    role: "SDE-2 @ Flipkart",
    college: "NIT Trichy",
    available: true,
    avatar: "KV",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Building2,
    title: "Find a Company",
    desc: "Browse 500+ companies hiring through referrals right now.",
  },
  {
    step: "02",
    icon: Users,
    title: "Connect with Alumni",
    desc: "Reach out to employees from your college network.",
  },
  {
    step: "03",
    icon: Zap,
    title: "Get Referred",
    desc: "Alumni submit your profile internally — skip the queue.",
  },
];

const SUCCESS_STORIES = [
  { name: "Aman K.", company: "Amazon", role: "SDE-1", college: "IIT Roorkee" },
  {
    name: "Sneha R.",
    company: "Swiggy",
    role: "Data Analyst",
    college: "NIT Warangal",
  },
  {
    name: "Dev P.",
    company: "PhonePe",
    role: "Backend Dev",
    college: "BITS Goa",
  },
];

const FILTERS = [
  "All",
  "Remote",
  "Bengaluru",
  "Hyderabad",
  "Startup",
  "MNC",
  "Product",
];

// ── Notif Icon ────────────────────────────────────────────────
const NotifIcon = ({ type }: { type: NotifType }) => {
  if (type === "success")
    return (
      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
    );
  if (type === "alert")
    return <AlertCircle className="w-4 h-4 text-amber-500   shrink-0 mt-0.5" />;
  return <Info className="w-4 h-4 text-sky-500     shrink-0 mt-0.5" />;
};
const formatTime = (date: string) => {
  return new Date(date).toLocaleString();
};

// ── Component ─────────────────────────────────────────────────
const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"companies" | "colleges">(
    "companies",
  );
  const [activeFilter, setActiveFilter] = useState("All");
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loadingNotif, setLoadingNotif] = useState(true);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node))
        setBellOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await getNotifications();
        setNotifs(res.data || []);
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setLoadingNotif(false);
      }
    };

    loadNotifications();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };
  const unreadCount = notifs.filter((n) => !n.isRead).length;
const handleNotifClick = async (notif: Notification) => {
  try {
    // 1️⃣ Mark as read
    if (!notif.isRead) {
      await markAsRead(notif._id);

      setNotifs((prev) =>
        prev.map((n) =>
          n._id === notif._id ? { ...n, isRead: true } : n
        )
      );
    }

    // 2️⃣ Navigation based on type
    if (notif.type === "message" && notif.request?._id) {
      navigate("/student/requests", {
        state: { openChatForRequestId: notif.request._id },
      });

    } else if (
      notif.type === "request_accepted" ||
      notif.type === "request_rejected"
    ) {
      navigate("/student/requests");
    }

  } catch (err) {
    console.error("Notif click failed", err);
  }
};


  return (
    <div className="min-h-screen bg-slate-50">
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

          {/* ── Bell with dropdown ── */}
          <div className="relative" ref={bellRef}>
            <button
              onClick={() => setBellOpen((o) => !o)}
              className={`p-2 rounded-full transition-colors relative ${bellOpen ? "bg-white/15" : "hover:bg-white/10"}`}
              title="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-400 rounded-full text-black text-[9px] font-semibold flex items-center justify-center leading-none">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* ── Dropdown — exact screenshot UI ── */}
            {bellOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="bg-amber-100 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={async () => {
                        await markAllRead();
                        setNotifs((prev) =>
                          prev.map((n) => ({ ...n, isRead: true })),
                        );
                      }}
                      className="text-[11px] text-sky-500 hover:text-sky-600 font-medium transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Items */}
                <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-50">
                  {notifs.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => handleNotifClick(n)}
                      className={`relative flex items-start gap-3 px-4 py-3.5 transition-colors ${
                        !n.isRead ? "bg-amber-50/40" : "hover:bg-slate-50"
                      }`}
                    >
                      {/* Unread dot */}
                      {!n.isRead && (
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400" />
                      )}

                      {/* <NotifIcon type={n.type} /> */}

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-[13px] leading-snug ${n.isRead ? "font-normal text-slate-700" : "font-semibold text-slate-800"}`}
                        >
                          {n.sender?.name}
                        </p>
                        <p className="text-[12px] text-slate-500 font-light mt-0.5 leading-relaxed">
                          {n.type === "message"
                            ? "You received a new message"
                            : n.type === "request_accepted"
                              ? "Your referral request has been accepted 🎉"
                              : "Your referral request was rejected ❌"}
                        </p>
                        <p className="flex items-center gap-1 text-[11px] text-slate-400 font-light mt-1.5">
                          <Clock className="w-3 h-3" />{" "}
                          {formatTime(n.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 px-4 py-2.5 text-center">
                  <button
                    onClick={() => {
                      setBellOpen(false);
                      navigate("/student/notifications");
                    }}
                    className="text-[12px] text-amber-500 hover:text-amber-600 font-medium transition-colors"
                  >
                    View all notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

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

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section className="mt-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <h3 className="text-base font-semibold text-slate-700 mb-5">
          How It Works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
            <div
              key={step}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 relative overflow-hidden hover:border-amber-200 hover:shadow-md transition-all"
            >
              <span className="absolute top-4 right-4 text-5xl font-light text-slate-50 select-none">
                {step}
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-sm font-medium text-slate-700 mb-1">{title}</p>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ALUMNI ─────────────────────────────────────────── */}
      <section className="mt-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-slate-700">
            Alumni Open to Refer
          </h3>
          <button className="text-xs text-amber-500 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALUMNI.map((a) => (
            <div
              key={a.name}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col items-center text-center hover:shadow-md hover:border-amber-200 transition-all"
            >
              <div className="relative mb-3">
                <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                  {a.avatar}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${a.available ? "bg-emerald-400" : "bg-slate-300"}`}
                />
              </div>
              <p className="text-sm font-medium text-slate-800">{a.name}</p>
              <p className="text-xs text-slate-400 font-light mt-0.5">
                {a.role}
              </p>
              <p className="text-[11px] text-amber-500 font-medium mt-1">
                {a.college}
              </p>
              <button
                disabled={!a.available}
                className={`mt-3 w-full py-1.5 rounded-xl text-xs font-medium transition-all ${
                  a.available
                    ? "bg-black text-white hover:bg-gray-800 cursor-pointer"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                {a.available ? "Request Referral" : "Unavailable"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUCCESS STORIES ────────────────────────────────── */}
      <section className="mt-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <h3 className="text-base font-semibold text-slate-700 mb-5">
          Success Stories
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SUCCESS_STORIES.map((s) => (
            <div
              key={s.name}
              className="bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-100 shadow-sm p-5"
            >
              <div className="flex items-center gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                "Got referred to{" "}
                <span className="font-medium text-slate-800">{s.company}</span>{" "}
                as a{" "}
                <span className="font-medium text-slate-800">{s.role}</span>{" "}
                through JobReferral. Landed the offer in 3 weeks!"
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-black text-xs font-medium">
                  {s.name[0]}
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-700">{s.name}</p>
                  <p className="text-[10px] text-slate-400 font-light">
                    {s.college}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BROWSE ─────────────────────────────────────────── */}
      <section className="mt-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h3 className="text-base font-semibold text-slate-700">Browse</h3>
          <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
            {(["companies", "colleges"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab
                    ? "bg-black text-white shadow"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab === "companies" ? (
                  <Building2 className="w-3.5 h-3.5" />
                ) : (
                  <Users className="w-3.5 h-3.5" />
                )}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                activeFilter === f
                  ? "bg-black text-white border-black"
                  : "bg-white text-slate-500 border-slate-200 hover:border-amber-300 hover:text-amber-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {activeTab === "companies" ? (
          <Companies />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
            <Users className="w-9 h-9 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">
              College networks coming soon
            </p>
            <p className="text-xs text-slate-400 font-light mt-1">
              Browse alumni from your college who are open to referrals
            </p>
          </div>
        )}
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="mt-16 border-t border-slate-100 py-6 text-center">
        <p className="text-xs text-slate-400 font-light">
          © 2026 JobReferral · Built for students, by students
        </p>
      </footer>
    </div>
  );
};

export default StudentDashboard;
