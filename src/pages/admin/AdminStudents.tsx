import { useEffect, useState } from "react";
import { getUsersByRole } from "../../services/admin.service";
import { useNavigate } from "react-router-dom";
import { Users, ChevronLeft, Search, Mail, BookOpen, Calendar, Shield } from "lucide-react";

type Student = {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    personalInfo?: {
        phone?: string;
        address?: string;
    };
    education?: {
        degree?: string;
        school?: string;
        year?: string;
    }[];
    skills?: string[];
};

function AdminStudents() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
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

    const filteredStudents = students.filter(
        (s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <h1 className="text-lg font-bold tracking-tight text-white uppercase">Student Directory</h1>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-0.5">
                        <h2 className="text-2xl font-bold uppercase tracking-tight">Active Students</h2>
                        <p className="text-gray-500 font-bold uppercase text-[9px] tracking-widest mt-1">
                            Total Managed: {students.length}
                        </p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search directory..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:border-black transition outline-none text-sm font-medium"
                        />
                    </div>
                </div>

                {/* Students List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading Database...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredStudents.map((student) => (
                            <div
                                key={student._id}
                                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        <div className="max-w-[150px]">
                                            <h3 className="text-sm font-bold uppercase tracking-tight truncate">{student.name}</h3>
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <Mail className="w-2.5 h-2.5" />
                                                <span className="text-[9px] font-bold uppercase tracking-wider truncate">{student.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-gray-50 rounded text-[9px] font-black uppercase tracking-widest border border-gray-100">
                                        ID: {student._id.slice(-6).toUpperCase()}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3 py-2 border-y border-gray-50 mt-1">
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Education</p>
                                            <div className="flex items-center gap-1.5">
                                                <BookOpen className="w-2.5 h-2.5 text-gray-600" />
                                                <span className="text-[10px] font-bold truncate">
                                                    {student.education?.[0]?.degree || "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Joined</p>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-2.5 h-2.5 text-gray-600" />
                                                <span className="text-[10px] font-bold">
                                                    {new Date(student.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    {student.skills && student.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {student.skills.slice(0, 3).map((skill, i) => (
                                                <span key={i} className="px-1.5 py-0.5 bg-gray-50 border border-gray-100 text-[9px] font-bold uppercase tracking-tighter rounded">
                                                    {skill}
                                                </span>
                                            ))}
                                            {student.skills.length > 3 && (
                                                <span className="text-[9px] font-bold text-gray-400">+{student.skills.length - 3}</span>
                                            )}
                                        </div>
                                    )}

                                    <button
                                        className="w-full py-2 bg-gray-50 hover:bg-black hover:text-white border border-gray-100 hover:border-black transition-all duration-300 text-[9px] font-bold uppercase tracking-widest rounded-lg"
                                    >
                                        Inspect Profile
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredStudents.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
                        <Shield className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No records found matching your search.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminStudents;
