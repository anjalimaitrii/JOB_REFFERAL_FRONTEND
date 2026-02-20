import { useState, useRef, useEffect } from "react";
import { Bell, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useNotifications from "../hooks/Usenotifications";
import type { Notification } from "../hooks/Usenotifications";

interface Props {
  role: "student" | "employee";
}

const NotificationBell = ({ role }: Props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const {
    notifs,
    unreadCount,
    handleMarkAsRead,
    handleMarkAllRead,
  } = useNotifications();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = async (notif: Notification) => {
    if (!notif.isRead) {
      await handleMarkAsRead(notif._id);
    }

    setOpen(false);

    // Navigation logic
    if (notif.type === "message" && notif.request?._id) {
      navigate(
        role === "employee"
          ? "/employee/dashboard"
          : "/student/requests",
        { state: { openChatForRequestId: notif.request._id } }
      );
    } else {
      navigate(
        role === "employee"
          ? "/employee/dashboard"
          : "/student/requests"
      );
    }
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-full hover:bg-white/10 relative transition"
      >
        <Bell className="w-5 h-5" />

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-amber-400 rounded-full text-black text-[9px] font-semibold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[100]">

    {/* Header */}
    <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100">
      <span className="text-sm font-semibold text-slate-800">
        Notifications
      </span>

      {unreadCount > 0 && (
        <button
          onClick={handleMarkAllRead}
          className="text-xs text-sky-500 hover:text-sky-600 font-medium transition"
        >
          Mark all read
        </button>
      )}
    </div>

    {/* Scrollable List */}
    <div className="h-[200px] overflow-y-auto divide-y divide-slate-50">

      {notifs.length === 0 && (
        <div className="p-6 text-sm text-slate-400 text-center">
          No notifications
        </div>
      )}

      {notifs.map((n) => (
        <div
          key={n._id}
          onClick={() => handleClick(n)}
          className={`relative px-4 py-3 cursor-pointer transition-colors ${
            !n.isRead ? "bg-amber-50/40" : "hover:bg-slate-50"
          }`}
        >
          {!n.isRead && (
            <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400" />
          )}

          <div className="pl-3">
            <p
              className={`text-[13px] leading-snug ${
                n.isRead
                  ? "font-normal text-slate-700"
                  : "font-semibold text-slate-900"
              }`}
            >
              {n.type === "message"
                ? `${n.sender?.name || "Someone"} sent you a message`
                : n.type === "request_received"
                ? `You received a referral request`
                : n.type === "request_accepted"
                ? `Request accepted 🎉`
                : `Request rejected ❌`}
            </p>

            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* Footer */}
    <div className="border-t border-slate-100 text-center py-2">
      <button
        onClick={() => {
          setOpen(false);
          navigate(
            role === "employee"
              ? "/employee/notifications"
              : "/student/notifications"
          );
        }}
        className="text-xs text-amber-500 hover:text-amber-600 font-medium transition"
      >
        View all notifications →
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default NotificationBell;
