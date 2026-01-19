const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const getCompanies = async () => {
  const res = await fetch(`${BASE_URL}/api/company`)

  if (!res.ok) {
    throw new Error("Failed to fetch companies")
  }

  return res.json()
}
