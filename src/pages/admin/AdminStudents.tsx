import { useEffect, useState, useMemo } from "react";
import { getUsersByRole } from "../../services/admin.service";
import { useNavigate } from "react-router-dom";
import { Users, ChevronLeft, Search, Mail, BookOpen, Calendar, Shield, CheckCircle2, GraduationCap, ExternalLink, GraduationCap as StudentIcon } from "lucide-react";
import AdminProfileModal from "@/components/ui/AdminProfileModal";
import { motion } from "framer-motion";

type Student = {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    isEmailVerified?: boolean;
    companyName?: string;
    profilePhoto?: string;
    personalInfo?: {
        phone?: string;
        address?: string;
    };
    education?: {
        degree?: string;
        level?: string;
        grade?: string;
        percentage?: string;
        school?: string;
        college?: string;
        year?: string;
        institute?: string;
    }[];
    skills?: string[];
    projects?: any[];
    experience?: any[];
};

function AdminStudents() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [collegeFilter, setCollegeFilter] = useState("");
    const [selectedUser, setSelectedUser] = useState<Student | null>(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await getUsersByRole("student");
            setStudents(res.data);
        } catch (error) {
            console.error("Failed to fetch students:", error);
        } finally {
            setLoading(false);
        }
    };

    const uniqueColleges = useMemo(() => {
        const colleges = new Set<string>();
        students.forEach((s) => {
            s.education?.forEach((edu) => {
                if ((edu.level === "Graduation" || edu.level === "Post Graduation") && edu.institute) {
                    colleges.add(edu.institute.trim());
                }
            });
        });
        return Array.from(colleges).sort();
    }, [students]);

    const filteredStudents = students.filter((s) => {
        const matchesSearch = !searchTerm.trim() ||
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCollege = !collegeFilter ||
            s.education?.some((edu) =>
                (edu.level === "Graduation" || edu.level === "Post Graduation") &&
                edu.institute?.trim() === collegeFilter
            );
        return matchesSearch && matchesCollege;
    });

    const handleViewProfile = (student: Student) => {
        setSelectedUser(student);
        setShowModal(true);
    };

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
                            <StudentIcon className="w-4 h-4" />
                        </div>
                        <h1 className="text-sm font-bold tracking-tight text-slate-800 uppercase">Student Directory</h1>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
                {/* Header & Filter Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-slate-900">Active Students</h2>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-indigo-100">
                                Total Registered: {students.length}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-[1.2rem] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                            />
                        </div>

                        {/* College Filter */}
                        <div className="relative">
                            <select
                                value={collegeFilter}
                                onChange={(e) => setCollegeFilter(e.target.value)}
                                className="pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-[1.2rem] text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm appearance-none cursor-pointer min-w-[160px]"
                            >
                                <option value="">All Colleges</option>
                                {uniqueColleges.map((college) => (
                                    <option key={college} value={college}>
                                        {college}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                <GraduationCap className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Students List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-2 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : filteredStudents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStudents.map((student, idx) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.03 }}
                                key={student._id}
                                className="group relative bg-gradient-to-br from-white to-slate-100 rounded-[2.5rem] border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                            >
                                <div className="flex items-start justify-between  relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="relative group-hover:scale-105 transition-transform duration-500">
                                            {student.profilePhoto ? (
                                                <img src={student.profilePhoto} alt={student.name} className="w-16 h-16 rounded-3xl object-cover border border-slate-100 shadow-sm" />
                                            ) : (
                                                <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-2xl border border-indigo-100">
                                                    {student.name?.charAt(0)}
                                                </div>
                                            )}
                                            {student.isEmailVerified && (
                                                <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-lg border-2 border-white shadow-sm">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="max-w-[200px]">
                                            <h3 className="text-base font-bold text-slate-800 uppercase tracking-tight truncate">{student.name}</h3>
                                            <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                                                <Mail className="w-3.5 h-3.5" />
                                                <span className="text-[11px] font-medium lowercase truncate">{student.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    {/* Education & Info Grid */}
                                    <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-50">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Education</p>
                                            <div className="flex items-center gap-1.5">
                                                <BookOpen className="w-3.5 h-3.5 text-slate-300" />
                                                <span className="text-[11px] font-semibold text-slate-700 truncate">
                                                    {student.education?.[0]?.degree || student.education?.[0]?.level || "N/A"}
                                                </span>
                                            </div>
                                            {(student.education?.[0]?.institute) && (
                                                <span className="text-[9px] text-slate-400 truncate block pl-5">
                                                    {student.education[0].institute}
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Joined</p>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                                <span className="text-[11px] font-semibold text-slate-700">
                                                    {new Date(student.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skills Tags */}
                                    {student.skills && student.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {student.skills.slice(0, 3).map((skill, i) => (
                                                <span key={i} className="px-2 py-1 bg-white border border-slate-100 text-[9px] font-bold uppercase tracking-widest text-slate-500 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                    {skill}
                                                </span>
                                            ))}
                                            {student.skills.length > 3 && (
                                                <span className="text-[9px] font-bold text-slate-300 flex items-center">+{student.skills.length - 3}</span>
                                            )}
                                        </div>
                                    )}

                                    <button
                                        onClick={() => handleViewProfile(student)}
                                        className="w-full py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-sm hover:bg-slate-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        View Profile
                                        <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                                    </button>
                                </div>

                                {/* Subtle background icon */}
                                <div className="absolute -right-4 -bottom-4 opacity-[0.02] text-black transition-transform duration-700 group-hover:scale-110">
                                    <Users size={140} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                        <Shield className="w-12 h-12 text-slate-50 mx-auto mb-4 opacity-10" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No records match your search criteria</p>
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

export default AdminStudents;
