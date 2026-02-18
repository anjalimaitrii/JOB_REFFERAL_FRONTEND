const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const getNotifications = async () => {
  const res = await fetch(`${BASE_URL}/api/notifications`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
};



export const markAsRead = async (id: string) => {
  const res = await fetch(
    `${BASE_URL}/api/notifications/${id}/read`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to mark as read");
  return res.json();
};



export const markAllRead = async () => {
  const res = await fetch(
    `${BASE_URL}/api/notifications/mark-all-read`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to mark all as read");
  return res.json();
};



export const markRequestMessagesRead = async (requestId: string) => {
  const res = await fetch(
    `${BASE_URL}/api/notifications/request/${requestId}/read`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to mark chat as read");
  return res.json();
};
