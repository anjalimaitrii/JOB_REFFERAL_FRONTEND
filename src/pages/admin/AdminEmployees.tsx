import { useEffect, useState, useMemo } from "react";
import { getUsersByRole } from "../../services/admin.service";
import { useNavigate } from "react-router-dom";
import { Users, ChevronLeft, Search, Mail, Calendar, Shield, Building2, CheckCircle2, IdCard, ExternalLink } from "lucide-react";
import AdminProfileModal from "@/components/ui/AdminProfileModal";
import { getCompanies } from "@/services/company.service";
import { motion } from "framer-motion";

type Employee = {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    isEmailVerified?: boolean;

    company?: {
        _id: string;
        name: string;
        industry?: string;
        logo?: string;
        location?: string;
    };

    profilePhoto?: string;

    personalInfo?: {
        phone?: string;
    };

    experience?: {
        company?: string;
        role?: string;
        duration?: string;
        startDate?: string;
        endDate?: string;
        location?: string;
        description?: string;
    }[];

    skills?: string[];
    education?: any[];
    projects?: any[];
};

function AdminEmployees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [companyFilter, setCompanyFilter] = useState("");
    const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [companies, setCompanies] = useState<any[]>([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const res = await getUsersByRole("employee");
            setEmployees(res.data);
        } catch (error) {
            console.error("Failed to fetch employees:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchCompaniesData = async () => {
            try {
                const res = await getCompanies();
                setCompanies(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCompaniesData();
    }, []);

    const handleViewProfile = (employee: Employee) => {
        setSelectedUser(employee);
        setShowModal(true);
    };

    const filteredEmployees = useMemo(() => {
        return employees.filter((emp) => {
            const matchesCompany = !companyFilter || emp.company?.name === companyFilter;
            const matchesSearch = !searchTerm ||
                emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.email.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCompany && matchesSearch;
        });
    }, [employees, companyFilter, searchTerm]);

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
                            <IdCard className="w-4 h-4" />
                        </div>
                        <h1 className="text-sm font-bold tracking-tight text-slate-800 uppercase">Employee Directory</h1>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-slate-900">System Employees</h2>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-indigo-100">
                                Total Managed: {employees.length}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search employees..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-[1.2rem] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                            />
                        </div>

                        {/* Company Filter */}
                        <div className="relative">
                            <select
                                value={companyFilter}
                                onChange={(e) => setCompanyFilter(e.target.value)}
                                className="pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-[1.2rem] text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm appearance-none cursor-pointer"
                            >
                                <option value="">All Companies</option>
                                {companies.map((company) => (
                                    <option key={company._id} value={company.name}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                <Building2 className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Employees Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-2 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : filteredEmployees.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEmployees.map((employee, idx) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.03 }}
                                key={employee._id}
                                className="group relative bg-gradient-to-br from-white to-slate-100 rounded-[2rem] border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                            >
                                <div className="flex items-start justify-between  relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="relative group-hover:scale-105 transition-transform duration-500">
                                            {employee.profilePhoto ? (
                                                <img src={employee.profilePhoto} alt={employee.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm" />
                                            ) : (
                                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl border border-indigo-100">
                                                    {employee.name?.charAt(0)}
                                                </div>
                                            )}
                                            {employee.isEmailVerified && (
                                                <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-lg border-2 border-white shadow-sm">
                                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="max-w-[160px]">
                                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight truncate">{employee.name}</h3>
                                            <div className="flex items-center gap-1.5 text-slate-400 ">
                                                <Mail className="w-3 h-3" />
                                                <span className="text-[10px] font-medium lowercase truncate">{employee.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    {/* Quick Info Grid */}
                                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Company</p>
                                            <div className="flex items-center gap-1.5">
                                                <Building2 className="w-3.5 h-3.5 text-slate-300" />
                                                <span className="text-[11px] font-semibold text-slate-700 truncate">
                                                    {employee?.company?.name || "Independent"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Joined</p>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                                <span className="text-[11px] font-semibold text-slate-700">
                                                    {new Date(employee.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleViewProfile(employee)}
                                        className="w-full py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-sm hover:bg-slate-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        View Profile
                                        <ExternalLink className="w-3 h-3 opacity-50" />
                                    </button>
                                </div>

                                {/* Subtle background icon */}
                                <div className="absolute -right-2 -bottom-2 opacity-[0.02] text-black transition-transform duration-700 group-hover:scale-110">
                                    <Users size={120} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                        <Shield className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No records match your criteria</p>
                    </div>
                )}
            </main>

            {/* Profile Modal */}
            <AdminProfileModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                user={selectedUser}
            />
        </div>
    );
}

export default AdminEmployees;
