import { useEffect, useState } from "react";
import {

    type Post
} from "../../services/post.service";
import { deleteAdminPost, getAdminPosts } from "../../services/admin.service";
import {
    Search,
    Trash2,
    ArrowLeft,
    Building,
    Clock,
    MessageSquare,
    Heart,
    Loader2,
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
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-black animate-spin" />
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Loading Post Registry...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans">
            {/* Header Section */}
            <header className="bg-black text-white px-6 py-4 sticky top-0 z-50 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-all group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-xs font-bold tracking-[0.1em] uppercase">Feed Monitoring</h1>
                        <p className="text-[8px] text-gray-500 font-bold uppercase">System Registry</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5 flex items-center gap-2.5 focus-within:border-white/30 transition-all">
                        <Search className="w-3.5 h-3.5 text-gray-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter activity..."
                            className="bg-transparent border-none outline-none text-[11px] font-medium w-48 lg:w-64 placeholder:text-gray-600"
                        />
                    </div>
                    <div className="h-6 w-px bg-white/10 mx-1 hidden md:block" />
                    <div className="text-right hidden md:block">
                        <p className="text-lg font-black text-white leading-none">{filteredPosts.length}</p>
                        <p className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">Records</p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredPosts.map((post) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={post._id}
                                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    {/* Author & Info */}
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 text-xs font-bold text-gray-400">
                                            {post.employee?.name?.charAt(0) || "U"}
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xs font-bold text-gray-900">{post.employee?.name}</h3>
                                                <span className="px-1.5 py-0.5 rounded-full bg-black text-white text-[8px] font-bold tracking-tighter uppercase">Contributor</span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-medium text-gray-400">
                                                <span className="flex items-center gap-1.5"><Building className="w-3 h-3" /> {post.company?.name}</span>
                                                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1.5"><Heart className="w-3 h-3" /> {post.likes?.length || 0}</span>
                                                <span className="flex items-center gap-1.5"><MessageSquare className="w-3 h-3" /> {post.comments?.length || 0}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Post Content Preview */}
                                    <div className="flex-[2] lg:px-4">
                                        <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                                            "{post.content}"
                                        </p>
                                        {post.image && (
                                            <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-50 border border-gray-100 text-[8px] font-bold text-gray-400 uppercase">
                                                Attachment
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 justify-end">
                                        <button
                                            disabled={deletingId === post._id}
                                            onClick={() => handleDelete(post._id)}
                                            className="p-2 rounded-xl bg-red-50 text-red-400 border border-red-100 hover:bg-red-500 hover:text-white transition-all group/btn"
                                            title="Delete Post"
                                        >
                                            {deletingId === post._id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredPosts.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-3xl flex items-center justify-center mx-auto">
                                <Search className="w-8 h-8 text-gray-200" />
                            </div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No matching records found in the registry</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AdminPosts;
