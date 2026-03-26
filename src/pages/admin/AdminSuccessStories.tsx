import { useEffect, useState } from "react";
import { getAllSuccessStoriesForAdmin, verifySuccessStory, type SuccessStory } from "../../services/successStory.service";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CheckCircle, XCircle, Clock, MessageSquare, Star, Quote, Award, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

export default function AdminSuccessStories() {
    const navigate = useNavigate();
    const [stories, setStories] = useState<SuccessStory[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            setLoading(true);
            const res = await getAllSuccessStoriesForAdmin();
            setStories(res.data || []);
        } catch (error) {
            console.error("Failed to fetch stories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id: string, status: "approved" | "rejected" | "pending") => {
        try {
            await verifySuccessStory(id, status);
            setStories((prev) =>
                prev.map((s) => (s._id === id ? { ...s, status } : s))
            );
        } catch (error) {
            console.error("Verification failed", error);
        }
    };

    const filteredStories = stories.filter((s) =>
        filter === "all" ? true : s.status === filter
    );

    const stats = {
        total: stories.length,
        pending: stories.filter((s) => s.status === "pending").length,
        approved: stories.filter((s) => s.status === "approved").length,
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
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
                            <Award className="w-4 h-4" />
                        </div>
                        <h1 className="text-sm font-bold tracking-tight text-slate-800 uppercase">Moderation / Success Stories</h1>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Submissions" value={stats.total} icon={<MessageSquare className="w-4 h-4" />} />
                    <StatCard title="Pending Review" value={stats.pending} icon={<Clock className="w-4 h-4" />} accent="amber" />
                    <StatCard title="Approved Stories" value={stats.approved} icon={<CheckCircle className="w-4 h-4" />} accent="emerald" />
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
                    <div className="flex items-center gap-3 bg-white p-1.5 rounded-[1.2rem] border border-slate-200 shadow-sm overflow-hidden">
                        {["all", "pending", "approved", "rejected"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f
                                    ? "bg-slate-900 text-white shadow-lg scale-[1.05]"
                                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {filteredStories.map((story, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={story._id}
                            className="group bg-gradient-to-br from-white to-slate-100 border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-lg border border-slate-800 shadow-md">
                                        {story.name.charAt(0)}
                                    </div>
                                    <div className="max-w-[120px]">
                                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight truncate">{story.name}</h4>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 truncate">{story.role}</p>
                                    </div>
                                </div>
                                <StatusBadge status={story.status} />
                            </div>

                            <div className="relative mb-8 flex-1">
                                <Quote className="absolute -top-4 -left-4 w-12 h-12 text-slate-100 -z-0 opacity-50" />
                                <p className="text-sm text-slate-600 leading-relaxed italic relative z-10 font-medium">
                                    "{story.comment}"
                                </p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-slate-50 space-y-6 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 group-hover:scale-105 transition-transform">
                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        <span className="text-sm font-black text-slate-900 leading-none">{story.rating}<span className="text-[10px] text-slate-300 font-bold ml-0.5">/ 5</span></span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm">
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">@{story.company}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {story.status === "pending" && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleVerify(story._id, "approved")}
                                                className="flex-1 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                                            >
                                                <CheckCircle className="w-3.5 h-3.5" /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleVerify(story._id, "rejected")}
                                                className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                                            >
                                                <XCircle className="w-3.5 h-3.5" /> Reject
                                            </button>
                                        </div>
                                    )}
                                    {story.status !== "pending" && (
                                        <button
                                            onClick={() => handleVerify(story._id, "pending")}
                                            className="w-full py-3 bg-white border border-slate-200 text-slate-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center justify-center gap-2"
                                        >
                                            <RefreshCcw className="w-3 h-3" /> Reset Status
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {filteredStories.length === 0 && (
                        <div className="col-span-full py-24 text-center space-y-4 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                            <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <MessageSquare className="w-6 h-6 text-slate-200" />
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registry category is empty</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon, accent = "slate" }: { title: string; value: number; icon: React.ReactNode; accent?: "slate" | "amber" | "emerald" }) {
    const accents: any = {
        slate: "bg-indigo-50 text-indigo-600 border-indigo-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100"
    };

    return (
        <div className="p-8 pb-10 rounded-[3rem] bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative group">
            <div className={`p-3 rounded-2xl w-fit mb-6 relative z-10 transition-colors ${accents[accent]}`}>{icon}</div>
            <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">{title}</p>
                <span className="text-4xl font-black tracking-tighter text-slate-900">{value}</span>
            </div>
            {/* Subtle overlay */}
            <div className="absolute -right-6 -bottom-6 opacity-[0.03] text-black group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                {icon && React.cloneElement(icon as React.ReactElement)}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        pending: "bg-amber-50 text-amber-600 border-amber-100",
        approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
        rejected: "bg-rose-50 text-rose-600 border-rose-100",
    }[status] || "bg-slate-50 text-slate-600 border-slate-100";

    return (
        <span className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${styles}`}>
            {status}
        </span>
    );
}
