import { motion } from "framer-motion";
import {
    MessageSquare,
    Heart,
    Briefcase,
    MoreHorizontal,
    Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getExploreFeed, likePost, addComment, type Post, updatePost, deletePost, reportPost } from "../../services/post.service";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuSub
} from "@/components/ui/dropdown-menu";
import { Pencil, Trash2, Flag } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";


const EmployeeFeed = ({ refreshKey }: { refreshKey?: number }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentingOn, setCommentingOn] = useState<string | null>(null);
    const [commentContent, setCommentContent] = useState("");
    const [view, setView] = useState<"all" | "mine">("all");
    const currentUserId = localStorage.getItem("userId");
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [reportReason, setReportReason] = useState("");
    const filteredPosts =
        view === "mine"
            ? posts.filter(p => p.employee?._id?.toString() === currentUserId)
            : posts;

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await getExploreFeed();
            setPosts(data);
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [refreshKey]);

    const handleLike = async (postId: string) => {
        try {
            const result = await likePost(postId);
            setPosts(posts.map(post => post._id === postId ? { ...post, likes: result.likes } : post));
        } catch (error) {
            console.error("Failed to like post", error);
        }
    };

    const handleAddComment = async (postId: string) => {
        if (!commentContent.trim()) return;
        try {
            const result = await addComment(postId, commentContent);
            setPosts(posts.map(post => post._id === postId ? result.post : post));
            setCommentContent("");
            setCommentingOn(null);
        } catch (error) {
            console.error("Failed to add comment", error);
        }
    };
    const handleDeletePost = async (postId: string) => {
        try {
            await deletePost(postId);

            setPosts(prev => prev.filter(post => post._id !== postId));

        } catch (error) {
            console.error("Failed to delete post", error);
        }
    };
    const handleEditPost = async (post: Post) => {
        const newContent = prompt("Edit your post", post.content);

        if (!newContent || newContent.trim() === post.content) return;

        try {
            const result = await updatePost(post._id, newContent);

            setPosts(prev =>
                prev.map(p => (p._id === post._id ? { ...p, content: result.post.content } : p))
            );

        } catch (error) {
            console.error("Failed to update post", error);
        }
    };
    const handleReportPost = async (postId: string, reason: string) => {
        try {

            const res = await reportPost(postId, reason);

            alert(res.message);

        } catch (error: any) {

            alert(error.message);

        }
    };
    const getAuthorInitial = (name: string) => name ? name.charAt(0).toUpperCase() : "U";

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                <p className="text-slate-500 font-medium">Loading feed...</p>
            </div>
        );
    }

    return (
        <section className="max-w-3xl mx-auto py-10 px-4 w-full">
            <div className="flex items-center justify-between mb-8">

                <h3 className="text-xl font-bold text-slate-800">Recent Activity</h3>

                <div className="flex items-center gap-2">

                    <Toggle
                        pressed={view === "all"}
                        onPressedChange={() => setView("all")}
                        variant="outline"
                        aria-label="All posts"
                        className="text-xs"
                    >
                        All Posts
                    </Toggle>

                    <Toggle
                        pressed={view === "mine"}
                        onPressedChange={() => setView("mine")}
                        variant="outline"
                        aria-label="My posts"
                        className="text-xs"
                    >
                        My Posts
                    </Toggle>

                </div>

            </div>

            {posts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                    <p className="text-slate-500">No posts found. Be the first to post!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredPosts.map((post, index) => {

                        const currentUserId = localStorage.getItem("userId");
                        const isOwner = post.employee?._id?.toString() === currentUserId;
                        const isLiked = post.likes?.includes(currentUserId || "");
                        const jobTitle = post.company?.jobs?.find(
                            job => job._id === post.employee?.designation
                        )?.title;
                        return (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-4">

                                        <div className="flex items-center gap-3">

                                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shadow-inner">
                                                {getAuthorInitial(post.employee?.name)}
                                            </div>

                                            <div>

                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-slate-900 font-bold text-sm">{post.employee?.name}</h4>
                                                    <Briefcase className="w-3 h-3 text-blue-500" />
                                                </div>

                                                <p className="text-slate-500 text-[11px] font-medium">
                                                    {jobTitle || "Employee"} @ {post.company?.name || "Company"} • {new Date(post.createdAt).toLocaleDateString()}
                                                </p>

                                            </div>
                                        </div>


                                        {/* Dropdown Menu */}
                                        <DropdownMenu>

                                            <DropdownMenuTrigger asChild>
                                                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end" className="w-44">

                                                {isOwner ? (
                                                    <>
                                                        <DropdownMenuItem onClick={() => handleEditPost(post)} className="flex items-center gap-2">
                                                            <Pencil className="w-4 h-4" />
                                                            Edit Post
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem onClick={() => handleDeletePost(post._id)} className="flex items-center gap-2 text-red-500">
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete Post
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator />

                                                    </>
                                                ) : (
                                                    <>
                                                        <DropdownMenuSub>

                                                            <DropdownMenuSubTrigger className="flex items-center gap-2 text-red-500">
                                                                <Flag className="w-4 h-4" />
                                                                Report
                                                            </DropdownMenuSubTrigger>

                                                            <DropdownMenuSubContent className="w-44">

                                                                <DropdownMenuItem
                                                                    onClick={() => handleReportPost(post._id, "Spam")}
                                                                >
                                                                    Spam
                                                                </DropdownMenuItem>

                                                                <DropdownMenuItem
                                                                    onClick={() => handleReportPost(post._id, "Harassment")}
                                                                >
                                                                    Harassment
                                                                </DropdownMenuItem>

                                                                <DropdownMenuItem
                                                                    onClick={() => handleReportPost(post._id, "Fake Information")}
                                                                >
                                                                    Fake Information
                                                                </DropdownMenuItem>

                                                                <DropdownMenuItem
                                                                    onClick={() => handleReportPost(post._id, "Inappropriate Content")}
                                                                >
                                                                    Inappropriate Content
                                                                </DropdownMenuItem>

                                                            </DropdownMenuSubContent>

                                                        </DropdownMenuSub>
                                                    </>
                                                )}

                                            </DropdownMenuContent>

                                        </DropdownMenu>

                                    </div>

                                    {/* Content */}
                                    <div className="mb-4">
                                        <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
                                            {post.content}
                                        </p>
                                        {post.image && (
                                            <div className="mt-4 rounded-xl overflow-hidden border border-slate-200">
                                                <img
                                                    src={post.image}
                                                    alt="Post"
                                                    className="w-full max-h-[400px] object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-3 border-t border-slate-100 flex items-center gap-6">
                                        <button
                                            onClick={() => handleLike(post._id)}
                                            className={`flex items-center gap-1.5 transition-colors ${isLiked ? "text-red-500" : "text-slate-500 hover:text-red-500"
                                                }`}
                                        >
                                            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                                            <span className="text-xs font-semibold">{post.likes?.length || 0}</span>
                                        </button>
                                        <button
                                            onClick={() => setCommentingOn(commentingOn === post._id ? null : post._id)}
                                            className="flex items-center gap-1.5 text-slate-500 hover:text-blue-500 transition-colors"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            <span className="text-xs font-semibold">{post.comments?.length || 0}</span>
                                        </button>
                                    </div>

                                    {/* Comments Section */}
                                    {commentingOn === post._id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="mt-4 pt-4 border-t border-slate-50"
                                        >
                                            <div className="flex gap-2 mb-4">
                                                <input
                                                    type="text"
                                                    value={commentContent}
                                                    onChange={(e) => setCommentContent(e.target.value)}
                                                    placeholder="Add a comment..."
                                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                />
                                                <button
                                                    onClick={() => handleAddComment(post._id)}
                                                    className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-600 transition-colors"
                                                >
                                                    Post
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                {post.comments?.map((comment) => (
                                                    <div key={comment._id} className="flex gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
                                                            {getAuthorInitial(comment.user?.name)}
                                                        </div>
                                                        <div className="bg-slate-50 rounded-lg px-3 py-2 flex-1">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <p className="text-[11px] font-bold text-slate-900">{comment.user?.name}</p>
                                                                <p className="text-[9px] text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                            <p className="text-xs text-slate-700">{comment.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </section>

    );

};

export default EmployeeFeed;

