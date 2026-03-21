import { useEffect, useState } from "react";
import { getProfile } from "../services/user.service";
import { getNotifications } from "../services/notification.service";
import { Wallet as WalletIcon, ChevronsLeft, TrendingUp, History, User, Coins } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface Transaction {
    _id: string;
    sender?: {
        name: string;
    };
    type: string;
    createdAt: string;
    message?: string;
    amount?: number; // In case backend eventually sends specific amounts
}

const Wallet = () => {
    const [user, setUser] = useState<any>(null);
    const [notifications, setNotifications] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem("role") || "student";
    const isStudentMode = role === "employee" && location.pathname.includes("/student");
    const isEmployee = role === "employee" && !isStudentMode;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, notifRes] = await Promise.all([
                    getProfile(),
                    getNotifications(),
                ]);
                setUser(profileRes);

                // Filter notifications for refund/wallet relevant ones

                const filtered = notifRes.data.filter((n: any) =>
                    isEmployee ? n.type === "request_received" : n.type === "refund_received"
                );
                setNotifications(filtered);
            } catch (err) {
                console.error("Failed to fetch wallet data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isEmployee]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-8 font-sans selection:bg-amber-100">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-1.5 rounded-xl transition-colors hover:bg-slate-200 text-slate-600"
                    >
                        <ChevronsLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-bold text-slate-800">
                        {isEmployee ? "My Wallet" : "My Refunds"}
                    </h1>
                </div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`relative overflow-hidden rounded-3xl p-7 mb-6 shadow-xl ${isEmployee
                        ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white'
                        : 'bg-gradient-to-br from-amber-400 to-orange-500 text-black'
                        }`}
                >
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <p className={`text-[10px] font-bold opacity-70 mb-1 tracking-widest uppercase`}>
                                {isEmployee ? "Total Balance" : "Total Refunded"}
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black tabular-nums tracking-tight">
                                    ₹{user?.wallet || 0}
                                </span>
                                <span className="text-sm font-bold opacity-60">INR</span>
                            </div>
                        </div>

                        <div className={`p-3.5 rounded-2xl ${isEmployee ? 'bg-white/10' : 'bg-black/5'} backdrop-blur-md`}>
                            <WalletIcon className="w-9 h-9" />
                        </div>
                    </div>

                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-xl" />
                </motion.div>

                {/* Stats/Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="p-5 rounded-3xl border bg-white border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-500">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Performance</p>
                        </div>
                        <p className="text-xl font-bold text-slate-800 tracking-tight">
                            ₹{user?.wallet || 0}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">Total accumulated since registration</p>
                    </div>

                    <div className="p-5 rounded-3xl border bg-white border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500">
                                <User className="w-4 h-4" />
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Account</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                            Verified
                        </span>
                    </div>
                </div>

                {/* History Section */}
                <div className="mb-20">
                    <div className="flex items-center gap-2 mb-5 ml-1">
                        <History className="w-4 h-4 text-amber-500" />
                        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-[0.15em]">
                            {isEmployee ? "Recent Activity" : "Refund History"}
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {notifications.length > 0 ? (
                            notifications.map((n, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={n._id}
                                    className="flex items-center justify-between p-4 rounded-2xl border transition-all hover:bg-slate-50 bg-white border-slate-100 shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-slate-50 text-amber-500 border border-slate-100">
                                            <Coins className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[13px] text-slate-800 tracking-wide">
                                                {n.type === "refund_received" ? "Credit Received" : "Activity Log"}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                                {n.sender?.name ? `From ${n.sender.name}` : "System Update"} • {new Date(n.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-sm tracking-tight text-emerald-600">
                                            +{n.amount ? `₹${n.amount}` : "₹--"}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 text-slate-400 bg-white">
                                <p className="text-xs font-medium uppercase tracking-widest">No activity found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
