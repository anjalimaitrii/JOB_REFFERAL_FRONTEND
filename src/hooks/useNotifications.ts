import { useEffect, useState } from "react";
import {
  getNotifications,
  markAsRead,
  markAllRead,
} from "../services/notification.service";
import socket from "../services/socket";

export interface Notification {
  _id: string;
  sender: {
    name: string;
  };
  type:
    | "message"
    | "request_accepted"
    | "request_rejected"
    | "request_received";
  request?: {
    _id: string;
  };
  createdAt: string;
  isRead: boolean;
}

const useNotifications = () => {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifs(res.data || []);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    setNotifs((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  useEffect(() => {
    loadNotifications();

    socket.on("new-notification", (notif: Notification) => {
      setNotifs((prev) => [notif, ...prev]);
    });

    return () => {
      socket.off("new-notification");
    };
  }, []);

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  return {
    notifs,
    loading,
    unreadCount,
    handleMarkAsRead,
    handleMarkAllRead,
  };
};

export default useNotifications;
