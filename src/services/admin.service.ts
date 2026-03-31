const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type AdminStats = {
  counts: {
    students: number;
    employees: number;
    totalCompanies: number;
    pendingCompanies: number;
    totalStories: number;
    pendingStories: number;
  };
  recentUsers: {
    _id: string;
    name: string;
    email: string;
    role: "student" | "employee";
    createdAt: string;
  }[];
  recentCompanies: {
    _id: string;
    name: string;
    industry: string;
    location: string;
    isVerified: boolean;
    createdAt: string;
  }[];
};
export interface Transaction {
  _id: string;
  type: "credit" | "debit";
  amount: number;
  status: "pending" | "completed" | "failed";
  createdAt: string;
  description?: string;
}

export const getAdminStats = async (): Promise<{ data: AdminStats }> => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/admin/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch admin stats");
  }

  return res.json();
};

export const getUsersByRole = async (role: "student" | "employee"): Promise<{ success: boolean, data: any[] }> => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/admin/users/${role}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${role}s`);
  }

  return res.json();
};

export const getAdminPosts = async () => {
  const res = await fetch(`${BASE_URL}/api/posts/admin/posts`);

  if (!res.ok) throw new Error("Failed to fetch posts");

  return res.json();
};
export const deleteAdminPost = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/posts/admin/posts/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete post");

  return res.json();
};

export const getAdminTransactions = async (): Promise<{ success: boolean; data: Transaction[] }> => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/payment/all-transactions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return res.json();
  };

export const getAdminRequests = async (): Promise<{ success: boolean; data: any[] }> => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/admin/requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch requests");
  }

  return res.json();
};