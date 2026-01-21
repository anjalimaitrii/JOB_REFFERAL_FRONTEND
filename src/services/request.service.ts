const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const sendRequestToEmployee = async (payload:{receiver: string,company:string,role:string}) => {
  const token = localStorage.getItem("token") 

  const res = await fetch(`${BASE_URL}/api/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error("Failed to send request")
  }

  return res.json()
}
export const getMyRequests = async () => {
  const token = localStorage.getItem("token")

  const res = await fetch(`${BASE_URL}/api/request/my`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch requests")
  }

  return res.json()
}

export const updateRequestStatus = async (
  requestId: string,
  status: "accepted" | "rejected"
) => {
  const res = await fetch(
    `${BASE_URL}/api/request/${requestId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) throw new Error("Failed to update request");
  return res.json();
};
export const getMySentRequests = async () => {
  const token = localStorage.getItem("token")

  const res = await fetch(`${BASE_URL}/api/request/my-sent`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch sent requests")
  }

  return res.json()
}