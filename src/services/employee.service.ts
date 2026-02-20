const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Get employees by companyId
 * (role === "employee" && company match)
 */
export const getEmployeesByCompany = async (companyId: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${BASE_URL}/api/auth/company/${companyId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch employees");
  }

  return res.json();
};

export const getAllEmployees = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/auth/employees`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch employees");

  return res.json();
};