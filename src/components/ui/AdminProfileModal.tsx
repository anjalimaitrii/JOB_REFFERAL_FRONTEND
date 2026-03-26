import { X, Mail, Calendar, BookOpen, Briefcase, FolderGit2, CheckCircle2, Phone, ExternalLink, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

export default function AdminProfileModal({ isOpen, onClose, user }: AdminProfileModalProps) {
    if (!isOpen || !user) return null;

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 lg:p-8"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-[3rem] shadow-2xl border border-slate-200 flex flex-col relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* CLOSE */}
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all z-20 active:scale-95"
                    >
                        <X size={20} />
                    </button>

                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                        {/* HEADER SECTION */}
                        <div className="p-8 lg:p-10 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                <div className="relative shrink-0">
                                    {user.profilePhoto ? (
                                        <img
                                            src={user.profilePhoto}
                                            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl"
                                            alt={user.name}
                                        />
                                    ) : (
                                        <div className="w-28 h-28 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-3xl border-4 border-white shadow-xl uppercase">
                                            {user.name?.charAt(0)}
                                        </div>
                                    )}
                                    {user.isEmailVerified && (
                                        <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 text-white rounded-2xl border-4 border-white shadow-lg">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 text-center md:text-left pt-2">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{user.name}</h2>
                                        <span className="px-3 py-1 bg-white border border-slate-200 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                                            {user.role}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 mb-6">
                                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                                            <Mail className="w-4 h-4 text-slate-300" />
                                            <span className="text-sm">{user.email}</span>
                                        </div>
                                        {user.personalInfo?.phone && (
                                            <div className="flex items-center gap-2 text-slate-500 font-medium">
                                                <Phone className="w-4 h-4 text-slate-300" />
                                                <span className="text-sm">{user.personalInfo.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="px-4 py-2.5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Registered On</p>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                                                <span className="text-xs font-bold text-slate-700">{new Date(user.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="px-4 py-2.5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">System ID</p>
                                            <div className="flex items-center gap-2">
                                                <Hash className="w-3.5 h-3.5 text-indigo-500" />
                                                <span className="text-xs font-bold text-slate-700 uppercase">#{user._id.slice(-6)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CONTENT SECTION */}
                        <div className="p-8 lg:p-10 space-y-10">
                            {/* EDUCATION */}
                            {user.education?.length > 0 && (
                                <section>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                        <BookOpen className="w-4 h-4 text-indigo-600" />
                                        Academic Foundation
                                        <div className="h-px flex-1 bg-slate-100" />
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {user.education.map((edu: any, i: number) => (
                                            <div key={i} className="bg-slate-50 border border-slate-100 rounded-3xl p-5 group hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
                                                <p className="text-sm font-black text-slate-800 uppercase leading-snug mb-1">{edu.level || edu.degree}</p>
                                                <p className="text-xs font-semibold text-slate-500 mb-3">{edu.school || edu.institute}</p>
                                                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-200/50">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Class of {edu.year || "N/A"}</span>
                                                    {(edu.grade || edu.percentage) && (
                                                        <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-900 text-[10px] font-black rounded-lg">
                                                            {edu.grade || edu.percentage}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* EXPERIENCE */}
                            {user.experience?.length > 0 && (
                                <section>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                        <Briefcase className="w-4 h-4 text-indigo-600" />
                                        Professional History
                                        <div className="h-px flex-1 bg-slate-100" />
                                    </h3>
                                    <div className="space-y-4">
                                        {user.experience.map((exp: any, i: number) => (
                                            <div key={i} className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-slate-100 before:rounded-full">
                                                <div className="bg-white border border-slate-200 rounded-3xl p-6 group hover:shadow-xl hover:border-indigo-100 transition-all duration-500">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{exp.role || "Professional Role"}</p>
                                                            <p className="text-xs font-bold text-indigo-600 mt-1">{exp.company}</p>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                                                            {exp.startDate} - {exp.endDate || "Present"}
                                                        </span>
                                                    </div>
                                                    {exp.description && (
                                                        <p className="text-xs text-slate-500 leading-relaxed italic border-l-2 border-slate-50 pl-4 py-1">
                                                            "{exp.description}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* SKILLS */}
                            {user.skills?.length > 0 && (
                                <section>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Core Competencies</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {user.skills.map((skill: string, i: number) => (
                                            <span key={i} className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-sm hover:scale-110 transition-transform">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* PROJECTS */}
                            {user.projects?.length > 0 && (
                                <section>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                        <FolderGit2 className="w-4 h-4 text-indigo-600" />
                                        Notable Projects
                                        <div className="h-px flex-1 bg-slate-100" />
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {user.projects.map((project: any, i: number) => (
                                            <div key={i} className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 group">
                                                <p className="text-sm font-black text-slate-900 uppercase tracking-tighter mb-2 truncate">{project.title || project.name}</p>
                                                {project.description && (
                                                    <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                                                        {project.description}
                                                    </p>
                                                )}
                                                {project.link && (
                                                    <a
                                                        href={project.link}
                                                        target="_blank"
                                                        className="inline-flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform"
                                                    >
                                                        Access Repository <ExternalLink size={12} />
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
