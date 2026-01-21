import { useEffect, useState } from "react"
import { getMySentRequests } from "../../services/request.service"


function Request() {
    const [requests, setRequests] = useState<any[]>([])
     useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getMySentRequests()
        setRequests(res.data)
      } catch (err) {
        console.error("Failed to fetch sent requests")
      }
    }

    fetchRequests()
  }, [])

  return (
    <div><div className="px-10 mt-8">
  <h2 className="text-xl font-semibold mb-4">My Referral Requests</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {requests.map(req => (
      <div
        key={req._id}
        className="bg-white rounded-xl p-4 shadow"
      >
        <p className="font-medium">Employee : {req.receiver.name}</p>
        <p className="text-sm text-gray-500">Company : {req.company.name}</p>
        <p className="text-sm text-gray-500">Role : {
                req.company?.jobs.find((job: any) => job._id === req.role)
                  ?.title || "N/A"
              }</p>
        

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
      </div>
    ))}
  </div>
</div>
</div>
  )
}

export default Request