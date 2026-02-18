import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
  CheckCheck,
} from "lucide-react";
import {
  getNotifications,
  markAsRead,
  markAllRead,
} from "../services/notification.service";
import socket from "../services/socket";

// ── Types ─────────────────────────────────────────────────────
type NotifType = "success" | "info" | "alert";

interface Notification {
  _id: string;
  sender: {
    name: string;
    avatar?: string;
  };
  type:
    | "message"
    | "request_accepted"
    | "request_rejected"
    | "request_received";
  request?: {
    _id: string;
  };
  text: string;
  createdAt: string;
  isRead: boolean;
}

// ── Icon per type (fallback generic) ───────────────────────────
const NotifIcon = () => {
  return <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />;
};

// ── Component ─────────────────────────────────────────────────
const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch Notifications ────────────────────────────────────
  const loadNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifs(res.data || []);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };
const handleNotifClick = async (notif: Notification) => {
  try {
    if (!notif.isRead) {
      await markAsRead(notif._id);

      setNotifs((prev) =>
        prev.map((n) =>
          n._id === notif._id ? { ...n, isRead: true } : n
        )
      );
    }

    const user = JSON.parse(
      atob(localStorage.getItem("token")!.split(".")[1])
    );

    const isEmployee = user.role === "employee";

    // 🔹 MESSAGE → open chat
    if (notif.type === "message" && notif.request?._id) {
      navigate(
        isEmployee ? "/employee/dashboard" : "/student/requests",
        {
          state: { openChatForRequestId: notif.request._id },
        }
      );
    }

    // 🔹 REQUEST RELATED → just open request page
    else if (
      notif.type === "request_accepted" ||
      notif.type === "request_rejected" ||
      notif.type === "request_received"
    ) {
      navigate(
        isEmployee ? "/employee/dashboard" : "/student/requests"
      );
    }

  } catch (err) {
    console.error("Notification click failed", err);
  }
};


  useEffect(() => {
    socket.on("new-notification", (notif: Notification) => {
      setNotifs((prev) => [notif, ...prev]);
    });

    return () => {
      socket.off("new-notification");
    };
  }, []);

  useEffect(() => {
    loadNotifications();
  }, []);

  // ── Counts ─────────────────────────────────────────────────
  const unreadCount = notifs.filter((n) => !n.isRead).length;

  // ── Mark all read ──────────────────────────────────────────
  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Mark all read failed", err);
    }
  };

  // ── Time format helper ─────────────────────────────────────
  const formatTime = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav className="h-16 bg-black flex items-center justify-between px-4 sm:px-8 text-white sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <span className="text-base font-semibold tracking-wide">
            Notifications
          </span>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </nav>

      {/* ── BODY ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
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
                onClick={handleMarkAllRead}
                className="text-[11px] text-sky-500 hover:text-sky-600 font-medium transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="divide-y divide-slate-50">
            {loading ? (
              <div className="py-16 text-center text-sm text-slate-400">
                Loading notifications...
              </div>
            ) : notifs.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-slate-400 font-light">
                  No notifications
                </p>
              </div>
            ) : (
              notifs.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleNotifClick(n)}
                  className={`relative flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors ${
                    !n.isRead ? "bg-amber-50/40" : "bg-white hover:bg-slate-50"
                  }`}
                >
                

                  {/* Icon */}
                  <div className="mt-0.5">
                    <NotifIcon />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-[13px] leading-snug ${n.isRead ? "font-normal text-slate-700" : "font-semibold text-slate-800"}`}
                    >
                      {/* {n.sender?.name} */}
                    </p>
                    <p className="text-[12px] text-slate-500 font-light mt-0.5 leading-relaxed">
                      {n.type === "message"
                        ? `${n.sender?.name} sent you a message`
                        : n.type === "request_received"
                          ? `You received a referral request from ${n.sender?.name}`
                          : n.type === "request_accepted"
                            ? `${n.sender?.name} accepted your referral request 🎉`
                            : `${n.sender?.name} rejected your referral request ❌`}
                    </p>
                    <p className="flex items-center gap-1 text-[11px] text-slate-400 font-light mt-1.5">
                      <Clock className="w-3 h-3" /> {formatTime(n.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-4 py-3 text-center">
            <p className="text-[12px] text-amber-500 font-medium">
              Showing all {notifs.length} notifications
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
