const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getChatByRequest = async (requestId: string) => {
  const res = await fetch(`${BASE_URL}/api/chat/${requestId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch chat");
  return res.json();
};
