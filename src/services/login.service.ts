const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const loginUser = async (payload: {
  email: string
  password: string

}) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error('Login failed')
  }

  return res.json()
}


export const adminLogin = async (payload: {
  email: string
  password: string
}) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      role: "admin",
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Admin login failed")
  }

  return data
}