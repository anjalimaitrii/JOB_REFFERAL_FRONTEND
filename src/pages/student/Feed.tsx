import { motion } from "framer-motion";
import {
    MessageSquare,
    Heart,
    Briefcase,
    MoreHorizontal,
    Loader2,
    Plus,
    Check
} from "lucide-react";

import { useEffect, useState } from "react";
import { getFollowingFeed, getExploreFeed, likePost, addComment, type Post } from "../../services/post.service";
import { followEmployee, unfollowEmployee } from "../../services/follow.service";

const Feed = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"recent" | "explore">("explore");
    const [commentingOn, setCommentingOn] = useState<string | null>(null);
    const [commentContent, setCommentContent] = useState("");
    const [togglingFollow, setTogglingFollow] = useState<string | null>(null);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = filter === "recent" ? await getFollowingFeed() : await getExploreFeed();
            setPosts(data);
        } catch (error) {
            console.error("Failed to fetch feed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [filter]);

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

    const handleFollowToggle = async (employeeId: string, isCurrentlyFollowing: boolean) => {
        if (!employeeId) return;
        setTogglingFollow(employeeId);
        try {
            if (isCurrentlyFollowing) {
                await unfollowEmployee(employeeId);
            } else {
                await followEmployee(employeeId);
            }
            // Update all posts from this specific employee in the current view
            setPosts(prevPosts => prevPosts.map(post =>
                String(post.employee?._id) === String(employeeId)
                    ? { ...post, isFollowing: !isCurrentlyFollowing }
                    : post
            ));
        } catch (error) {
            console.error("Failed to toggle follow", error);
        } finally {
            setTogglingFollow(null);
        }
    };

    const getAuthorInitial = (name: string) => name ? name.charAt(0).toUpperCase() : "U";

    return (
        <section className="mt-14 px-4 sm:px-8 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-white">Activity Feed</h3>
                    <p className="text-gray-400 text-sm mt-1">Stay updated with latest opportunities and stories</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter("recent")}
                        className={`px-4 py-2 rounded-full border text-xs font-medium transition-colors ${filter === "recent"
                            ? "bg-white/10 border-white/20 text-white"
                            : "border-white/10 text-gray-400 hover:bg-white/5"
                            }`}
                    >
                        Following
                    </button>
                    <button
                        onClick={() => setFilter("explore")}
                        className={`px-4 py-2 rounded-full border text-xs font-medium transition-colors ${filter === "explore"
                            ? "bg-amber-400 border-amber-400 text-black font-bold"
                            : "border-white/10 text-gray-400 hover:bg-white/5"
                            }`}
                    >
                        Explore
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                    <p className="text-gray-400 font-medium">Loading feed...</p>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <p className="text-gray-500">
                        {filter === "recent"
                            ? "You are not following any employees yet, or they haven't posted anything. Go to 'Explore' to find people to follow!"
                            : "No posts found in the explore feed."}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map((post, index) => {
                        const currentUserId = localStorage.getItem("userId");
                        const isLiked = post.likes?.includes(currentUserId || "");
                        const jobTitle = post.company?.jobs?.find(
                            job => job._id === post.employee?.designation
                        )?.title;
                        const isFollowing = post.isFollowing;

                        return (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[#12121a] rounded-3xl border border-white/5 overflow-hidden shadow-xl"
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-400 font-bold text-lg shadow-inner border border-amber-400/20">
                                                {getAuthorInitial(post.employee?.name)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-white font-semibold">{post.employee?.name}</h4>
                                                    <Briefcase className="w-3 h-3 text-blue-400" />

                                                    <div className="h-1 w-1 rounded-full bg-gray-600 mx-1" />

                                                    <button
                                                        disabled={togglingFollow === post.employee?._id}
                                                        onClick={() => handleFollowToggle(post.employee?._id, !!isFollowing)}
                                                        className={`text-[11px] font-bold flex items-center gap-1 transition-colors ${isFollowing
                                                            ? "text-gray-400 hover:text-white"
                                                            : "text-amber-400 hover:text-amber-500"
                                                            }`}
                                                    >
                                                        {togglingFollow === post.employee?._id ? (
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                        ) : isFollowing ? (
                                                            <>
                                                                <Check className="w-3 h-3" />
                                                                Following
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Plus className="w-3 h-3" />
                                                                Follow
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                                <p className="text-gray-500 text-xs">
                                                    {jobTitle || "Employee"} @ {post.company?.name || "Company"} • {new Date(post.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="mb-4">
                                        <p className="text-gray-200 leading-relaxed text-[15px] whitespace-pre-wrap">
                                            {post.content}
                                        </p>
                                        {post.image && (
                                            <div className="mt-4 rounded-2xl overflow-hidden border border-white/5">
                                                <img src={post.image} alt="Post content" className="w-full h-auto max-h-[500px] object-cover" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-4 border-t border-white/5 flex items-center gap-6">
                                        <button
                                            onClick={() => handleLike(post._id)}
                                            className={`flex items-center gap-2 transition-colors group ${isLiked ? "text-red-400" : "text-gray-500 hover:text-red-400"
                                                }`}
                                        >
                                            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                                            <span className="text-xs font-medium">{post.likes?.length || 0}</span>
                                        </button>
                                        <button
                                            onClick={() => setCommentingOn(commentingOn === post._id ? null : post._id)}
                                            className="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            <span className="text-xs font-medium">{post.comments?.length || 0}</span>
                                        </button>
                                    </div>

                                    {/* Comments Section */}
                                    {commentingOn === post._id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="mt-4 pt-4 border-t border-white/5"
                                        >
                                            <div className="flex gap-2 mb-4">
                                                <input
                                                    type="text"
                                                    value={commentContent}
                                                    onChange={(e) => setCommentContent(e.target.value)}
                                                    placeholder="Add a comment..."
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                />
                                                <button
                                                    onClick={() => handleAddComment(post._id)}
                                                    className="bg-amber-400 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-500 transition-colors"
                                                >
                                                    Post
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                {post.comments?.map((comment) => (
                                                    <div key={comment._id} className="flex gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-xs font-bold text-amber-400 shrink-0 border border-white/5">
                                                            {getAuthorInitial(comment.user?.name)}
                                                        </div>
                                                        <div className="bg-white/5 rounded-2xl px-4 py-3 flex-1 border border-white/5">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <p className="text-xs font-bold text-white">{comment.user?.name}</p>
                                                                <p className="text-[10px] text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                            <p className="text-sm text-gray-300">{comment.content}</p>
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

                    <div className="text-center py-8">
                        <button className="text-amber-400 text-sm font-bold hover:underline">
                            View more posts
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Feed;
