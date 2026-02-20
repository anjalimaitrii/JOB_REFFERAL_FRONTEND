const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* Get All Success Stories */
export const getSuccessStories = async () => {
    const token = localStorage.getItem("token");
  const res = await fetch(
    `${BASE_URL}/api/success-stories`,{
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