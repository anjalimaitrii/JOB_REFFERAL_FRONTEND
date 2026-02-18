import { useNavigate } from "react-router-dom";
import {
  getMyRequests,
  getMySentRequests,
  updateRequestStatus,
} from "../../services/request.service";
import { useEffect, useRef, useState } from "react";
import Chat from "../../components/chat";
import {
  LogOut,
  User,
  Briefcase,
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  MessageCircle,
  X,
  ChevronDown,
} from "lucide-react";
import { Bell } from "lucide-react";
import { getNotifications, markAllRead ,markAsRead} from "../../services/notification.service";

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
  receiver?: {
    name: string;
    _id: string;
  };
}

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"received" | "sent">("received");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "accepted" | "rejected"
  >("all");
  const activeRequests = viewMode === "received" ? requests : sentRequests;
  const pending = activeRequests.filter((r) => r.status === "pending").length;
  const approved = activeRequests.filter((r) => r.status === "accepted").length;
  const rejected = activeRequests.filter((r) => r.status === "rejected").length;
  const [bellOpen, setBellOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loadingNotif, setLoadingNotif] = useState(true);
  const bellRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifs.filter((n) => !n.isRead).length;

  const filteredRequests = activeRequests.filter((r) => {
    if (filterStatus === "all") return true;
    return r.status === filterStatus;
  });

  const [activeChat, setActiveChat] = useState<null | {
    requestId: string;
    receiverId: string;
  }>(null);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const [receivedRes, sentRes] = await Promise.all([
          getMyRequests(),
          getMySentRequests(),
        ]);
        setRequests(receivedRes.data);
        setSentRequests(sentRes.data);
      } catch {
        console.error("Failed to fetch requests");
      }
    };
    fetchRequests();
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await getNotifications();
        setNotifs(
  (res.data || []).filter(
    (n: any) =>
      n.type !== "request_accepted" &&
      n.type !== "request_rejected"
  )
);

      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setLoadingNotif(false);
      }
    };

    loadNotifications();
  }, []);

  const handleStatusChange = async (
    requestId: string,
    status: "accepted" | "rejected",
  ) => {
    try {
      await updateRequestStatus(requestId, status);
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status } : r)),
      );
    } catch {
      alert("Failed to update request");
    }
  };
  const handleNotifClick = async (notif: Notification) => {
  try {
    //  Mark as read
    if (!notif.isRead) {
      await markAsRead(notif._id);

      setNotifs((prev) =>
        prev.map((n) =>
          n._id === notif._id ? { ...n, isRead: true } : n
        )
      );
    }

    setBellOpen(false);

    // If message → open chat modal
    if (notif.type === "message" && notif.request?._id) {
      const requestId = notif.request._id;

      // find request from both received & sent
      const allRequests = [...requests, ...sentRequests];

      const matchedReq = allRequests.find(
        (r) => r._id === requestId
      );

      if (matchedReq) {
        const receiverId =
          viewMode === "received"
            ? matchedReq.sender?._id
            : matchedReq.receiver?._id;

        if (receiverId) {
          setActiveChat({
            requestId: requestId,
            receiverId: receiverId,
          });
        }
      }
    }

    //  If not message → do nothing (stay same)
  } catch (err) {
    console.error("Notification click failed", err);
  }
};


  return (
    <div className="min-h-screen bg-slate-100">
      {/* NAVBAR — original */}
      <div className="h-16 bg-black flex items-center justify-between px-4 sm:px-8 text-white shadow">
        <h1 className="text-base sm:text-lg font-semibold">
          Employee Dashboard
        </h1>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="p-2 rounded-full hover:bg-gray-800"
            title="Profile"
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => navigate("/employee/companies")}
            className="p-2 rounded-full hover:bg-gray-800"
            title="Apply to other companies"
          >
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="relative" ref={bellRef}>
            <button
              onClick={() => setBellOpen((o) => !o)}
              className={`p-2 rounded-full transition-colors relative ${
                bellOpen ? "bg-gray-800" : "hover:bg-gray-800"
              }`}
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {notifs.filter((n) => !n.isRead).length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-400 rounded-full text-black text-[9px] font-semibold flex items-center justify-center">
                  {notifs.filter((n) => !n.isRead).length}
                </span>
              )}
            </button>

            {bellOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
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
                      className="text-[11px] text-sky-500 hover:text-sky-600 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-50">
                  {notifs.map((n) => (
                    <div
                      key={n._id}
                       onClick={() => handleNotifClick(n)}
                      className={`relative flex items-start gap-3 px-4 py-3.5 transition-colors ${
                        !n.isRead ? "bg-amber-50/40" : "hover:bg-slate-50"
                      }`}
                    >
                      {!n.isRead && (
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400" />
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-slate-800">
                          {n.type === "message"
                            ? `${n.sender?.name} sent you a message`
                            : n.type === "request_received"
                              ? `You received a referral request from ${n.sender?.name}`
                              : n.type === "request_accepted"
                                ? `${n.sender?.name} accepted your referral request 🎉`
                                : `${n.sender?.name} rejected your referral request ❌`}
                        </p>

                        <p className="text-[11px] text-slate-400 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 px-4 py-2.5 text-center">
                  <button
                    onClick={() => {
                      setBellOpen(false);
                      navigate("/employee/notifications");
                    }}
                    className="text-[12px] text-amber-500 font-medium"
                  >
                    View all notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-full hover:bg-gray-700"
            title="Logout"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* HERO SECTION — original */}
      <div
        className="relative w-full h-56 sm:h-72 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-slate-800/50" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)",
          }}
        />
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
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

      {/* ── CONTENT ── */}
      <div className="px-4 sm:px-10 py-8 max-w-8xl mx-auto">
        {/* TOGGLE VIEW */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-xl border inline-flex shadow-sm">
            <button
              onClick={() => {
                setViewMode("received");
                setFilterStatus("all");
              }}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "received"
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Received Referrals
            </button>
            <button
              onClick={() => {
                setViewMode("sent");
                setFilterStatus("all");
              }}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "sent"
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Sent Applications
            </button>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard
            icon={<Inbox className="w-5 h-5" />}
            title="Total"
            count={activeRequests.length}
            color="gray"
            isActive={filterStatus === "all"}
            onClick={() => setFilterStatus("all")}
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            title="Pending"
            count={pending}
            color="yellow"
            isActive={filterStatus === "pending"}
            onClick={() => setFilterStatus("pending")}
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5" />}
            title="Approved"
            count={approved}
            color="green"
            isActive={filterStatus === "accepted"}
            onClick={() => setFilterStatus("accepted")}
          />
          <StatCard
            icon={<XCircle className="w-5 h-5" />}
            title="Rejected"
            count={rejected}
            color="red"
            isActive={filterStatus === "rejected"}
            onClick={() => setFilterStatus("rejected")}
          />
        </div>

        {/* SECTION HEADER */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            {viewMode === "received"
              ? "Referral Requests"
              : "Your Applications"}
          </h2>
          {filterStatus !== "all" && (
            <button
              onClick={() => setFilterStatus("all")}
              className="text-xs text-gray-400 hover:text-black underline transition"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* EMPTY STATE */}
        {filteredRequests.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No requests found</p>
            <p className="text-sm text-gray-400 mt-1">
              {filterStatus !== "all"
                ? `No ${filterStatus} requests yet`
                : "Nothing here yet"}
            </p>
          </div>
        )}

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((req) =>
            viewMode === "received" ? (
              <StudentCard
                key={req._id}
                name={req.sender?.name || "Unknown Candidate"}
                email={req.sender?.email || "Unknown Email"}
                role={
                  req.company?.jobs?.find((job: any) => job._id === req.role)
                    ?.title || "N/A"
                }
                status={
                  req.status === "pending"
                    ? "Pending"
                    : req.status === "accepted"
                      ? "Approved"
                      : "Rejected"
                }
                onAccept={() => handleStatusChange(req._id, "accepted")}
                onReject={() => handleStatusChange(req._id, "rejected")}
                onChat={() => {
                  if (req.sender?._id)
                    setActiveChat({
                      requestId: req._id,
                      receiverId: req.sender._id,
                    });
                }}
              />
            ) : (
              <RequestCard
                key={req._id}
                companyName={req.company?.name || "Unknown Company"}
                companyLogo={req.company?.logo}
                role={
                  req.company?.jobs?.find((job: any) => job._id === req.role)
                    ?.title || "N/A"
                }
                receiverName={req.receiver?.name || "Unknown User"}
                status={
                  req.status === "pending"
                    ? "Pending"
                    : req.status === "accepted"
                      ? "Approved"
                      : "Rejected"
                }
                onChat={() => {
                  if (req.receiver?._id)
                    setActiveChat({
                      requestId: req._id,
                      receiverId: req.receiver._id,
                    });
                }}
              />
            ),
          )}
        </div>
      </div>

      {/* CHAT MODAL */}
      {activeChat && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={() => setActiveChat(null)}
        >
          <div
            className="w-full max-w-3xl h-[80vh] bg-white rounded-2xl overflow-hidden relative flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Chat
              requestId={activeChat.requestId}
              receiverId={activeChat.receiverId}
              currentUserId={
                JSON.parse(atob(localStorage.getItem("token")!.split(".")[1]))
                  ._id
              }
            />
            <button
              onClick={() => setActiveChat(null)}
              className="absolute top-3 right-3 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── STAT CARD ── */
const colorMap: Record<
  string,
  { bg: string; icon: string; activeBorder: string }
> = {
  gray: {
    bg: "bg-gray-50",
    icon: "text-gray-400",
    activeBorder: "border-gray-800",
  },
  yellow: {
    bg: "bg-amber-50",
    icon: "text-amber-500",
    activeBorder: "border-amber-500",
  },
  green: {
    bg: "bg-green-50",
    icon: "text-green-500",
    activeBorder: "border-green-500",
  },
  red: {
    bg: "bg-red-50",
    icon: "text-red-400",
    activeBorder: "border-red-400",
  },
};

const StatCard = ({
  icon,
  title,
  count,
  color,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  color: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  const c = colorMap[color];
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm p-5 cursor-pointer border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
        isActive ? `${c.activeBorder} shadow-md` : "border-transparent"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-xl ${c.bg} ${c.icon} flex items-center justify-center mb-3`}
      >
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{count}</p>
      <p className="text-xs text-gray-400 mt-0.5 font-medium">{title}</p>
    </div>
  );
};

/* ── STUDENT CARD (Received) ── */
const StudentCard = ({
  name,
  role,
  email,
  status,
  onAccept,
  onReject,
  onChat,
}: {
  name: string;
  role: string;
  email: string;
  status: "Pending" | "Approved" | "Rejected";
  onAccept?: () => void;
  onReject?: () => void;
  onChat?: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const statusConfig = {
    Approved: {
      style: "bg-green-50 text-green-600 border border-green-200",
      dot: "bg-green-500",
    },
    Rejected: {
      style: "bg-red-50 text-red-500 border border-red-200",
      dot: "bg-red-500",
    },
    Pending: {
      style:
        "bg-amber-50 text-amber-600 border border-amber-200 cursor-pointer",
      dot: "bg-amber-400 animate-pulse",
    },
  }[status];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-4">
      {/* Top row: avatar + name + status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 shrink-0">
            {name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 truncate text-sm">
              {name}
            </p>
            <p className="text-xs text-gray-400 truncate">{role}</p>
          </div>
        </div>

        {/* Status badge — dropdown on Pending */}
        <div className="relative shrink-0">
          <span
            onClick={() => status === "Pending" && setOpen(!open)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.style}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
            {status}
            {status === "Pending" && <ChevronDown className="w-3 h-3" />}
          </span>

          {open && status === "Pending" && (
            <div className="absolute right-0 mt-1.5 w-36 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden">
              <button
                onClick={() => {
                  onAccept?.();
                  setOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 text-green-600 font-medium transition"
              >
                ✓ Approve
              </button>
              <div className="border-t border-gray-50" />
              <button
                onClick={() => {
                  onReject?.();
                  setOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 text-red-500 font-medium transition"
              >
                ✕ Reject
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-50" />

      {/* Email row */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <span className="text-xs text-gray-500 font-medium">@</span>
        </div>
        <div>
          <p className="text-xs text-gray-400">Candidate Email</p>
          <p className="text-sm font-medium text-gray-700">{email}</p>
        </div>
      </div>

      {status === "Approved" && (
        <button
          onClick={onChat}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 active:scale-95 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          Chat with Candidate
        </button>
      )}
    </div>
  );
};

/* ── REQUEST CARD (Sent) ── */
const RequestCard = ({
  companyName,
  companyLogo,
  role,
  receiverName,
  status,
  onChat,
}: {
  companyName: string;
  companyLogo?: string;
  role: string;
  receiverName: string;
  status: "Pending" | "Approved" | "Rejected";
  onChat?: () => void;
}) => {
  const statusConfig = {
    Approved: {
      style: "bg-green-50 text-green-600 border border-green-200",
      dot: "bg-green-500",
    },
    Rejected: {
      style: "bg-red-50 text-red-500 border border-red-200",
      dot: "bg-red-500",
    },
    Pending: {
      style: "bg-amber-50 text-amber-600 border border-amber-200",
      dot: "bg-amber-400 animate-pulse",
    },
  }[status];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-4">
      {/* Top row: logo + company + status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {companyLogo ? (
            <img
              src={companyLogo}
              alt={companyName}
              className="w-10 h-10 rounded-xl object-contain border border-gray-100 bg-gray-50 p-1 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
              {companyName.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 truncate text-sm">
              {companyName}
            </p>
            <p className="text-xs text-gray-400 truncate">{role}</p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${statusConfig.style}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
          {status}
        </span>
      </div>

      <div className="border-t border-gray-50" />

      {/* Receiver row */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
          {receiverName.charAt(0)}
        </div>
        <div>
          <p className="text-xs text-gray-400">Sent to</p>
          <p className="text-sm font-medium text-gray-700">{receiverName}</p>
        </div>
      </div>

      {status === "Approved" && (
        <button
          onClick={onChat}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 active:scale-95 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          Chat with Referrer
        </button>
      )}
    </div>
  );
};

export default EmployeeDashboard;
