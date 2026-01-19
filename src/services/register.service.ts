const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const registerStudent = async (payload: {
  name: string
  email: string
  password: string
  // college: string
  // degree: string
}) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, role: 'student' }),
  })

  if (!res.ok) throw new Error('Student registration failed')
  return res.json()
}

export const registerEmployee = async (payload: {
  name: string
  email: string
  password: string
  company: string
  contact: string
  designation: string
}) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, role: 'employee' }),
  })

  if (!res.ok) throw new Error('Employee registration failed')
  return res.json()
}
