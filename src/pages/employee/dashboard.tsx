import { useNavigate } from "react-router-dom";
import {
  getMyRequests,
  updateRequestStatus,
} from "../../services/request.service";
import { useEffect, useState } from "react";


const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const pending = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "accepted").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;
  // const [setActiveChat] = useState<null | {
  //   requestId: string;
  //   receiverId: string;
  // }>(null);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };
  const goToProfile = () => {
    navigate("/profile");
  };
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getMyRequests();
        setRequests(res.data);
      } catch (err) {
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
    } catch (err) {
      alert("Failed to update request");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="relative">
        <div className="rounded-b-[40px] bg-gradient-to-r from-teal-400 h-[300px] via-cyan-400 to-emerald-300 px-10 py-12 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold">Hello Anjali,</h1>
              <p className="opacity-90">
                Welcome to the Employee Referral Portal
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/employee/companies")}
                className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-sm"
              >
                Apply to Other Companies
              </button>
              <button
                onClick={goToProfile}
                className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-sm"
              >
                Profile
              </button>

              <button
                onClick={logout}
                className="px-4 py-2 rounded-full bg-red-500/80 hover:bg-red-600 text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <div className="relative w-full max-w-xl">
              <input
                placeholder="Search students, job roles..."
                className="w-full px-6 py-3 rounded-full
                text-gray-700 shadow-lg focus:outline-none"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>
        </div>

    
        <div className=" z-10 -mt-10 px-10">
          <div className="bg-white rounded-3xl shadow-xl grid grid-cols-2 md:grid-cols-4 overflow-hidden">
            <BaseCard title="Pending" count={pending.toString()} />
            <BaseCard title="Approved" count={approved.toString()} />
            <BaseCard title="Rejected" count={rejected.toString()} />
            <BaseCard title="Total" count={requests.length.toString()} />
          </div>
        </div>
      </div>

      <div className="px-10 mt-14">
        <h2 className="text-xl font-semibold mb-6">My Referrals</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <StudentCard
              key={req._id}
              name={req.sender.name}
              email={req.sender.email}
              role={
                req.company?.jobs.find((job: any) => job._id === req.role)
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
              // onChat={() =>
              //   setActiveChat({
              //     requestId: req._id,
              //     receiverId: req.sender._id,
              //   })
              // }
            />
          ))}
        </div>
      </div>
      {/* {activeChat && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="w-full max-w-3xl h-[85vh] bg-white rounded-2xl overflow-hidden relative flex flex-col">
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
              className="absolute top-3 right-3 text-black text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

const BaseCard = ({ title, count }: { title: string; count: string }) => (
  <div
    className="
      bg-white
      flex flex-col items-center justify-center
      p-6 border
      transition-all duration-300 ease-out
      hover:-translate-y-4
      hover:shadow-2xl
      cursor-pointer
    "
  >
    <p className="text-2xl font-bold text-indigo-600">{count}</p>
    <p className="text-sm text-gray-600 mt-1">{title}</p>
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
    <div className="relative bg-white rounded-2xl shadow hover:shadow-xl transition p-6">
      <div className="absolute top-4 right-4">
        <span
          onClick={() => status === "Pending" && setOpen(!open)}
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusStyle}`}
        >
          {status}
          {status === "Pending" && <span className="text-[10px]">▾</span>}
        </span>

        {open && status === "Pending" && (
          <div className="absolute right-0 mt-2 w-36 bg-white border rounded-xl shadow-lg z-20 overflow-hidden">
            <button
              onClick={() => {
                onAccept?.();
                setOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-green-50 text-green-600"
            >
              Approve
            </button>

            <button
              onClick={() => {
                onReject?.();
                setOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-500">{email}</p>

      <div className="mt-4">
        <p className="text-sm text-gray-500">Job Role</p>
        <p className="font-medium">{role}</p>
      </div>
      {status === "Approved" && (
        <button
          onClick={onChat}
          className="mt-4 px-4 py-2 rounded-full bg-indigo-500 text-white text-sm"
        >
          Chat
        </button>
      )}
    </div>
  );
};

export default EmployeeDashboard;
