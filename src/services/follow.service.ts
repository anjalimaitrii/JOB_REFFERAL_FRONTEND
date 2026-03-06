const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const followEmployee = async (employeeId: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/api/follow/follow`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ employeeId }),
    });

    if (!res.ok) {
        throw new Error("Failed to follow");
    }

    return res.json();
};

export const unfollowEmployee = async (employeeId: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/api/follow/unfollow`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ employeeId }),
    });

    if (!res.ok) {
        throw new Error("Failed to unfollow");
    }

    return res.json();
};
