import { useEffect, useState } from "react";
import { getMySentRequests } from "../../services/request.service";
import Chat from "../../components/chat";
import { useNavigate } from "react-router-dom";
import { ChevronsLeft } from "lucide-react";

function Request() {
  const [requests, setRequests] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<null | {
    requestId: string;
    receiverId: string;
  }>(null);
  const navigate = useNavigate();
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
    <div className="px-6 md:px-10 mt-8 max-w-8xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Back Arrow */}
          <button onClick={() => navigate(-1)}>
            <ChevronsLeft size={18} />
          </button>
          <h2 className="text-2xl font-semibold tracking-tight">
            My Referral Requests
          </h2>
        </div>

        <span className="text-sm text-gray-500">
          Total: {requests?.length || 0}
        </span>
      </div>

      {/* Empty State */}
      {!requests?.length && (
        <div className="bg-white border rounded-2xl p-10 text-center shadow-sm">
          <p className="text-gray-500">No referral requests yet.</p>
        </div>
      )}

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {requests.map((req) => {
          const roleTitle =
            req.company?.jobs.find((job: any) => job._id === req.role)?.title ||
            "N/A";

          const statusStyles: any = {
            accepted: "bg-green-100 text-green-700 border-green-200",
            rejected: "bg-red-100 text-red-700 border-red-200",
            pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
          };

          return (
            <div
              key={req._id}
              className="group bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-200"
            >
              {/* Employee Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-600">
                  {req.receiver?.name?.charAt(0) || "E"}
                </div>

                <div>
                  <p className="font-semibold text-gray-800 leading-none">
                    {req.receiver.name}
                  </p>
                  <p className="text-xs text-gray-500">Employee</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-800">Company:</span>{" "}
                  {req.company.name}
                </p>

                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-800">Role:</span>{" "}
                  {roleTitle}
                </p>
              </div>

              {/* Status + Action */}
              <div className="flex items-center justify-between mt-4">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-lg border capitalize ${
                    statusStyles[req.status] ||
                    "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  {req.status}
                </span>

                {req.status === "accepted" && (
                  <button
                    onClick={() =>
                      setActiveChat({
                        requestId: req._id,
                        receiverId: req.receiver._id,
                      })
                    }
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition"
                  >
                     Chat
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Modal */}
      {activeChat && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="w-full max-w-3xl h-[85vh] bg-white rounded-2xl overflow-hidden flex flex-col relative shadow-2xl">
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
              className="absolute top-3 right-3 text-gray-700 hover:text-black text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Request;
