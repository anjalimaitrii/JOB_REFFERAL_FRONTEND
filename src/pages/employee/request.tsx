import { useEffect, useState } from "react";
import {
  getMyRequests,
  markRequestCompleted,
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
  FileText,
  Search,
  Activity,
} from "lucide-react";
import EmployeeRequestModal from "@/components/ui/EmployeeRequestModal";


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
  const [searchQuery, setSearchQuery] = useState("");

  const pending = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "accepted").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleView = (req: any) => {
    setSelectedRequest(req);
    setOpenModal(true);
  };

  const filteredRequests = requests.filter((r) => {
    const statusMatch = filterStatus === "all" || r.status === filterStatus;
    if (!statusMatch) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const companyName = (r.company?.name || "").toLowerCase();
    const senderName = (r.sender?.name || "").toLowerCase();
    const roleTitle = (r.role || "").toLowerCase();
    const jobId = (r.jobId || "").toLowerCase();
    return companyName.includes(q) || senderName.includes(q) || roleTitle.includes(q) || jobId.includes(q);
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
  const handleComplete = async (id: string) => {
    try {
      await markRequestCompleted(id);

      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: "completed" } : r
        )
      );

    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-gray-200">

      {/* NAVBAR — Admin Style */}
      <nav className="bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/employee/dashboard")}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="p-1.5 bg-white/10 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-sm font-bold tracking-widest text-white uppercase">Received Requests</h1>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-gray-700 px-4 py-2 rounded-full">
          <Activity className="w-4 h-4 text-gray-500" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{requests.length} Total</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8 lg:p-12 space-y-12">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-10">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-gray-900">Referral Requests</h2>
            <p className="text-sm text-gray-500 font-medium">Review and manage incoming referral requests.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, company, role..."
                className="pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-black/5 w-64 transition-all"
              />
            </div>
            {filterStatus !== "all" && (
              <button
                onClick={() => setFilterStatus("all")}
                className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition px-4 py-2.5 rounded-full border border-gray-200 hover:border-gray-400"
              >
                Clear Filter
              </button>
            )}
          </div>
        </header>

        {/* STAT FILTER CARDS */}
        <section className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
            <div className="w-1 h-1 bg-black rounded-full"></div> Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
              icon={<Inbox className="w-6 h-6" />}
              title="Total"
              count={requests.length}
              isActive={filterStatus === "all"}
              onClick={() => setFilterStatus("all")}
            />
            <StatCard
              icon={<Clock className="w-6 h-6" />}
              title="Pending"
              count={pending}
              isActive={filterStatus === "pending"}
              onClick={() => setFilterStatus("pending")}
              dark
            />
            <StatCard
              icon={<CheckCircle2 className="w-6 h-6" />}
              title="Approved"
              count={approved}
              isActive={filterStatus === "accepted"}
              onClick={() => setFilterStatus("accepted")}
            />
            <StatCard
              icon={<XCircle className="w-6 h-6" />}
              title="Rejected"
              count={rejected}
              isActive={filterStatus === "rejected"}
              onClick={() => setFilterStatus("rejected")}
            />
          </div>
        </section>

        {/* REQUEST LIST */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
              <div className="w-1 h-1 bg-black rounded-full"></div> Incoming Requests
            </h3>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-2 border-gray-100 border-t-black rounded-full animate-spin" />
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && requests.length === 0 && (
            <div className="bg-gradient-to-br from-white via-[#fcfcfc] to-[#f5f5f5] border border-gray-100 rounded-[2rem] p-14 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-600 font-semibold">No referral requests received</p>
              <p className="text-sm text-gray-400 mt-1">Incoming requests will appear here</p>
            </div>
          )}

          {/* NO FILTER RESULTS */}
          {!loading && requests.length > 0 && filteredRequests.length === 0 && (
            <div className="bg-gradient-to-br from-white via-[#fcfcfc] to-[#f5f5f5] border border-gray-100 rounded-[2rem] p-10 text-center shadow-sm">
              <p className="text-sm text-gray-400 font-medium">No {filterStatus} requests found.</p>
            </div>
          )}

          {/* CARDS */}
          {!loading && filteredRequests.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((req) => {
                return (
                  <RequestCard
                    key={req._id}
                    companyName={req.company?.name || "Unknown"}
                    companyLogo={req.company?.logo}
                    role={req.role}
                    jobId={req.jobId}
                    senderName={req.sender?.name}
                    status={
                      req.status === "pending"
                        ? "Pending"
                        : req.status === "accepted"
                          ? "Approved"
                          : "Rejected"
                    }
                    onView={() => handleView(req)}

                    onChat={() =>
                      setActiveChat({
                        requestId: req._id,
                        receiverId: req.sender?._id,
                      })
                    }
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* CHAT MODAL */}
      {activeChat && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={() => setActiveChat(null)}
        >
          <div
            className="w-full max-w-3xl h-[80vh] bg-white rounded-3xl overflow-hidden relative flex flex-col shadow-2xl border border-gray-100"
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
              className="absolute top-3 right-3 p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
      <EmployeeRequestModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        request={selectedRequest}
        onAccept={() => handleStatusChange(selectedRequest?._id, "accepted")}
        onReject={() => handleStatusChange(selectedRequest?._id, "rejected")}
        onComplete={() => handleComplete(selectedRequest._id)}

      />
    </div>
  );
};

export default RequestSection;

/* ── STAT CARD (Admin Dashboard Style) ── */
const StatCard = ({
  icon, title, count, isActive, onClick, dark = false,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  dark?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={`group relative text-left px-5 py-4 rounded-[2rem] border transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${dark
        ? 'bg-gradient-to-br from-[#1a1a1a] via-[#333] to-[#444] text-white border-gray-800 shadow-xl'
        : 'bg-gradient-to-br from-white via-[#fcfcfc] to-[#f5f5f5] text-gray-900 border-gray-100 shadow-sm'
        } ${isActive
          ? dark
            ? 'ring-2 ring-white/30'
            : 'ring-2 ring-black/20'
          : ''
        }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${dark
            ? 'bg-white/10'
            : 'bg-gray-50 group-hover:bg-black group-hover:text-white'
            } transition-colors duration-300`}
        >
          {icon}
        </div>

        <span
          className={`text-2xl font-semibold tracking-tight ${dark ? 'text-white' : 'text-gray-900'
            }`}
        >
          {count}
        </span>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide">{title}</p>
        <p
          className={`text-[11px] leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'
            }`}
        >
          {title === "Total" && "All received referral requests."}
          {title === "Pending" && "Awaiting your response."}
          {title === "Approved" && "Requests you've accepted."}
          {title === "Rejected" && "Requests you've declined."}
        </p>
      </div>
    </button>
  );
};

/* ── REQUEST CARD (Admin Dashboard Style) ── */
const RequestCard = ({
  companyName,
  companyLogo,
  role,
  jobId,
  senderName,
  status,
  onChat,
  onView
}: {
  companyName: string;
  companyLogo?: string;
  role: string;
  jobId?: string;
  senderName: string;
  status: "Pending" | "Approved" | "Rejected";
  onChat?: () => void;
  onView?: () => void;
}) => {
  return (
    <div className="group bg-gradient-to-br from-white via-[#fcfcfc] to-[#f5f5f5] rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 px-5 py-4 flex flex-col gap-3">

      {/* Top row */}
      <div className="flex items-center justify-between gap-3 w-full">

        {/* Left side */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {companyLogo ? (
            <img
              src={companyLogo}
              alt={companyName}
              className="w-10 h-10 rounded-xl object-contain border border-gray-100 bg-gray-50 p-1 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-sm font-bold text-gray-400 shrink-0">
              {companyName.charAt(0)}
            </div>
          )}

          <div className="min-w-0">
            <p className="font-bold text-gray-900 truncate text-sm">
              {companyName}
            </p>
            <p className="text-xs text-gray-400 truncate font-medium">
              {role} {jobId && <span className="text-gray-300 font-normal ml-1">#{jobId}</span>}
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">



          {/* View button */}
          <button
            onClick={onView}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter transition-all duration-200"
          >
            View
          </button>

        </div>

      </div>

      <div className="border-t border-gray-100 my-1" />

      {/* Sender */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
          {senderName?.charAt(0) || "?"}
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Request From
          </p>
          <p className="text-sm font-semibold text-gray-900">{senderName}</p>
        </div>
      </div>

      {/* Chat Button */}
      {status === "Approved" && (
        <button
          onClick={onChat}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 active:scale-95 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          Chat with Student
        </button>
      )}

    </div>
  );
};
