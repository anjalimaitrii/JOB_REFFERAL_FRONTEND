import { useEffect, useState } from "react";
import { getAllSuccessStoriesForAdmin, verifySuccessStory, type SuccessStory } from "../../services/successStory.service";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CheckCircle, XCircle, Clock, Filter, MessageSquare, Star, Quote } from "lucide-react";

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
            alert("Verification failed");
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
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans">
            {/* Navbar */}
            <nav className="bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="h-6 w-px bg-gray-800 mx-2" />
                    <h1 className="text-sm font-bold tracking-widest text-white uppercase">Moderation / Success Stories</h1>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-8 space-y-8">
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Submissions" value={stats.total} icon={<MessageSquare className="w-5 h-5" />} />
                    <StatCard title="Pending Review" value={stats.pending} icon={<Clock className="w-5 h-5 text-orange-500" />} highlight />
                    <StatCard title="Approved Stories" value={stats.approved} icon={<CheckCircle className="w-5 h-5 text-green-500" />} />
                </div>

                {/* Filter Bar */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            {["all", "pending", "approved", "rejected"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f as any)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filter === f ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredStories.map((story) => (
                        <div key={story._id} className="group bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-sm">
                                        {story.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">{story.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{story.role}</p>
                                    </div>
                                </div>
                                <StatusBadge status={story.status} />
                            </div>

                            <div className="relative mb-6">
                                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-gray-50 -z-0" />
                                <p className="text-sm text-gray-600 leading-relaxed italic relative z-10">"{story.comment}"</p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-gray-50 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-bold">{story.rating}/5</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-medium">@{story.company}</span>
                                </div>

                                {story.status === "pending" && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleVerify(story._id, "approved")}
                                            className="flex-1 py-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-3 h-3" /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleVerify(story._id, "rejected")}
                                            className="flex-1 py-3 bg-white border border-gray-200 text-gray-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:text-red-600 hover:border-red-100 transition-all flex items-center justify-center gap-2"
                                        >
                                            <XCircle className="w-3 h-3" /> Reject
                                        </button>
                                    </div>
                                )}
                                {story.status !== "pending" && (
                                    <button
                                        onClick={() => handleVerify(story._id, "pending")}
                                        className="w-full py-3 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 hover:text-black transition-all"
                                    >
                                        Reset to Pending
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredStories.length === 0 && (
                        <div className="col-span-full py-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                                <MessageSquare className="w-6 h-6 text-gray-200" />
                            </div>
                            <p className="text-sm text-gray-400 font-medium">No stories found in this category.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon, highlight = false }: { title: string; value: number; icon: React.ReactNode; highlight?: boolean }) {
    return (
        <div className={`p-6 rounded-[2rem] border transition-all ${highlight ? 'bg-black text-white border-black' : 'bg-white border-gray-100'}`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${highlight ? 'bg-white/10' : 'bg-gray-50'}`}>{icon}</div>
                <span className="text-2xl font-bold tracking-tight">{value}</span>
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${highlight ? 'text-gray-400' : 'text-gray-400'}`}>{title}</p>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        pending: "bg-orange-50 text-orange-600 border-orange-100",
        approved: "bg-green-50 text-green-600 border-green-100",
        rejected: "bg-red-50 text-red-600 border-red-100",
    }[status] || "bg-gray-50 text-gray-600 border-gray-100";

    return (
        <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-tight ${styles}`}>
            {status}
        </span>
    );
}
