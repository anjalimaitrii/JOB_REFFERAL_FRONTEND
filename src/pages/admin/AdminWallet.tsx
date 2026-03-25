import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Wallet as WalletIcon,
    ChevronLeft,
    History,
    Users,
    ArrowUpRight,
    ArrowDownLeft,
    Search,
    Filter,
    Building2,
    Award,
    X,
    Coins,
    Loader2
} from "lucide-react";
import { getProfile } from "../../services/user.service";
import { getAdminTransactions } from "../../services/admin.service";
import { getCompanies } from "../../services/company.service";
import { motion, AnimatePresence } from "framer-motion";

const AdminWallet = () => {
    const navigate = useNavigate();
    const [adminProfile, setAdminProfile] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Withdrawal Modal State (Static UI)
    const [withdrawOpen, setWithdrawOpen] = useState(false);
    const [withdrawValue, setWithdrawValue] = useState("");
    const [withdrawLoading, setWithdrawLoading] = useState(false);

    // Filters
    const [companyFilter, setCompanyFilter] = useState("");
    const [empSearchTerm, setEmpSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [profileRes, transRes, companiesRes] = await Promise.all([
                getProfile(),
                getAdminTransactions(),
                getCompanies()
            ]);

            setAdminProfile(profileRes);
            setTransactions(transRes.data || []);
            setCompanies(companiesRes.data || []);
        } catch (err) {
            console.error("Failed to fetch admin wallet data", err);
        } finally {
            setLoading(false);
        }
    };

    // Calculate Employee Earnings from Transactions
    const employeeEarnings = useMemo(() => {
        const earningsMap: Record<string, any> = {};

        transactions.forEach(t => {
            // Assume transactions that are 'debit' from admin are 'payouts' to employees
            // or transactions that have a 'user' field are related to employee earnings.
            // Based on user's feedback: "har kisi ka whaa s wallet amount aaayegaa... debit huaa credit huaa"
            if (t.type === 'credit' && t.user && t.user.role === 'employee') {
                const userId = t.user._id || t.user;
                if (!earningsMap[userId]) {
                    earningsMap[userId] = {
                        _id: userId,
                        name: t.user.name || 'Unknown',
                        email: t.user.email || '',
                        profilePhoto: t.user.profilePhoto || '',
                        companyName: t.user.company?.name || 'N/A',
                        totalEarned: 0
                    };
                }
                earningsMap[userId].totalEarned += t.amount;
            }
        });

        return Object.values(earningsMap);
    }, [transactions]);

    const filteredEarnings = useMemo(() => {
        return employeeEarnings
            .filter((emp: any) => {
                const matchesCompany = !companyFilter || emp.companyName === companyFilter;
                const matchesSearch = !empSearchTerm ||
                    emp.name.toLowerCase().includes(empSearchTerm.toLowerCase()) ||
                    emp.email.toLowerCase().includes(empSearchTerm.toLowerCase());
                return matchesCompany && matchesSearch;
            })
            .sort((a: any, b: any) => b.totalEarned - a.totalEarned);
    }, [employeeEarnings, companyFilter, empSearchTerm]);

    const paginatedEarnings = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredEarnings.slice(start, end);
    }, [filteredEarnings, currentPage]);
    const totalPages = Math.ceil(filteredEarnings.length / itemsPerPage);


    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-gray-200">
            {/* Navbar */}
            <nav className="bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 text-white">
                        <WalletIcon className="w-5 h-5" />
                        <h1 className="text-sm font-bold tracking-widest uppercase">Admin Wallet</h1>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                    <div className="space-y-0.5">
                        <h2 className="text-xl font-bold text-gray-900">Wallet Overview</h2>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-tight">System balance and transaction logs.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Admin Balance and Transactions */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Balance Card */}
                        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">My Balance</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black tabular-nums tracking-tighter text-black">
                                        ₹{adminProfile?.wallet || 0}
                                    </span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">INR</span>
                                </div>
                                <div className="mt-8">
                                    <button
                                        onClick={() => setWithdrawOpen(true)}
                                        className="w-full py-3 bg-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                                    >
                                        Withdraw Funds
                                    </button>
                                </div>
                            </div>
                            {/* Decoration */}
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gray-50 rounded-full blur-2xl group-hover:bg-gray-100 transition-colors duration-500" />
                        </div>

                        {/* Recent Transactions */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2 px-2">
                                <History className="w-4 h-4 text-gray-400" />
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">System Activity</h3>
                            </div>
                            <div className="space-y-3">
                                {transactions.length > 0 ? (
                                    transactions.slice(0, 5).map((t, idx) => (
                                        <div key={t._id || idx} className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between group hover:border-gray-200 transition-all shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl ${t.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                    {t.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-bold text-gray-900 truncate max-w-[120px]">
                                                        {t.description || (t.type === 'credit' ? 'Credit' : 'Debit')}
                                                    </p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">
                                                        {new Date(t.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-xs font-black tracking-tight ${t.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {t.type === 'credit' ? '+' : '-'}₹{t.amount}
                                                </p>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{t.status}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white border border-gray-50 border-dashed p-10 rounded-3xl text-center">
                                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No Recent Activity</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Employee Earnings Leaderboard */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 lg:p-8 shadow-sm min-h-[600px] flex flex-col">
                            {/* Leaderboard Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-black text-white rounded-2xl">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-widest">Employee Leaderboard</h3>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Derived from system payouts</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Company Filter */}
                                    <div className="relative">
                                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                        <select
                                            value={companyFilter}
                                            onChange={(e) => setCompanyFilter(e.target.value)}
                                            className="pl-9 pr-4 py-2 bg-[#fcfcfc] border border-gray-100 rounded-xl text-[10px] font-bold uppercase tracking-tight text-gray-600 focus:outline-none focus:border-black transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">All Companies</option>
                                            {companies.map(c => (
                                                <option key={c._id} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Search Input */}
                                    <div className="relative group">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-black transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="SEARCH EMPLOYEES..."
                                            value={empSearchTerm}
                                            onChange={(e) => setEmpSearchTerm(e.target.value)}
                                            className="pl-9 pr-4 py-2 bg-[#fcfcfc] border border-gray-100 rounded-xl text-[10px] font-bold uppercase tracking-widest placeholder:text-gray-300 focus:outline-none focus:border-black transition-all w-full md:w-48"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Ranking List */}
                            <div className="flex-1 space-y-3">
                                {filteredEarnings.length > 0 ? (
                                    paginatedEarnings.map((emp: any, idx) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={emp._id || idx}
                                            className="flex items-center justify-between p-4 bg-[#fcfcfc] border border-gray-50 rounded-2xl hover:border-gray-200 hover:shadow-sm transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black ${idx === 0 ? 'bg-black text-white' :
                                                    idx === 1 ? 'bg-gray-200 text-black' :
                                                        idx === 2 ? 'bg-gray-100 text-gray-600' : 'bg-gray-50 text-gray-400'
                                                    }`}>
                                                    #{idx + 1}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {emp.profilePhoto ? (
                                                        <img src={emp.profilePhoto} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                            <Users className="w-4 h-4 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h4 className="text-[11px] font-bold text-gray-900 uppercase truncate max-w-[150px]">{emp.name}</h4>
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            <Building2 className="w-2.5 h-2.5 text-gray-400" />
                                                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[100px]">{emp.companyName || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-sm font-black text-black">₹{emp.totalEarned}</p>
                                                <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Total Earned</p>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 grayscale opacity-20">
                                        <Users className="w-16 h-16 mb-4" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">No Payout Data Found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">

                            {/* Left info */}
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                Page {currentPage} of {totalPages}
                            </p>

                            {/* Controls */}
                            <div className="flex items-center gap-2">

                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="px-3 py-1 text-[10px] font-bold rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
                                >
                                    Prev
                                </button>

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="px-3 py-1 text-[10px] font-bold rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
                                >
                                    Next
                                </button>

                            </div>
                        </div>
                    </div>

                </div>

            </main>


        </div>
    );
};

export default AdminWallet;
