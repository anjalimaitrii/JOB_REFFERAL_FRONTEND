const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const sendRequestToEmployee = async (employeeId: string) => {
  const token = localStorage.getItem("token") 

  const res = await fetch(`${BASE_URL}/api/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      employeeId, 
    }),
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