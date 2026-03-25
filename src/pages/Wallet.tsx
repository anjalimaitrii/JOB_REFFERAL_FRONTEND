import { useEffect, useState } from "react";
import { getProfile } from "../services/user.service";
import { getTransactions, withdrawAmount } from "../services/payment.service";
import type { Transaction } from "../services/payment.service";
import { Wallet as WalletIcon, ChevronsLeft, TrendingUp, History, User, Coins, ArrowUpRight, ArrowDownLeft, X, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Wallet = () => {
    const [user, setUser] = useState<any>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [withdrawOpen, setWithdrawOpen] = useState(false);
    const [withdrawValue, setWithdrawValue] = useState("");
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem("role") || "student";
    const isStudentMode = role === "employee" && location.pathname.includes("/student");
    const isEmployee = role === "employee" && !isStudentMode;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [profileRes, transRes] = await Promise.all([
                getProfile(),
                getTransactions(),
            ]);
            setUser(profileRes);
            setTransactions(transRes.data || []);
        } catch (err) {
            console.error("Failed to fetch wallet data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async () => {
        const amt = parseFloat(withdrawValue);
        if (!amt || amt <= 0) return alert("Please enter a valid amount");
        if (amt > (user?.wallet || 0)) return alert("Insufficient balance");

        try {
            setWithdrawLoading(true);
            const res = await withdrawAmount(amt);
            if (res.success) {
                alert("Withdrawal request submitted successfully!");
                setWithdrawOpen(false);
                setWithdrawValue("");
                fetchData(); // Refresh balance and transactions
            }
        } catch (err: any) {
            alert(err.message || "Withdrawal failed");
        } finally {
            setWithdrawLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-8 font-sans selection:bg-amber-100 pb-24">
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
                        My Wallet
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
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1">
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

                        <div className="flex items-center gap-4">
                            {isEmployee && (
                                <button
                                    onClick={() => setWithdrawOpen(true)}
                                    className="px-6 py-3 bg-white text-indigo-600 rounded-2xl text-sm font-bold shadow-lg hover:scale-105 transition-transform active:scale-95"
                                >
                                    Withdraw
                                </button>
                            )}
                            <div className={`p-3.5 rounded-2xl ${isEmployee ? 'bg-white/10' : 'bg-black/5'} backdrop-blur-md`}>
                                <WalletIcon className="w-9 h-9" />
                            </div>
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
                            Recent Activity
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {transactions.length > 0 ? (
                            transactions.map((t, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={t._id}
                                    className="flex items-center justify-between p-4 rounded-2xl border transition-all hover:bg-slate-50 bg-white border-slate-100 shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl border ${t.type === 'credit'
                                            ? 'bg-emerald-50 text-emerald-500 border-emerald-100'
                                            : 'bg-rose-50 text-rose-500 border-rose-100'
                                            }`}>
                                            {t.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[13px] text-slate-800 tracking-wide">
                                                {t.type === "credit" ? "Credited" : "Debited"}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-widest">
                                                {t.status} • {new Date(t.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-black text-sm tracking-tight ${t.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {t.type === 'credit' ? '+' : '-'}₹{t.amount}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 text-slate-400 bg-white">
                                <p className="text-xs font-medium uppercase tracking-widest">No transactions found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Withdraw Modal */}
            <AnimatePresence>
                {withdrawOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setWithdrawOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl overflow-hidden"
                        >
                            <button
                                onClick={() => setWithdrawOpen(false)}
                                className="absolute right-6 top-6 p-2 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className="p-4 bg-indigo-50 text-indigo-500 rounded-3xl mb-4">
                                    <Coins className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-1">Withdraw Funds</h3>
                                <p className="text-xs text-slate-400 font-medium px-4">Withdraw your hard-earned balance directly.</p>

                                <div className="w-full mt-8 space-y-4">
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">₹</span>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={withdrawValue}
                                            onChange={(e) => setWithdrawValue(e.target.value)}
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-10 pr-6 text-lg font-black focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                                        />
                                    </div>

                                    <div className="flex justify-between items-center px-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Balance</p>
                                        <p className="text-xs font-black text-indigo-600">₹{user?.wallet || 0}</p>
                                    </div>

                                    <button
                                        onClick={handleWithdraw}
                                        disabled={withdrawLoading || !withdrawValue}
                                        className="w-full bg-indigo-600 text-white rounded-2xl py-4 font-bold text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        {withdrawLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : "Confirm Withdrawal"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Wallet;
