const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getColleges = async (name: string = "") => {
  const res = await fetch(`${BASE_URL}/api/college`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }), 
  });

  if (!res.ok) {
    throw new Error("Failed to fetch colleges");
  }

  const json = await res.json();

  return json.data || [];
};
