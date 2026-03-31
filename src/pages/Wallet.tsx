import { useEffect, useState } from "react";
import { getProfile } from "../services/user.service";
import { getTransactions, withdrawAmount } from "../services/payment.service";
import type { Transaction } from "../services/payment.service";
import { Wallet as WalletIcon, ChevronsLeft, TrendingUp, History, User, Coins, ArrowUpRight, ArrowDownLeft, X, Loader2, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PaymentModal from "@/components/ui/Paymentmodal";

const Wallet = () => {
    const [user, setUser] = useState<any>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [withdrawOpen, setWithdrawOpen] = useState(false);
    const [withdrawValue, setWithdrawValue] = useState("");
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [modalMode, setModalMode] = useState<"withdraw" | "donate">("withdraw");
    const navigate = useNavigate();
    const role = localStorage.getItem("role") || "student";
    const isStudentMode = role === "employee" && location.pathname.includes("/student");
    const isEmployee = role === "employee" && !isStudentMode;
    const [activePayment, setActivePayment] = useState<null | {
        amount: string;
        merchantName: string;
        merchantInitial: string;
        description: string;
        orderId: string;
    }>(null);

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
                fetchData();
            }
        } catch (err: any) {
            alert(err.message || "Withdrawal failed");
        } finally {
            setWithdrawLoading(false);
        }
    };

    const handleDonate = async () => {
        alert("Successfull Donated");
        setWithdrawOpen(false);

    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-amber-100 pb-24">
            {/* Header / Navbar */}
            <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                    >
                        <ChevronsLeft className="w-5 h-5" />
                    </button>
                    <div className="p-1.5 bg-gray-100 rounded-lg">
                        <WalletIcon className="w-5 h-5 text-black" />
                    </div>
                    <h1 className="text-sm font-bold tracking-widest text-black uppercase sm:block hidden">
                        My Wallet
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    {isEmployee && (
                        <>
                            <button
                                onClick={() => { setModalMode("withdraw"); setWithdrawOpen(true); }}
                                className="px-4 py-2 bg-black text-white rounded-full text-[11px] font-bold uppercase tracking-widest shadow-sm hover:bg-gray-800 transition-all active:scale-95"
                            >
                                Withdraw
                            </button>
                            <button
                                onClick={() => { setModalMode("donate"); setWithdrawOpen(true); }}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-black rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95"
                            >
                                <Heart className="w-4 h-4 text-rose-500" />
                                <span className="hidden sm:inline">Donate to NGO</span>
                                <span className="sm:hidden">Donate</span>
                            </button>
                        </>
                    )}
                </div>
            </nav>

            <div className="max-w-4xl mx-auto p-4 sm:p-8 mt-4">
                {/* Main Card */}


                {/* Stats/Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="p-6 rounded-[2rem] border bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-amber-50 text-amber-500">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <p className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">Total Balance</p>
                        </div>
                        <p className="text-2xl font-black text-slate-800 tracking-tight">
                            ₹{parseFloat(user?.wallet || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 font-medium">Total accumulated since registration</p>
                    </div>

                    <div className="bg-gradient-to-br from-[#1a1a1a] via-[#333] to-[#444] text-white border-gray-800 shadow-xl p-6 rounded-[2rem] border ">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-500">
                                <User className="w-5 h-5" />
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Account Status</p>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-50 text-emerald-600 border border-emerald-100 mt-1">
                            Verified
                        </span>
                    </div>
                </div>

                {/* History Section */}
                <div className="mb-20">
                    <div className="flex items-center gap-2 mb-6 ml-2">
                        <div className="w-1 h-1 bg-black rounded-full"></div>
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                            Recent Activity
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {transactions.length > 0 ? (
                            transactions.map((t, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={t._id}
                                    className="flex items-center justify-between p-5 rounded-[2rem] border transition-all hover:bg-slate-50 hover:shadow-md bg-white border-slate-100 shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl border ${t.type === 'credit'
                                            ? 'bg-emerald-50 text-emerald-500 border-emerald-100'
                                            : 'bg-rose-50 text-rose-500 border-rose-100'
                                            }`}>
                                            {t.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-900 tracking-wide mb-0.5">
                                                {t.type === "credit" ? "Credited" : "Debited"}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                {t.status} • {new Date(t.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-black text-lg tracking-tight ${t.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {t.type === 'credit' ? '+' : '-'}₹{parseFloat(t.amount).toFixed(2)}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-16 rounded-[2rem] border border-dashed border-slate-200 text-slate-400 bg-white shadow-sm">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <History className="w-6 h-6 text-slate-300" />
                                </div>
                                <p className="text-xs font-bold uppercase tracking-widest mb-1">No transactions</p>
                                <p className="text-sm text-slate-400 font-medium">Your activity will appear here</p>
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
                                <div className={`p-4 ${modalMode === "donate" ? "bg-rose-50 text-rose-500" : "bg-gray-100 text-gray-800"} rounded-3xl mb-4`}>
                                    {modalMode === "donate" ? <Heart className="w-8 h-8" /> : <Coins className="w-8 h-8" />}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">
                                    {modalMode === "donate" ? "Donate to NGO" : "Withdraw Funds"}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium px-4 leading-relaxed">
                                    {modalMode === "donate" ? "Support social causes with a direct donation from your balance." : "Withdraw your available balance directly to your account."}
                                </p>

                                <div className="w-full mt-8 space-y-5">
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">₹</span>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={withdrawValue}
                                            onChange={(e) => setWithdrawValue(e.target.value)}
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-10 pr-6 text-xl font-black focus:border-black outline-none transition-all placeholder:text-slate-300"
                                        />
                                    </div>

                                    <div className="flex justify-between items-center px-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Balance</p>
                                        <p className="text-sm font-black text-gray-900">₹{parseFloat(user?.wallet || 0).toFixed(2)}</p>
                                    </div>

                                    <button
                                        onClick={modalMode === "donate" ? handleDonate : handleWithdraw}
                                        disabled={withdrawLoading || !withdrawValue}
                                        className={`w-full ${modalMode === "donate" ? "bg-rose-500 shadow-rose-200 hover:bg-rose-600" : "bg-black shadow-gray-200 hover:bg-gray-800"} text-white rounded-2xl py-4 font-bold text-sm shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2`}
                                    >
                                        {withdrawLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : modalMode === "donate" ? "Confirm Donation" : "Confirm Withdrawal"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {activePayment && (
                <PaymentModal
                    amount={activePayment.amount}
                    merchantName={activePayment.merchantName}
                    merchantInitial={activePayment.merchantInitial}
                    description={activePayment.description}
                    orderId={activePayment.orderId}
                    customerName={user?.name || "User"}
                    customerEmail={user?.email || ""}
                    onClose={() => setActivePayment(null)}
                    onSuccess={async (txnId) => {
                        console.log("Donation successful:", txnId);
                        alert("Thank you for your generous donation!");
                        setActivePayment(null);
                        setWithdrawValue("");
                        setWithdrawOpen(false);
                        fetchData();
                    }}
                />
            )}
        </div>
    );
};

export default Wallet;
