const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const getProfile = async () => {
  const token = localStorage.getItem('token')

  const res = await fetch(`${BASE_URL}/api/auth/get`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error('Failed to fetch user')
  return res.json()
}

export const updateProfile = async (data: any) => {
  const token = localStorage.getItem('token')
  const isFormData = data instanceof FormData

  const res = await fetch(`${BASE_URL}/api/auth/update`, {
    method: 'PUT',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${token}`,
    },
    body: isFormData ? data : JSON.stringify(data),
  })

  if (!res.ok) throw new Error('Update failed')
  return res.json()
}

export const sendOtp = async (email: string) => {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE_URL}/api/auth/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to send OTP')
  return data
}

export const verifyOtp = async (email: string, otp: string) => {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, otp }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Verification failed')
  return data
}
