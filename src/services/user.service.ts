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

  const res = await fetch(`${BASE_URL}/api/auth/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error('Update failed')
  return res.json()
}
