const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface SuccessStory {
  _id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  company: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

/* Get All Approved Success Stories */
export const getSuccessStories = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${BASE_URL}/api/success-stories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch success stories");
  }

  return res.json();
};


/*  Create Success Story (Review Submit) */
export const createSuccessStory = async (data: {
  rating: number;
  comment: string;
  company: string;
  role: string;
}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${BASE_URL}/api/success-stories`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to submit review");
  }

  return result;
};

/* Admin: Get All Success Stories */
export const getAllSuccessStoriesForAdmin = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/success-stories/admin/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch all success stories");
  }

  return res.json();
};

/* Admin: Verify Success Story */
export const verifySuccessStory = async (id: string, status: "approved" | "rejected" | "pending") => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/api/success-stories/${id}/verify`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to verify success story");
  }

  return res.json();
};
