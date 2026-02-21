import { useEffect, useState } from "react";
import {
  getMyRequests,
  updateRequestStatus,
} from "../../services/request.service";
import Chat from "../../components/chat";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  MessageCircle,
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";

const RequestSection = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "accepted" | "rejected"
  >("all");
  const [activeChat, setActiveChat] = useState<null | {
    requestId: string;
    receiverId: string;
  }>(null);
  const [loading, setLoading] = useState(true);

  const pending = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "accepted").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;

  const filteredRequests = requests.filter((r) => {
    if (filterStatus === "all") return true;
    return r.status === filterStatus;
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getMyRequests();
        setRequests(res.data);
      } catch {
        console.error("Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
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

  return (
    <div className="min-h-screen bg-slate-100">
      {/* NAVBAR */}
      <div className="h-16 bg-black flex items-center justify-between px-4 sm:px-8 text-white shadow sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/employee/dashboard")}
            className="p-1.5 hover:bg-gray-800 rounded-full transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-semibold leading-tight">
              My Received Requests
            </h1>
            <p className="text-xs text-gray-400 leading-tight">
              {requests.length} total referral requests
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 sm:px-10 py-8 max-w-8xl mx-auto">
        {/* STAT CARDS */}
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

        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* CARDS */}
        {!loading && filteredRequests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {filteredRequests.map((req) => {
  const roleTitle =
    req.company?.jobs?.find((job: any) => job._id === req.role)?.title ||
    "N/A";

  return (
    <RequestCard
      key={req._id}
      companyName={req.company?.name || "Unknown"}
      companyLogo={req.company?.logo}
      role={roleTitle}
      receiverName={req.sender?.name}
      status={
        req.status === "pending"
          ? "Pending"
          : req.status === "accepted"
          ? "Approved"
          : "Rejected"
      }
      onChat={() =>
        setActiveChat({
          requestId: req._id,
          receiverId: req.sender?._id,
        })
      }
      onAccept={() => handleStatusChange(req._id, "accepted")}
      onReject={() => handleStatusChange(req._id, "rejected")}
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

export default RequestSection;
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
      className={`
        bg-white rounded-2xl shadow-sm p-5 cursor-pointer
        border-2 transition-all duration-200
        hover:-translate-y-1 hover:shadow-md
        ${isActive ? `${c.activeBorder} shadow-md` : "border-transparent"}
      `}
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

/* ── REQUEST CARD ── */
const RequestCard = ({
  companyName,
  companyLogo,
  role,
  receiverName,
  status,
  onChat,
  onAccept,
  onReject,
}: {
  companyName: string;
  companyLogo?: string;
  role: string;
  receiverName: string;
  status: "Pending" | "Approved" | "Rejected";
  onChat?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
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
     const [open, setOpen] = useState(false);
 

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-4">
      {/* Top row */}
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


<div className="relative shrink-0">
  {/* Badge */}
  <div
    onClick={() => status === "Pending" && setOpen(!open)}
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-200
      ${statusConfig.style}
      ${status === "Pending" ? "hover:scale-105 active:scale-95" : "cursor-default opacity-90"}
    `}
  >
    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
    {status}

    {status === "Pending" && (
      <svg
        className={`w-3 h-3 ml-1 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    )}
  </div>

  {/* Dropdown */}
  {open && status === "Pending" && (
    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50">
      
      <button
        onClick={() => {
          onAccept?.();
          setOpen(false);
        }}
        className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 text-green-600 transition"
      >
        Approve
      </button>

      <button
        onClick={() => {
          onReject?.();
          setOpen(false);
        }}
        className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-500 transition"
      >
        Reject
      </button>

    </div>
  )}
</div>
      </div>

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
