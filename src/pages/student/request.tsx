import { useEffect, useState } from "react";
import { getMySentRequests } from "../../services/request.service";


function Request() {
  const [requests, setRequests] = useState<any[]>([]);
  const [, setActiveChat] = useState<null | {
    requestId: string;
    receiverId: string;
  }>(null);

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
    <div>
      <div className="px-10 mt-8">
        <h2 className="text-xl font-semibold mb-4">My Referral Requests</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((req) => (
            <div key={req._id} className="bg-white rounded-xl p-4 shadow">
              <p className="font-medium">Employee : {req.receiver.name}</p>
              <p className="text-sm text-gray-500">
                Company : {req.company.name}
              </p>
              <p className="text-sm text-gray-500">
                Role :{" "}
                {req.company?.jobs.find((job: any) => job._id === req.role)
                  ?.title || "N/A"}
              </p>

              <span
                className={`mt-2 inline-block px-3 py-1 rounded-full text-sm
            ${
              req.status === "accepted"
                ? "bg-green-100 text-green-600"
                : req.status === "rejected"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-600"
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
                  className="mt-3 px-4 py-2 rounded-full bg-indigo-500 text-white text-sm"
                >
                  Chat
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* {activeChat && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="w-full max-w-3xl h-[85vh] bg-white rounded-2xl overflow-hidden flex flex-col relative">
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
}

export default Request;
