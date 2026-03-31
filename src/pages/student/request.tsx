import { useEffect, useState } from "react";
import { fakePaymentSuccess, getMySentRequests } from "../../services/request.service";
import Chat from "../../components/chat";
import { useNavigate } from "react-router-dom";
import { ChevronsLeft, MessageCircle, Inbox, Clock, CheckCircle2, XCircle, X, Briefcase, Search, CreditCard, Activity, FileText } from "lucide-react";
import { useLocation } from "react-router-dom";
import PaymentModal from "@/components/ui/Paymentmodal";

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
  const [activePayment, setActivePayment] = useState<null | {
    amount: string;
    merchantName: string;
    merchantInitial: string;
    description: string;
    orderId: string;
  }>(null);


  const filteredRequests = requests.filter((r) => {
    const statusMatch = filterStatus === "all" || r.status === filterStatus;
    if (!statusMatch) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const companyName = (r.company?.name || "").toLowerCase();
    const receiverName = (r.receiver?.name || "").toLowerCase();
    const roleTitle = (r.role || "").toLowerCase();
    const jobId = (r.jobId || "").toLowerCase();
    return companyName.includes(q) || receiverName.includes(q) || roleTitle.includes(q) || jobId.includes(q);
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-200">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
          <div className="p-1.5 bg-gray-100 rounded-lg">
            <Briefcase className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-sm font-bold tracking-widest text-black uppercase">Sent Requests</h1>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full hidden sm:flex">
          <Activity className="w-4 h-4 text-gray-400" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">{requests.length} Total</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8 lg:p-12 space-y-12">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-10">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-gray-900">My <span className="text-amber-400">Referrals</span></h2>
            <p className="text-sm text-gray-500 font-medium">Track all your sent referral requests in one place.</p>
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
              <div className="w-1 h-1 bg-black rounded-full"></div> Request History
            </h3>
          </div>

          {/* EMPTY STATE */}
          {!loading && requests.length === 0 && (
            <div className="bg-gradient-to-br from-white via-[#fcfcfc] to-[#f5f5f5] border border-gray-100 rounded-[2rem] p-14 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-600 font-semibold">No referral requests yet</p>
              <p className="text-sm text-gray-400 mt-1">Send your first request to get started</p>
              <button
                onClick={() => navigate("/student/companies")}
                className="mt-6 px-8 py-3 bg-amber-400 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 active:scale-95 transition-all shadow-md"
              >
                Browse Companies
              </button>
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
                    companyName={req.company?.name || "Unknown Company"}
                    companyLogo={req.company?.logo}
                    role={req.role}
                    jobId={req.jobId}
                    receiverName={req.receiver?.name || "Unknown User"}
                    status={
                      req.status === "pending"
                        ? "Pending"
                        : req.status === "accepted"
                          ? "Approved"
                          : req.status === "completed"
                            ? "Completed"
                            : "Rejected"
                    }
                    onChat={() => {
                      if (req.receiver?._id) {
                        setActiveChat({ requestId: req._id, receiverId: req.receiver._id });
                      }
                    }}
                    onPay={() =>
                      setActivePayment({
                        amount: "499.00",
                        merchantName: req.company?.name || "Company",
                        merchantInitial: (req.company?.name || "C").charAt(0),
                        description: `Referral fee · ${req.role}`,
                        orderId: req._id,
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
      {activePayment && (
        <PaymentModal
          amount={activePayment.amount}
          merchantName={activePayment.merchantName}
          merchantInitial={activePayment.merchantInitial}
          description={activePayment.description}
          orderId={activePayment.orderId}
          onClose={() => setActivePayment(null)}
          onSuccess={async () => {

            await fakePaymentSuccess(activePayment!.orderId, 499)

            setRequests(prev =>
              prev.map(r =>
                r._id === activePayment?.orderId
                  ? { ...r, paymentStatus: "paid" }
                  : r
              )
            )

            setActivePayment(null)
          }}
        />
      )}
    </div>
  );
};

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
          {title === "Total" && "All sent referral requests."}
          {title === "Pending" && "Awaiting response."}
          {title === "Approved" && "Requests accepted."}
          {title === "Rejected" && "Requests declined."}
        </p>
      </div>
    </button>
  );
};

/* ── REQUEST CARD (Admin Dashboard Style) ── */
const RequestCard = ({
  companyName, companyLogo, role, jobId, receiverName, status, onChat, onPay
}: {
  companyName: string;
  companyLogo?: string;
  role: string;
  jobId?: string;
  receiverName: string;
  status: "Pending" | "Approved" | "Rejected" | "Completed";
  onChat?: () => void;
  onPay?: () => void;
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
            <p className="text-[11px] text-gray-500 truncate mt-0.5">
              {role} {jobId && <span className="text-gray-400 font-normal ml-1">#{jobId}</span>}
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${status === "Approved" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
            status === "Rejected" ? "bg-rose-50 text-rose-600 border border-rose-100" :
              status === "Completed" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                "bg-amber-50 text-amber-600 border border-amber-100"
            }`}>
            {status}
          </span>
        </div>

      </div>

      <div className="border-t border-gray-100 my-1" />

      {/* Receiver */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
          {receiverName?.charAt(0) || "?"}
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Referral Sent To
          </p>
          <p className="text-sm font-semibold text-gray-900">{receiverName}</p>
        </div>
      </div>

      {status === "Approved" && (
        <button
          onClick={onPay}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-emerald-500 text-emerald-600 text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-50 active:scale-95 transition-all mt-1"
        >
          <CreditCard className="w-4 h-4" />
          Pay Referral Fee
        </button>
      )}

      {/* Chat Button */}
      {(status === "Approved" || status === "Completed") && (
        <button
          onClick={onChat}
          className="bg-gradient-to-br from-[#1a1a1a] via-[#333] to-[#444] border-gray-800 shadow-xl flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 active:scale-95 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          Chat with Referrer
        </button>
      )}

    </div>
  );
};

export default Request;