import { useEffect, useState } from "react";
import {
    type Post
} from "../../services/post.service";
import { deleteAdminPost, getAdminPosts } from "../../services/admin.service";
import {
    Search,
    Trash2,
    ChevronsLeft,
    Building,
    Clock,
    MessageSquare,
    Heart,
    Loader2,
    Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function AdminPosts() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        const filtered = posts.filter(post =>
            post.content.toLowerCase().includes(query) ||
            post.employee?.name.toLowerCase().includes(query) ||
            post.company?.name.toLowerCase().includes(query)
        );
        setFilteredPosts(filtered);
    }, [searchQuery, posts]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const res = await getAdminPosts();
            setPosts(res.data || []);
            setFilteredPosts(res.data || []);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId: string) => {
        if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;

        try {
            setDeletingId(postId);
            await deleteAdminPost(postId);
            setPosts(prev => prev.filter(p => p._id !== postId));
        } catch (error) {
            alert("Failed to delete post");
            console.error(error);
        } finally {
            setDeletingId(null);
        }
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
            {/* Header Section */}
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
                    >
                        <ChevronsLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Activity className="w-4 h-4" />
                        </div>
                        <h1 className="text-sm font-bold tracking-tight text-slate-800 uppercase">Feed Monitoring</h1>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Activity</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto p-4 lg:p-8 space-y-8">
                {/* Search and Metrics */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by keywords, user, or company..."
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-[1.2rem] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm placeholder:text-slate-300"
                        />
                    </div>
                    <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="text-right">
                            <p className="text-sm font-black text-slate-900 leading-none">{filteredPosts.length}</p>
                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1 whitespace-nowrap">Logged Records</p>
                        </div>
                    </div>
                </div>

                {/* Posts List */}
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredPosts.map((post, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                                key={post._id}
                                className="bg-gradient-to-br from-white to-slate-100 border border-slate-200 rounded-[2.5rem] p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative group"
                            >
                                <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                                    {/* Author Profile */}
                                    <div className="flex lg:flex-col items-center lg:items-start gap-4 lg:w-32 shrink-0">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600 font-black text-lg">
                                            {post.employee?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">{post.employee?.name}</h3>
                                            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-0.5">Contributor</p>
                                        </div>
                                    </div>

                                    {/* Main Content Area */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                <Building className="w-3 h-3 " />
                                                <span className="text-slate-600">{post.company?.name || "N/A"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                <Clock className="w-3 h-3 " />
                                                <span className="text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                                            </div>

                                        </div>

                                        <div className="p-5 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm">
                                            <p className="text-sm text-slate-700 leading-relaxed italic">
                                                "{post.content}"
                                            </p>
                                            {post.image && (
                                                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-indigo-100">
                                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                                                    Attachment Included
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Dangerous Action */}
                                    <div className="lg:w-16 flex items-center justify-end">
                                        <button
                                            disabled={deletingId === post._id}
                                            onClick={() => handleDelete(post._id)}
                                            className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all active:scale-95 group/btn"
                                        >
                                            {deletingId === post._id ? (
                                                <Loader2 className="w-5 h-5 animate-spin text-rose-600" />
                                            ) : (
                                                <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Decorative Background element */}
                                <div className="absolute -right-6 -bottom-6 opacity-[0.02] text-black group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                                    <Activity size={160} />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredPosts.length === 0 && (
                        <div className="py-24 text-center bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                <Search className="w-8 h-8 text-slate-200" />
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">No registry records found matching criteria</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AdminPosts;
