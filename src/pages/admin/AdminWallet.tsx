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
    TrendingUp,
    CreditCard
} from "lucide-react";
import { getProfile } from "../../services/user.service";
import { getAdminTransactions } from "../../services/admin.service";
import { getCompanies } from "../../services/company.service";
import { motion } from "framer-motion";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const AdminWallet = () => {
    const navigate = useNavigate();
    const [adminProfile, setAdminProfile] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [companyFilter, setCompanyFilter] = useState("");
    const [empSearchTerm, setEmpSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

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

    const totalPages = Math.ceil(filteredEarnings.length / itemsPerPage);
    const paginatedEarnings = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredEarnings.slice(start, start + itemsPerPage);
    }, [filteredEarnings, currentPage]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-gray-100 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <WalletIcon className="w-4 h-4" />
                        </div>
                        <h1 className="text-sm font-bold tracking-tight text-slate-800 uppercase">Admin Wallet</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Live System</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Balance Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-slate-200 bg-gradient-to-br from-white to-slate-100 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden text-white"
                        >
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] font-medium text-slate-700 uppercase tracking-[0.2em]">Total Balance</p>
                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-5xl font-black tracking-tighter text-black">
                                        ₹{parseFloat(adminProfile?.wallet || 0).toFixed(2)}
                                    </h2>
                                    <p className="text-xs text-indigo-300 font-medium opacity-80 uppercase tracking-widest pl-1">Available Funds</p>
                                </div>
                                <div className="mt-10 flex gap-3">
                                    <button className="flex-1 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-500 transition-all shadow-lg active:scale-95">
                                        Withdraw
                                    </button>
                                    <div className="p-3.5 bg-white/10 border border-white/10 rounded-2xl">
                                        <CreditCard className="w-5 h-5 text-black" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] translate-y-1/2 -translate-x-1/2" />
                        </motion.div>

                        {/* Recent Transactions */}
                        <div className="bg-white border border-slate-200 bg-gradient-to-br from-white to-slate-100 rounded-[2rem] p-6 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 mb-6 px-1">
                                <History className="w-4 h-4 text-slate-400" />
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">System Activity</h3>
                            </div>
                            <div className="space-y-4">
                                {transactions.length > 0 ? (
                                    transactions.slice(0, 5).map((t, idx) => (
                                        <div key={t._id || idx} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl ${t.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                    {t.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-medium text-slate-800 truncate max-w-[120px]">
                                                        {t.description || (t.type === 'credit' ? 'Credit' : 'Debit')}
                                                    </p>
                                                    <p className="text-[9px] font-normal text-slate-400 uppercase tracking-tighter mt-0.5">
                                                        {new Date(t.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-xs font-bold tracking-tight ${t.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {t.type === 'credit' ? '+' : '-'}₹{parseFloat(t.amount).toFixed(2)}
                                                </p>
                                                <p className="text-[8px] font-medium text-slate-400 uppercase tracking-widest">{t.status}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center opacity-30">
                                        <p className="text-[10px] font-bold uppercase tracking-widest">No Logs</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (8 cols) - Leaderboard Table */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white border border-slate-200 bg-gradient-to-br from-white to-slate-100 rounded-[2.5rem] p-6 lg:p-10 shadow-sm flex flex-col min-h-[720px] relative">
                            {/* Header Section */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Earning Leaderboard</h3>
                                        <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Employee Performance Index</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 flex-wrap">
                                    <div className="relative">
                                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                        <select
                                            value={companyFilter}
                                            onChange={(e) => { setCompanyFilter(e.target.value); setCurrentPage(1); }}
                                            className="pl-9 pr-6 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-200 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Companies</option>
                                            {companies.map(c => (
                                                <option key={c._id} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="SEARCH EMPLOYEES..."
                                            value={empSearchTerm}
                                            onChange={(e) => { setEmpSearchTerm(e.target.value); setCurrentPage(1); }}
                                            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-200 transition-all w-full md:w-48"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Table Structure */}
                            <div className="flex-1 overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 italic">
                                            <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-4">Rank</th>
                                            <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee</th>
                                            <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company</th>
                                            <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right pr-4">Earnings</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {paginatedEarnings.length > 0 ? (
                                            paginatedEarnings.map((emp: any, idx) => {
                                                const rank = (currentPage - 1) * itemsPerPage + idx + 1;
                                                return (
                                                    <motion.tr
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        key={emp._id || idx}
                                                        className="hover:bg-slate-50/50 transition-colors group cursor-default"
                                                    >
                                                        <td className="py-5 pl-4">
                                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px]  ${rank === 1 ? ' text-amber-700' :
                                                                rank === 2 ? ' text-slate-600' :
                                                                    rank === 3 ? ' text-orange-700' : 'bg-slate-50 text-slate-400'
                                                                }`}>
                                                                {rank}
                                                            </div>
                                                        </td>
                                                        <td className="py-5">
                                                            <div className="flex items-center gap-3">
                                                                {emp.profilePhoto ? (
                                                                    <img src={emp.profilePhoto} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-100 shadow-sm" />
                                                                ) : (
                                                                    <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                                        {emp.name.charAt(0)}
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <p className="text-[12px] font-semibold text-slate-800 leading-none">{emp.name}</p>
                                                                    <p className="text-[9px] text-slate-400 mt-1 lowercase">{emp.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-5">
                                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                                <Building2 className="w-3 h-3 opacity-50" />
                                                                <span className="text-[10px] font-medium uppercase tracking-tight">{emp.companyName || 'N/A'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-5 text-right pr-4">
                                                            <p className="text-sm font-medium">₹{parseFloat(emp.totalEarned).toFixed(2)}</p>
                                                            <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Total Payout</p>
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="py-20 text-center">
                                                    <div className="flex flex-col items-center opacity-20 grayscale">
                                                        <Users className="w-12 h-12 mb-4" />
                                                        <p className="text-[10px] font-bold uppercase tracking-widest">No records found</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Refined shadcn Pagination at very bottom */}
                            {totalPages > 1 && (
                                <div className="mt-auto pt-10 border-t border-slate-100">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (currentPage > 1) setCurrentPage(p => p - 1);
                                                    }}
                                                    className={currentPage === 1 ? "pointer-events-none opacity-30" : "cursor-pointer"}
                                                />
                                            </PaginationItem>

                                            {[...Array(totalPages)].map((_, i) => {
                                                const pageNum = i + 1;
                                                // Show first, last, and around current page
                                                if (
                                                    pageNum === 1 ||
                                                    pageNum === totalPages ||
                                                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                                ) {
                                                    return (
                                                        <PaginationItem key={i}>
                                                            <PaginationLink
                                                                href="#"
                                                                isActive={currentPage === pageNum}
                                                                onClick={(e) => { e.preventDefault(); setCurrentPage(pageNum); }}
                                                                className="cursor-pointer"
                                                            >
                                                                {pageNum}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    );
                                                } else if (
                                                    pageNum === currentPage - 2 ||
                                                    pageNum === currentPage + 2
                                                ) {
                                                    return (
                                                        <PaginationItem key={i}>
                                                            <PaginationEllipsis />
                                                        </PaginationItem>
                                                    );
                                                }
                                                return null;
                                            })}

                                            <PaginationItem>
                                                <PaginationNext
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (currentPage < totalPages) setCurrentPage(p => p + 1);
                                                    }}
                                                    className={currentPage === totalPages ? "pointer-events-none opacity-30" : "cursor-pointer"}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminWallet;
