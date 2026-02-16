import { useEffect, useState } from "react";
import { getUsersByRole } from "../../services/admin.service";
import { useNavigate } from "react-router-dom";
import { Users, ChevronLeft, Search, Mail, Briefcase, Calendar, Shield, Building2 } from "lucide-react";

type Employee = {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    personalInfo?: {
        phone?: string;
    };
    experience?: {
        company?: string;
        role?: string;
        duration?: string;
    }[];
    companyDetails?: {
        name: string;
        industry: string;
    };
};

function AdminEmployees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

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

    const filteredEmployees = employees.filter(
        (e) =>
            e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.experience?.[0]?.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Navbar */}
            <nav className="bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-white" />
                        <h1 className="text-lg font-bold tracking-tight text-white uppercase">Employee Directory</h1>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-black uppercase tracking-tight">System Employees</h2>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">
                            Total Managed: {employees.length}
                        </p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-black transition outline-none font-medium"
                        />
                    </div>
                </div>

                {/* Employees List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Syncing Records...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredEmployees.map((employee) => (
                            <div
                                key={employee._id}
                                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-black text-white rounded-xl flex items-center justify-center border border-black group-hover:bg-gray-800 transition-colors duration-300">
                                            <Briefcase className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tight">{employee.name}</h3>
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Mail className="w-3 h-3" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">{employee.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-black text-white rounded text-[9px] font-black uppercase tracking-widest">
                                        STAFF
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Info Cards */}
                                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Current Role</p>
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-3 h-3 text-gray-600" />
                                                <span className="text-xs font-bold truncate">
                                                    {employee.experience?.[0]?.company || "Freelance"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Registry Date</p>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3 text-gray-600" />
                                                <span className="text-xs font-bold">
                                                    {new Date(employee.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-400 mb-4">
                                        <Shield className="w-3 h-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Verified Work History Available</span>
                                    </div>

                                    <button
                                        className="w-full py-3 bg-black text-white hover:bg-gray-800 border border-black transition-all duration-300 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg"
                                    >
                                        Manage Employee Data
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredEmployees.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
                        <Shield className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No employees found matching criteria.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminEmployees;
