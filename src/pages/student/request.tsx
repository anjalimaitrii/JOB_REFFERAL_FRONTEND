import { useEffect, useState } from "react";
import { getMySentRequests } from "../../services/request.service";
import Chat from "../../components/chat";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MessageCircle, Inbox, Clock, CheckCircle2, XCircle, X } from "lucide-react";
import { useLocation } from "react-router-dom";

const Request = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [requests, setRequests] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "accepted" | "rejected">("all");
  const [activeChat, setActiveChat] = useState<null | { requestId: string; receiverId: string }>(null);
  const [loading, setLoading] = useState(true);
  

  const pending  = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "accepted").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;

  const filteredRequests = requests.filter((r) => {
    if (filterStatus === "all") return true;
    return r.status === filterStatus;
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getMySentRequests();
        setRequests(res.data);
      } catch {
        console.error("Failed to fetch sent requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);
  useEffect(() => {
  if (!location.state?.openChatForRequestId) return;

  const reqId = location.state.openChatForRequestId;

  // Use a timeout to wait until requests are loaded
  const timer = setTimeout(() => {
    const req = requests.find(r => r._id === reqId);
    if (req && req.receiver?._id) {
      setActiveChat({ requestId: req._id, receiverId: req.receiver._id });
    }

    // clear state so modal doesn't reopen
    navigate(location.pathname, { replace: true, state: {} });
  }, 100); // small delay ensures requests are fetched

  return () => clearTimeout(timer);
}, [location.state, requests]);
  return (
    <div className="min-h-screen bg-slate-100">

      {/* NAVBAR */}
      <div className="h-16 bg-black flex items-center justify-between px-4 sm:px-8 text-white shadow sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="p-1.5 hover:bg-gray-800 rounded-full transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-semibold leading-tight">My Requests</h1>
            <p className="text-xs text-gray-400 leading-tight">{requests.length} total referral requests</p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 sm:px-10 py-8 max-w-8xl mx-auto">

        {/* STAT FILTER PILLS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard
            icon={<Inbox className="w-5 h-5" />}
            title="Total"
            count={requests.length}
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

        {/* SECTION TITLE */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">Request History</h2>
          {filterStatus !== "all" && (
            <button
              onClick={() => setFilterStatus("all")}
              className="text-xs text-gray-400 hover:text-black underline transition"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && requests.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-14 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-gray-600 font-medium">No referral requests yet</p>
            <p className="text-sm text-gray-400 mt-1">Send your first request to get started</p>
            <button
              onClick={() => navigate("/student/dashboard")}
              className="mt-5 px-6 py-2.5 bg-black text-white text-sm rounded-full hover:bg-gray-800 active:scale-95 transition-all"
            >
              Browse Companies
            </button>
          </div>
        )}

        {/* NO FILTER RESULTS */}
        {!loading && requests.length > 0 && filteredRequests.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">
            No {filterStatus} requests found.
          </div>
        )}

        {/* CARDS */}
        {!loading && filteredRequests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests.map((req) => {
              const roleTitle = req.company?.jobs.find(
                (job: any) => job._id === req.role
              )?.title || "N/A";

              return (
                <RequestCard
                  key={req._id}
                  companyName={req.company?.name || "Unknown Company"}
                  companyLogo={req.company?.logo}
                  role={roleTitle}
                  receiverName={req.receiver?.name || "Unknown User"}
                  status={
                    req.status === "pending"
                      ? "Pending"
                      : req.status === "accepted"
                      ? "Approved"
                      : "Rejected"
                  }
                  onChat={() => {
                    if (req.receiver?._id) {
                      setActiveChat({ requestId: req._id, receiverId: req.receiver._id });
                    }
                  }}
                />
              );
            })}
          </div>
        )}
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
                JSON.parse(atob(localStorage.getItem("token")!.split(".")[1]))._id
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
const colorMap: Record<string, { bg: string; icon: string; activeBorder: string }> = {
  gray:   { bg: "bg-gray-50",   icon: "text-gray-400",   activeBorder: "border-gray-800" },
  yellow: { bg: "bg-amber-50",  icon: "text-amber-500",  activeBorder: "border-amber-500" },
  green:  { bg: "bg-green-50",  icon: "text-green-500",  activeBorder: "border-green-500" },
  red:    { bg: "bg-red-50",    icon: "text-red-400",    activeBorder: "border-red-400" },
};

const StatCard = ({
  icon, title, count, color, isActive, onClick,
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
      className={`
        bg-white rounded-2xl shadow-sm p-5 cursor-pointer
        border-2 transition-all duration-200
        hover:-translate-y-1 hover:shadow-md
        ${isActive ? `${c.activeBorder} shadow-md` : "border-transparent"}
      `}
    >
      <div className={`w-9 h-9 rounded-xl ${c.bg} ${c.icon} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{count}</p>
      <p className="text-xs text-gray-400 mt-0.5 font-medium">{title}</p>
    </div>
  );
};

/* ── REQUEST CARD ── */
const RequestCard = ({
  companyName, companyLogo, role, receiverName, status, onChat,
}: {
  companyName: string;
  companyLogo?: string;
  role: string;
  receiverName: string;
  status: "Pending" | "Approved" | "Rejected";
  onChat?: () => void;
}) => {
  const statusConfig = {
    Approved: { style: "bg-green-50 text-green-600 border border-green-200", dot: "bg-green-500" },
    Rejected: { style: "bg-red-50 text-red-500 border border-red-200",       dot: "bg-red-500" },
    Pending:  { style: "bg-amber-50 text-amber-600 border border-amber-200", dot: "bg-amber-400 animate-pulse" },
  }[status];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-4">

      {/* Top: Company + Status */}
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
            <p className="font-semibold text-gray-800 truncate text-sm">{companyName}</p>
            <p className="text-xs text-gray-400 truncate">{role}</p>
          </div>
        </div>

        {/* Status badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${statusConfig.style}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
          {status}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-50" />

      {/* Receiver */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
          {receiverName.charAt(0)}
        </div>
        <div>
          <p className="text-xs text-gray-400">Referral sent to</p>
          <p className="text-sm font-medium text-gray-700">{receiverName}</p>
        </div>
      </div>

      {/* Chat Button */}
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

export default Request;