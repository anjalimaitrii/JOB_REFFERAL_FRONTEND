import { useEffect, useState, useMemo } from "react";
import { getUsersByRole } from "../../services/admin.service";
import { useNavigate } from "react-router-dom";
import { Users, ChevronLeft, Search, Mail, BookOpen, Calendar, Shield, CheckCircle2 } from "lucide-react";
import AdminProfileModal from "@/components/ui/AdminProfileModal";

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
                if (
                    (edu.level === "Graduation" || edu.level === "Post Graduation") &&
                    edu.institute
                ) {
                    colleges.add(edu.institute.trim());
                }
            });
        });

        return Array.from(colleges).sort();
    }, [students]);

    const filteredStudents = students.filter((s) => {
        const matchesSearch =
            !searchTerm.trim() ||
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCollege =
            !collegeFilter ||
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
                {/* Header & Search + College Filter */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                        <h2 className="text-2xl font-bold uppercase tracking-tight">Active Students</h2>
                        <p className="text-gray-500 font-bold uppercase text-[9px] tracking-widest mt-1">
                            Total Managed: {students.length}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* College Filter */}
                        <select
                            value={collegeFilter}
                            onChange={(e) => setCollegeFilter(e.target.value)}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:border-black transition outline-none cursor-pointer"
                        >
                            <option value="">All Colleges</option>
                            {uniqueColleges.map((college) => (
                                <option key={college} value={college}>
                                    {college}
                                </option>
                            ))}
                        </select>

                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:border-black transition outline-none text-sm font-medium"
                            />
                        </div>
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
                                        {student.profilePhoto ? (
                                            <img src={student.profilePhoto} alt={student.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm text-gray-500">
                                                {student.name?.charAt(0)}
                                            </div>
                                        )}
                                        <div className="max-w-[200px]">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-bold uppercase tracking-tight truncate">{student.name}</h3>
                                                {student.isEmailVerified && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-medium rounded-full">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Verified
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <Mail className="w-2.5 h-2.5" />
                                                <span className="text-[9px] font-bold uppercase tracking-wider truncate">{student.email}</span>
                                            </div>
                                        </div>
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
                                                    {student.education?.[0]?.degree || student.education?.[0]?.level || "N/A"}
                                                </span>
                                                {(student.education?.[0]?.school || student.education?.[0]?.college) && (
                                                    <span className="text-[9px] text-gray-400 truncate block">
                                                        {student.education[0].school || student.education[0].college}
                                                    </span>
                                                )}
                                                {(student.education?.[0]?.grade || student.education?.[0]?.percentage) && (
                                                    <span className="text-[9px] text-gray-400 truncate block">
                                                        Grade: {student.education[0].grade || student.education[0].percentage}
                                                    </span>
                                                )}
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
                                        onClick={() => handleViewProfile(student)}
                                        className="w-full py-2 bg-gray-50 hover:bg-black hover:text-white border border-gray-100 hover:border-black transition-all duration-300 text-[9px] font-bold uppercase tracking-widest rounded-lg"
                                    >
                                        View Profile
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
