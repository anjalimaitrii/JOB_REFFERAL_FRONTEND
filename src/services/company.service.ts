const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ================= TYPES ================= */
export type CompanyPayload = {
  name: string;
  logo?: string;
  industry?: string;
  location: string;
  otherLocations?: string[];
  companySize?: string;
  website?: string;
};

/* ================= API CALLS ================= */

/** POST - create company */
export const createCompany = async (payload: CompanyPayload) => {
  const res = await fetch(`${BASE_URL}/api/company`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create company");
  }

  return res.json();
};

/** GET - all companies */
export const getAllCompanies = async () => {
  const res = await fetch(`${BASE_URL}/api/company`);

  if (!res.ok) {
    throw new Error("Failed to fetch companies");
  }

  return res.json();
};

/** GET - company by id */
export const getCompanyById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/company/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch company");
  }

  return res.json();
};
