import { useEffect, useState } from "react";
import { getMySentRequests } from "../../services/request.service";
import Chat from "../../components/chat";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MessageCircle, Inbox, Clock, CheckCircle2, XCircle, X, Briefcase, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

const Request = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [requests, setRequests] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "accepted" | "rejected">("all");
  const [activeChat, setActiveChat] = useState<null | { requestId: string; receiverId: string }>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const pending = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "accepted").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;

  const filteredRequests = requests.filter((r) => {
    const statusMatch = filterStatus === "all" || r.status === filterStatus;
    if (!statusMatch) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const companyName = (r.company?.name || "").toLowerCase();
    const receiverName = (r.receiver?.name || "").toLowerCase();
    const roleTitle = (r.company?.jobs?.find((job: any) => job._id === r.role)?.title || "").toLowerCase();
    return companyName.includes(q) || receiverName.includes(q) || roleTitle.includes(q);
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
    const timer = setTimeout(() => {
      const req = requests.find(r => r._id === reqId);
      if (req && req.receiver?._id) {
        setActiveChat({ requestId: req._id, receiverId: req.receiver._id });
      }
      navigate(location.pathname, { replace: true, state: {} });
    }, 100);
    return () => clearTimeout(timer);
  }, [location.state, requests]);

  if (loading) {
    return (
      <div className="min-h-screen bg-rudra-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-800 border-t-amber-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rudra-black text-white font-sans selection:bg-amber-400/20">

      {/* NAVBAR — Student Style */}
      <nav className="h-16 bg-black flex items-center justify-between px-4 sm:px-8 text-white sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="w-7 h-7 rounded-md bg-amber-400 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-black" />
          </div>
          <h1 className="text-base font-semibold tracking-wide">
            My<span className="text-amber-400">Requests</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
          <span className="text-xs font-medium text-gray-400">{requests.length} total</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">

        {/* HEADER + SEARCH */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-white/5 pb-8">
          <div>
            <p className="text-amber-400 text-xs font-medium tracking-[0.2em] uppercase mb-1.5">Referral Tracker</p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-tight">My Referral Requests</h2>
            <p className="text-sm text-gray-500 font-light mt-1">Track all your sent referral requests in one place.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, company, role..."
                className="pl-11 pr-4 py-2.5 bg-white/5 border border-gray-400 placeholder:text-gray-400 rounded-full text-sm text-black  focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/10 w-64 transition-all"
              />
            </div>
            {filterStatus !== "all" && (
              <button
                onClick={() => setFilterStatus("all")}
                className="text-xs font-medium text-gray-500 hover:text-amber-400 transition px-4 py-2.5 rounded-full border border-white/10 hover:border-amber-400/30"
              >
                Clear
              </button>
            )}
          </div>
        </header>

        {/* STAT FILTER CARDS */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <p className="text-amber-400 text-xs font-medium tracking-[0.2em] uppercase">Overview</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              icon={<Inbox className="w-5 h-5" />}
              title="Total"
              count={requests.length}
              color="text-amber-500"
              isActive={filterStatus === "all"}
              onClick={() => setFilterStatus("all")}
            />
            <StatCard
              icon={<Clock className="w-5 h-5" />}
              title="Pending"
              count={pending}
              color="text-amber-500"
              isActive={filterStatus === "pending"}
              onClick={() => setFilterStatus("pending")}
              accent
            />
            <StatCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              title="Approved"
              count={approved}
              color="text-emerald-500"
              isActive={filterStatus === "accepted"}
              onClick={() => setFilterStatus("accepted")}
            />
            <StatCard
              icon={<XCircle className="w-5 h-5" />}
              title="Rejected"
              count={rejected}
              color="text-rose-400"
              isActive={filterStatus === "rejected"}
              onClick={() => setFilterStatus("rejected")}
            />
          </div>
        </section>

        {/* REQUEST LIST */}
        <section className="space-y-5">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <div className="h-px flex-1 bg-white/5" />
            <p className="text-xs font-medium text-gray-600 uppercase tracking-widest">Request History</p>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          {/* EMPTY STATE */}
          {!loading && requests.length === 0 && (
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-14 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-7 h-7 text-gray-600" />
              </div>
              <p className="text-white font-semibold">No referral requests yet</p>
              <p className="text-sm text-gray-500 mt-1">Send your first request to get started</p>
              <button
                onClick={() => navigate("/student/dashboard")}
                className="mt-6 px-6 py-2.5 bg-amber-400 text-black text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-amber-300 active:scale-95 transition-all"
              >
                Browse Companies
              </button>
            </div>
          )}

          {/* NO FILTER RESULTS */}
          {!loading && requests.length > 0 && filteredRequests.length === 0 && (
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-10 text-center">
              <p className="text-sm text-gray-500 font-medium">No {filterStatus} requests found.</p>
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
        </section>
      </main>

      {/* CHAT MODAL */}
      {activeChat && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
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
              className="absolute top-3 right-3 p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── STAT CARD (Student Theme) ── */
const StatCard = ({
  icon, title, count, color, isActive, onClick, accent = false,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  color: string;
  isActive: boolean;
  onClick: () => void;
  accent?: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl border shadow-sm px-5 py-4 cursor-pointer
        transition-all duration-200
        hover:shadow-xl hover:-translate-y-0.5
        ${isActive
          ? accent
            ? "border-amber-400 shadow-amber-400/10 ring-1 ring-amber-400/30"
            : "border-slate-300 shadow-md"
          : "border-slate-100"
        }
      `}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${accent ? "bg-amber-50 text-amber-500" : `bg-slate-50 ${color}`
        }`}>
        {icon}
      </div>
      <p className="text-2xl font-semibold text-slate-800 leading-tight">{count}</p>
      <p className="text-xs text-slate-400 font-light mt-0.5">{title}</p>
    </div>
  );
};

/* ── REQUEST CARD (Student Theme) ── */
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
    Approved: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", dot: "bg-emerald-500" },
    Rejected: { bg: "bg-red-50", text: "text-red-500", border: "border-red-200", dot: "bg-red-500" },
    Pending: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", dot: "bg-amber-400 animate-pulse" },
  }[status];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-200 p-5 flex flex-col gap-4">

      {/* Top: Company + Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {companyLogo ? (
            <img
              src={companyLogo}
              alt={companyName}
              className="w-10 h-10 rounded-xl object-contain border border-slate-100 bg-slate-50 p-1 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-sm font-bold text-amber-600 shrink-0">
              {companyName.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 truncate text-sm">{companyName}</p>
            <p className="text-xs text-slate-400 truncate">{role}</p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
          {status}
        </span>
      </div>

      <div className="border-t border-slate-50" />

      {/* Receiver */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-xs font-bold text-amber-600 shrink-0">
          {receiverName.charAt(0)}
        </div>
        <div>
          <p className="text-xs text-slate-400">Referral sent to</p>
          <p className="text-sm font-medium text-slate-700">{receiverName}</p>
        </div>
      </div>

      {/* Chat Button */}
      {status === "Approved" && (
        <button
          onClick={onChat}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-400 text-black text-sm font-semibold hover:bg-amber-300 active:scale-95 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          Chat with Referrer
        </button>
      )}
    </div>
  );
};

export default Request;