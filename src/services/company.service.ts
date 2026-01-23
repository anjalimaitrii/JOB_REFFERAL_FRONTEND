const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const getCompanies = async () => {
  const res = await fetch(`${BASE_URL}/api/company`)

  if (!res.ok) {
    throw new Error("Failed to fetch companies")
  }

  return res.json()
}
export const getCollegesWithEmployees = async () => {
  const res = await fetch(`${BASE_URL}/api/college/with-employees`);

  if (!res.ok) {
    throw new Error("Failed to fetch colleges");
  }

  return res.json(); 
};

export const getEmployeesByCollege = async (collegeName: string) => {
  const res = await fetch(
    `${BASE_URL}/api/college/employees?collegeName=${encodeURIComponent(
      collegeName
    )}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch employees by college");
  }

  return res.json(); 
};