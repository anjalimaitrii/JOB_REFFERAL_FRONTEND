import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    ChevronLeft,
    CheckCircle2,
    Search,
    CreditCard,
    FileText,
} from "lucide-react";
import { getAdminRequests } from "../../services/admin.service";
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
import RequestDetailsModal from "./RequestDetailsModal";

const AdminReferrals = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filters
    const [activeTab, setActiveTab] = useState<"all" | "completed" | "pending">("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const requestsRes = await getAdminRequests();
            setRequests(requestsRes.data || []);
        } catch (err) {
            console.error("Failed to fetch admin requests", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredRequests = useMemo(() => {
        return requests
            .filter((req: any) => {
                const isCompleted = req.status === "completed" && req.paymentStatus === "paid";
                if (req.paymentStatus !== "paid") return false;
                if (activeTab === "completed" && !isCompleted) return false;
                if (activeTab === "pending" && isCompleted) return false;

                // Fallbacks if sender or user objects aren't directly nested
                const senderName = req.sender?.name || req.senderId?.name || "";
                const senderEmail = req.sender?.email || req.senderId?.email || "";
                const userName = req.user?.name || req.userId?.name || "";
                const userEmail = req.user?.email || req.userId?.email || "";

                const matchesSearch = !searchTerm ||
                    senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    senderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    userEmail.toLowerCase().includes(searchTerm.toLowerCase());

                return matchesSearch;
            })
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [requests, activeTab, searchTerm]);

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const paginatedRequests = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredRequests.slice(start, start + itemsPerPage);
    }, [filteredRequests, currentPage]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-gray-100 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 pb-20">
            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/admin/wallet")}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <h1 className="text-sm font-bold tracking-tight text-slate-800 uppercase">Referral Requests</h1>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full flex items-center gap-2">
                        <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Total: {filteredRequests.length}</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">

                {/* Top Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex bg-slate-100 p-1 rounded-2xl w-full md:w-auto">
                        <button
                            onClick={() => { setActiveTab("all"); setCurrentPage(1); }}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => { setActiveTab("completed"); setCurrentPage(1); }}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'completed' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Completed
                        </button>
                        <button
                            onClick={() => { setActiveTab("pending"); setCurrentPage(1); }}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'pending' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Pending
                        </button>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="SEARCH USERS..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest placeholder:text-slate-300 focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-200 transition-all"
                        />
                    </div>
                </div>

                {/* Cards Container */}
                <div className="space-y-4">
                    {paginatedRequests.length > 0 ? (
                        paginatedRequests.map((req, idx) => {
                            const isCompleted = req.status === "completed" && req.paymentStatus === "paid";
                            const amountStr = parseFloat(req.amount?.toString() || "0").toFixed(2);

                            // Safe entity resolution
                            const sender = req.sender || req.senderId || {};
                            const user = req.receiver || req.receiverId || {};
                            const company = req.company || req.companyId || {};

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={req._id || idx}
                                    className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                                >
                                    {/* Status Badge */}
                                    <div className="absolute top-6 right-6 flex items-center gap-2">
                                        <div className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${isCompleted
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {isCompleted ? 'Completed' : 'Pending'}
                                        </div>
                                    </div>

                                    <div className="bg-white border rounded-xl p-4 shadow-sm flex justify-between items-center">

                                        {/* Left Info */}
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                <span className="font-semibold">{sender.name}</span> sent a request to{" "}
                                                <span className="font-semibold">{user.name}</span>
                                            </p>

                                            <p className="text-xs text-gray-500 mt-1">
                                                Company: <span className="font-medium">{company.name}</span>
                                            </p>

                                            <p className="text-xs text-gray-400 mt-1">
                                                ₹{req.amount}
                                            </p>
                                        </div>

                                        {/* Right Actions */}
                                        <button
                                            onClick={() => {
                                                setSelectedRequest(req);
                                                setIsModalOpen(true);
                                            }}
                                            className="px-3 py-1 text-xs bg-indigo-500 text-white rounded-md"
                                        >
                                            View Details
                                        </button>


                                    </div>

                                    {/* Mobile Amounts & Metadata */}
                                    <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between lg:hidden relative z-10">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-slate-50 text-slate-600 rounded-lg">
                                                <CreditCard className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Amount</p>
                                                <p className="text-sm font-black text-slate-800">₹{amountStr}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Left subtle gradient */}
                                    <div className={`absolute -left-10 -bottom-10 w-40 h-40 rounded-full blur-3xl -z-0 opacity-20 transition-colors duration-500 ${isCompleted ? 'bg-emerald-300' : 'bg-indigo-300'}`} />
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-[2rem] opacity-50">
                            <FileText className="w-12 h-12 text-slate-300 mb-4" />
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">No Requests Found</p>
                            <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase">Adjust your filters</p>
                        </div>
                    )}
                </div>
                <RequestDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    request={selectedRequest}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pt-8">
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

            </main>
        </div>
    );
};

export default AdminReferrals;
