import { X, Mail, Calendar, BookOpen, Briefcase, Code, FolderGit2, CheckCircle2 } from "lucide-react";

interface AdminProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

export default function AdminProfileModal({ isOpen, onClose, user }: AdminProfileModalProps) {
    if (!isOpen || !user) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-xl border border-gray-200 p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100 transition"
                >
                    <X size={18} />
                </button>

                <h2 className="text-xl font-bold mb-6">Profile Details</h2>

                {/* PROFILE HEADER */}
                <div className="flex items-center gap-4 mb-6">
                    {user.profilePhoto ? (
                        <img
                            src={user.profilePhoto}
                            className="w-16 h-16 rounded-full object-cover border"
                            alt={user.name}
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center font-bold text-lg">
                            {user.name?.charAt(0)}
                        </div>
                    )}

                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold">{user.name}</p>
                            {user.isVerified && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Verified
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-0.5">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{user.email}</span>
                        </div>
                        {(user.companyName || user.jobTitle || user.designation) && (
                            <p className="text-xs text-gray-500 mt-0.5">
                                {user.jobTitle || user.designation}
                                {user.companyName && <span className="text-gray-400"> · {user.companyName}</span>}
                            </p>
                        )}
                        {user.personalInfo?.phone && (
                            <p className="text-xs text-gray-400 mt-0.5">📞 {user.personalInfo.phone}</p>
                        )}
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* EDUCATION */}
                {user.education?.length > 0 && (
                    <section className="mb-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> Education
                        </h3>
                        <div className="space-y-2">
                            {user.education.map((edu: any, i: number) => (
                                <div key={i} className="border rounded-lg p-3 text-sm bg-gray-50">
                                    <p className="font-semibold">{edu.level || edu.degree}</p>
                                    <p className="text-gray-500">{edu.school || edu.institute}</p>
                                    {edu.year && <p className="text-xs text-gray-400">Year: {edu.year}</p>}
                                    {(edu.grade || edu.percentage) && (
                                        <p className="text-xs text-gray-400">Grade: {edu.grade || edu.percentage}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* EXPERIENCE */}
                {user.experience?.length > 0 && (
                    <section className="mb-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> Experience
                        </h3>
                        <div className="space-y-2">
                            {user.experience.map((exp: any, i: number) => (
                                <div key={i} className="border rounded-lg p-3 text-sm space-y-1">
                                    <p className="font-semibold text-gray-900">{exp.company}</p>
                                    {exp.role && <p className="text-gray-700"><span className="font-semibold">Role:</span> {exp.role}</p>}
                                    {(exp.startDate || exp.endDate) && (
                                        <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate || "Present"}</p>
                                    )}
                                    {exp.location && <p className="text-xs text-gray-500">{exp.location}</p>}
                                    {exp.description && <p className="text-xs text-gray-500">{exp.description}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* SKILLS */}
                {user.skills?.length > 0 && (
                    <section className="mb-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                            <Code className="w-4 h-4" /> Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-gray-100 text-xs rounded-full font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* PROJECTS */}
                {user.projects?.length > 0 && (
                    <section className="mb-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                            <FolderGit2 className="w-4 h-4" /> Projects
                        </h3>
                        <div className="space-y-3">
                            {user.projects.map((project: any, i: number) => (
                                <div key={i} className="border rounded-lg p-3 text-sm space-y-1">
                                    <p className="font-semibold text-gray-900">{project.title || project.name}</p>
                                    {project.description && <p className="text-xs text-gray-500">{project.description}</p>}
                                    {project.link && (
                                        <a href={project.link} target="_blank" className="text-blue-500 text-xs hover:underline">
                                            View Project →
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
