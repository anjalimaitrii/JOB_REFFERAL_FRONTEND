import { useNavigate } from "react-router-dom";
import {
  getMyRequests,
  getMySentRequests,
  updateRequestStatus,
} from "../../services/request.service";
import { useEffect, useState } from "react";
import Chat from "../../components/chat";
import { LogOut, User, Briefcase } from "lucide-react";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"received" | "sent">("received");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "accepted" | "rejected">("all");

  const activeRequests = viewMode === "received" ? requests : sentRequests;

  const pending = activeRequests.filter((r) => r.status === "pending").length;
  const approved = activeRequests.filter((r) => r.status === "accepted").length;
  const rejected = activeRequests.filter((r) => r.status === "rejected").length;

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

      {/* NAVBAR (same as Student) */}
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

          <button
            onClick={logout}
            className="p-2 rounded-full hover:bg-gray-700"
            title="Logout"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 sm:px-10 py-6">

        {/* TOGGLE VIEW */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-lg border inline-flex">
            <button
              onClick={() => {
                setViewMode("received");
                setFilterStatus("all");
              }}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${viewMode === "received"
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
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${viewMode === "sent"
                ? "bg-black text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900"
                }`}
            >
              Sent Applications
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard
            title="Total"
            count={activeRequests.length}
            isActive={filterStatus === "all"}
            onClick={() => setFilterStatus("all")}
          />
          <StatCard
            title="Pending"
            count={pending}
            isActive={filterStatus === "pending"}
            onClick={() => setFilterStatus("pending")}
          />
          <StatCard
            title="Approved"
            count={approved}
            isActive={filterStatus === "accepted"}
            onClick={() => setFilterStatus("accepted")}
          />
          <StatCard
            title="Rejected"
            count={rejected}
            isActive={filterStatus === "rejected"}
            onClick={() => setFilterStatus("rejected")}
          />

        </div>

        <h2 className="text-xl font-semibold mb-6">
          {viewMode === "received" ? "Referral Requests" : "Your Applications"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req) => (
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
                  if (req.sender?._id) {
                    setActiveChat({
                      requestId: req._id,
                      receiverId: req.sender._id,
                    });
                  }
                }}
              />
            ) : (
              <RequestCard
                key={req._id}
                companyName={req.company?.name || "Unknown Company"}
                role={
                  req.company?.jobs?.find((job: any) => job._id === req.role)?.title || "N/A"
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
                  if (req.receiver?._id) {
                    setActiveChat({
                      requestId: req._id,
                      receiverId: req.receiver._id,
                    });
                  }
                }}
              />
            )
          ))}
        </div>
      </div>

      {/* CHAT MODAL */}
      {activeChat && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="
  w-full max-w-3xl h-[80vh]
  bg-white rounded-2xl
  overflow-hidden
  relative
  flex flex-col
">

            <Chat
              requestId={activeChat.requestId}
              receiverId={activeChat.receiverId}
              currentUserId={
                JSON.parse(atob(localStorage.getItem("token")!.split(".")[1]))._id
              }
            />
            <button
              onClick={() => setActiveChat(null)}
              className="absolute top-3 right-3 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- SMALL UI HELPERS ---------- */

const StatCard = ({
  title,
  count,
  isActive,
  onClick
}: {
  title: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className={`
      bg-white rounded-xl shadow
      p-6 text-center
      transition-all duration-300 ease-out
      hover:-translate-y-2
      hover:shadow-2xl
      cursor-pointer
      border-2
      ${isActive ? "border-black" : "border-transparent"}
    `}
  >
    <p className="text-2xl font-bold">{count}</p>
    <p className="text-sm text-gray-500 mt-1">{title}</p>
  </div>
);

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

  const statusStyle =
    status === "Approved"
      ? "bg-green-100 text-green-600"
      : status === "Rejected"
        ? "bg-red-100 text-red-600"
        : "bg-yellow-100 text-yellow-700 cursor-pointer";

  return (
    <div className="relative bg-white rounded-2xl shadow p-6 hover:shadow-lg transition-shadow">
      <div className="absolute top-4 right-4">
        <span
          onClick={() => status === "Pending" && setOpen(!open)}
          className={`px-3 py-1 rounded-full text-xs ${statusStyle}`}
        >
          {status}
        </span>

        {open && status === "Pending" && (
          <div className="absolute right-0 mt-2 w-36 bg-white border rounded-xl shadow-xl z-20">
            <button
              onClick={() => {
                onAccept?.();
                setOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-green-600 font-medium"
            >
              Approve
            </button>
            <button
              onClick={() => {
                onReject?.();
                setOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 font-medium"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      <p className="text-sm text-gray-500 mb-1">{role}</p>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
            {name.charAt(0)}
          </div>
          <div>
            <p className="text-xs text-gray-400">Candidate Email</p>
            <p className="text-sm font-medium text-gray-700">{email}</p>
          </div>
        </div>
      </div>

      {status === "Approved" && (
        <button
          onClick={onChat}
          className="mt-4 w-full px-4 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800 transition-colors"
        >
          Chat with Candidate
        </button>
      )}
    </div>
  );
};

const RequestCard = ({
  companyName,
  role,
  receiverName,
  status,
  onChat,
}: {
  companyName: string;
  role: string;
  receiverName: string;
  status: "Pending" | "Approved" | "Rejected";
  onChat?: () => void;
}) => {
  const statusStyle =
    status === "Approved"
      ? "bg-green-100 text-green-600"
      : status === "Rejected"
        ? "bg-red-100 text-red-600"
        : "bg-yellow-100 text-yellow-700";

  return (
    <div className="relative bg-white rounded-2xl shadow p-6 hover:shadow-lg transition-shadow">
      <div className="absolute top-4 right-4">
        <span
          className={`px-3 py-1 rounded-full text-xs ${statusStyle}`}
        >
          {status}
        </span>
      </div>

      <h3 className="text-lg font-semibold">{companyName}</h3>
      <p className="text-sm text-gray-500">{role}</p>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
            {receiverName.charAt(0)}
          </div>
          <div>
            <p className="text-xs text-gray-400">Sent to</p>
            <p className="text-sm font-medium">{receiverName}</p>
          </div>
        </div>
      </div>

      {status === "Approved" && (
        <button
          onClick={onChat}
          className="mt-4 w-full px-4 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800 transition-colors"
        >
          Chat with Referrer
        </button>
      )}
    </div>
  );
};

export default EmployeeDashboard;
