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
