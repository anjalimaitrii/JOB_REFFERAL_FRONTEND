import { useEffect, useState } from "react";
import { getMySentRequests } from "../../services/request.service";
import Chat from "../../components/chat";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Briefcase, ChevronLeft } from "lucide-react";

const Request = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "accepted" | "rejected">("all");

  const pending = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "accepted").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;

  const filteredRequests = requests.filter((r) => {
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
        const res = await getMySentRequests();
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to fetch sent requests");
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">

      {/* NAVBAR */}
      <div className="h-16 bg-black flex items-center justify-between px-4 sm:px-8 text-white shadow sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="p-1 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <h1 className="text-base sm:text-lg font-semibold">
            My Requests
          </h1>
        </div>


      </div>

      {/* CONTENT */}
      <div className="px-4 sm:px-10 py-6">

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard
            title="Total"
            count={requests.length}
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

        <h2 className="text-xl font-semibold mb-6">Request History</h2>

        {requests.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <p className="text-gray-500">You haven't made any referral requests yet.</p>
            <button
              onClick={() => navigate("/student/dashboard")}
              className="mt-4 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
            >
              Browse Companies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((req) => {
              const roleTitle = req.company?.jobs.find((job: any) => job._id === req.role)?.title || "N/A";

              return (
                <RequestCard
                  key={req._id}
                  companyName={req.company.name}
                  role={roleTitle}
                  receiverName={req.receiver.name}
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
                      receiverId: req.receiver._id,
                    })
                  }
                />
              )
            })}
          </div>
        )}
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
              className="absolute top-3 right-3 text-xl hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- UI HELPERS ---------- */

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

export default Request;
