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

            <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-black uppercase tracking-tight">Active Students</h2>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">
                            Total Managed: {students.length}
                        </p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-black transition outline-none font-medium"
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
                                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tight">{student.name}</h3>
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Mail className="w-3 h-3" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">{student.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-gray-50 rounded text-[9px] font-black uppercase tracking-widest border border-gray-100">
                                        ID: {student._id.slice(-6).toUpperCase()}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Education</p>
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-3 h-3 text-gray-600" />
                                                <span className="text-xs font-bold truncate">
                                                    {student.education?.[0]?.degree || "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Joined</p>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3 text-gray-600" />
                                                <span className="text-xs font-bold">
                                                    {new Date(student.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    {student.skills && student.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {student.skills.slice(0, 4).map((skill, i) => (
                                                <span key={i} className="px-2 py-1 bg-gray-50 border border-gray-100 text-[10px] font-bold uppercase tracking-tighter rounded">
                                                    {skill}
                                                </span>
                                            ))}
                                            {student.skills.length > 4 && (
                                                <span className="text-[10px] font-bold text-gray-400">+{student.skills.length - 4} more</span>
                                            )}
                                        </div>
                                    )}

                                    <button
                                        className="w-full py-3 bg-gray-50 hover:bg-black hover:text-white border border-gray-100 hover:border-black transition-all duration-300 text-[10px] font-black uppercase tracking-widest rounded-xl"
                                    >
                                        View Secure Profile
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
