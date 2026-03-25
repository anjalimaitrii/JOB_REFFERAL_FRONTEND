const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Transaction {
    _id: string;
    type: "credit" | "debit";
    amount: number;
    status: "pending" | "completed" | "failed";
    createdAt: string;
    description?: string;
}

export const getTransactions = async (): Promise<{ success: boolean; data: Transaction[] }> => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/payment/transactions`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch transactions");
    }

    return res.json();
};

export const withdrawAmount = async (amount: number): Promise<{ success: boolean; message: string }> => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/payment/withdraw`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Withdrawal failed");
    }

    return res.json();
};
