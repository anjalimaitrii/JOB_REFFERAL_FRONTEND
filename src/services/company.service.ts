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

export const registerCompany = async (payload: {
  name: string;
  logo: string;
  industry: string;
  location: string;
  otherLocations?: string[];
  companySize: string;
  website: string;
  jobs?: { title: string }[];
}) => {
  const res = await fetch(`${BASE_URL}/api/company`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to register company");
  }

  return res.json();
};

// Admin APIs
export const getAllCompaniesForAdmin = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/api/company/admin/all`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch companies for admin");
  }

  return res.json();
};

export const verifyCompany = async (companyId: string, isVerified: boolean) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/api/company/${companyId}/verify`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ isVerified }),
  });

  if (!res.ok) {
    throw new Error("Failed to verify company");
  }

  return res.json();
};