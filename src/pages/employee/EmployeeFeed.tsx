import { motion } from "framer-motion";
import {
  MessageSquare,
  Heart,
  Briefcase,
  MoreHorizontal,
  ChevronsLeft,
  Pencil,
  Trash2,
  Flag,
  ThumbsDown,

} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getExploreFeed,
  likePost,
  dislikePost,
  addComment,
  type Post,
  updatePost,
  deletePost,
  reportPost,
} from "../../services/post.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import CreatePost from "./CreatePost";

const EmployeeFeed = ({
  refreshKey,
}: {
  refreshKey?: number;
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [view, setView] = useState<"all" | "mine" | "company">("all");
  const currentUserId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.name || "Employee";
  const userInitial = userName.charAt(0).toUpperCase();
  const userCompanyId = user?.company?._id || user?.company;

  const filteredPosts =
    view === "mine"
      ? posts.filter((p) => p.employee?._id?.toString() === currentUserId)
      : view === "company"
        ? posts.filter((p) => {
          const postCompanyId = p.company?._id || p.company;
          return postCompanyId?.toString() === userCompanyId?.toString();
        })
        : posts;

  const myPostsCount = posts.filter((p) => p.employee?._id?.toString() === currentUserId).length;
  const totalLikes = posts
    .filter((p) => p.employee?._id?.toString() === currentUserId)
    .reduce((acc, p) => acc + (p.likes?.length || 0), 0);

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
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, likes: result.likes } : post,
        ),
      );
    } catch (error) {
      console.error("Failed to like post", error);
    }
  };

  const handleDislike = async (postId: string) => {
    try {
      const result = await dislikePost(postId);
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, dislikes: result.dislikes } : post,
        ),
      );
    } catch (error) {
      console.error("Failed to dislike post", error);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentContent.trim()) return;
    try {
      const result = await addComment(postId, commentContent);
      setPosts(posts.map((post) => (post._id === postId ? result.post : post)));
      setCommentContent("");
      setCommentingOn(null);
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  const handleEditPost = async (post: Post) => {
    const newContent = prompt("Edit your post", post.content);
    if (!newContent || newContent.trim() === post.content) return;
    try {
      const result = await updatePost(post._id, newContent);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === post._id ? { ...p, content: result.post.content } : p,
        ),
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

  const getAuthorInitial = (name: string) =>
    name ? name.charAt(0).toUpperCase() : "U";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
        <p className="text-slate-500 font-bold tracking-tight">Syncing community...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Sticky Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm w-full">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all "
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold  tracking-tight leading-tight">Community Feed</h2>
              <p className="text-[11px] text-slate-500 font-medium">Connect and share with fellow employees</p>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
            <button
              onClick={() => setView("all")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${view === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              All Activity
            </button>
            <button
              onClick={() => setView("company")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${view === "company" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Company Posts
            </button>
            <button
              onClick={() => setView("mine")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${view === "mine" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              My Posts
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">


            {/* Quick Post Entry */}
            <CreatePost onPostCreated={fetchPosts} />

            {/* Posts List */}
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">No posts found. Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post, index) => {
                  const isOwner = post.employee?._id?.toString() === currentUserId;
                  const jobTitle = post.company?.jobs?.find(
                    (job) => job._id === post.employee?.designation,
                  )?.title;

                  return (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-4 sm:p-5">
                        {/* Post Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shadow-inner shrink-0">
                              {getAuthorInitial(post.employee?.name)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-slate-900 font-bold text-sm leading-none">
                                  {post.employee?.name}
                                </h4>
                                {isOwner && (
                                  <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">Author</span>
                                )}
                              </div>
                              <p className="text-slate-500 text-[10px] font-semibold flex items-center gap-1.5 mt-1">
                                <Briefcase className="w-3 h-3 text-blue-400" />
                                {jobTitle || "Employee"} @{" "}
                                <span className="text-slate-800">{post.company?.name || "Company"}</span>
                                <span className="text-slate-300">•</span>
                                {new Date(post.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-all">
                                <MoreHorizontal className="w-5 h-5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl shadow-lg border-slate-100">
                              {isOwner ? (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => handleEditPost(post)}
                                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs"
                                  >
                                    <Pencil className="w-3.5 h-3.5 text-slate-500" />
                                    <span className="font-bold">Edit Post</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeletePost(post._id)}
                                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer text-xs"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span className="font-bold">Delete Post</span>
                                  </DropdownMenuItem>
                                </>
                              ) : (
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-red-50 text-red-600 text-xs">
                                    <Flag className="w-3.5 h-3.5" />
                                    <span className="font-bold">Report</span>
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuSubContent className="w-48 p-2 rounded-xl shadow-lg">
                                    {["Spam", "Harassment", "Fake Information", "Inappropriate"].map(reason => (
                                      <DropdownMenuItem
                                        key={reason}
                                        onClick={() => handleReportPost(post._id, reason)}
                                        className="p-2 rounded-lg hover:bg-slate-50 text-xs font-bold cursor-pointer"
                                      >
                                        {reason}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuSubContent>
                                </DropdownMenuSub>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Post Content */}
                        <div className="mb-4">
                          <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap font-medium">
                            {post.content}
                          </p>
                          {(() => {
                            const postImages: string[] = Array.isArray(post.image) ? post.image : (typeof post.image === 'string' ? [post.image] : (post.images || []));
                            if (postImages.length === 0) return null;

                            return (
                              <div className={`mt-3 grid gap-1.5 ${postImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shadow-inner`}>
                                {postImages.map((img, idx) => (
                                  <img
                                    key={idx}
                                    src={img}
                                    alt={`Post image ${idx + 1}`}
                                    onClick={() => setPreviewImage(img)}
                                    className={`w-full object-cover cursor-pointer transition-transform duration-300 hover:scale-[1.02] ${postImages.length === 1 ? 'max-h-[300px] object-contain' : 'h-32'}`}
                                  />
                                ))}
                              </div>
                            );
                          })()}
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t border-slate-100 flex items-center gap-5">
                          <button
                            onClick={() => handleLike(post._id)}
                            className={`flex items-center gap-2 transition-all duration-300 group ${post.likes?.includes(currentUserId || "")
                              ? "text-rose-500 scale-105"
                              : "text-slate-500 hover:text-rose-500"
                              }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${post.likes?.includes(currentUserId || "") ? "fill-current" : ""}`}
                            />
                            <span className="text-xs font-bold">
                              {post.likes?.length || 0}
                            </span>
                          </button>

                          <button
                            onClick={() => handleDislike(post._id)}
                            className={`flex items-center gap-2 transition-all duration-300 group ${post.dislikes?.includes(currentUserId || "")
                              ? "text-amber-500 scale-105"
                              : "text-slate-500 hover:text-amber-500"
                              }`}
                          >
                            <ThumbsDown
                              className={`w-4 h-4 ${post.dislikes?.includes(currentUserId || "") ? "fill-current" : ""}`}
                            />
                            <span className="text-xs font-bold">
                              {post.dislikes?.length || 0}
                            </span>
                          </button>

                          <button
                            onClick={() =>
                              setCommentingOn(
                                commentingOn === post._id ? null : post._id,
                              )
                            }
                            className={`flex items-center gap-2 transition-all duration-300 ${commentingOn === post._id ? "text-amber-500" : "text-slate-500 hover:text-amber-500"}`}
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-xs font-bold">
                              {post.comments?.length || 0}
                            </span>
                          </button>
                        </div>

                        {/* Comments Section */}
                        {commentingOn === post._id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 pt-4 border-t border-slate-50"
                          >
                            <div className="flex gap-2.5 mb-4">
                              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-amber-500 shrink-0">
                                {userInitial}
                              </div>
                              <div className="flex-1 flex gap-2">
                                <input
                                  type="text"
                                  value={commentContent}
                                  onChange={(e) => setCommentContent(e.target.value)}
                                  placeholder="Write a comment..."
                                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                                />
                                <button
                                  onClick={() => handleAddComment(post._id)}
                                  className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[11px] font-black tracking-wide hover:bg-black transition-colors shadow-sm"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>

                            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                              {post.comments?.map((comment) => (
                                <div key={comment._id} className="flex gap-2.5">
                                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] font-black text-slate-500 shrink-0">
                                    {getAuthorInitial(comment.user?.name)}
                                  </div>
                                  <div className="bg-slate-50 rounded-xl px-4 py-3 flex-1 border border-slate-100 group">
                                    <div className="flex justify-between items-center mb-1">
                                      <p className="text-[11px] font-black text-slate-900">
                                        {comment.user?.name}
                                      </p>
                                      <p className="text-[9px] text-slate-400 font-bold">
                                        {new Date(
                                          comment.createdAt,
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                      {comment.content}
                                    </p>
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
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-5 hidden lg:block">

            {/* Employee Focus Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 blur-2xl rounded-full" />
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-400 flex items-center justify-center text-black text-2xl font-black mb-4 shadow-lg shadow-amber-200 mx-auto transform group-hover:rotate-3 transition-transform">
                  {userInitial}
                </div>
                <h4 className="text-lg font-black text-slate-900 tracking-tight">{userName}</h4>
                <p className="text-slate-500 font-bold text-[11px] mb-5">Verified Professional</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-slate-900 font-black text-xl">{myPostsCount}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Posts</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-rose-500 font-black text-xl">{totalLikes}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Impressions</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/profile")}
                  className="bg-gradient-to-br from-[#1a1a1a] via-[#333] to-[#444] text-white border-gray-800 shadow-xl w-full mt-5 py-2.5 bg-slate-900 hover:bg-black text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all  shadow-slate-200"
                >
                  Manage Profile
                </button>
              </div>
            </div>

            {/* Help/Support Card */}
            <div className="bg-gradient-to-br from-[#1a1a1a] via-[#333] to-[#444] text-white border-gray-800 shadow-xl rounded-2xl p-6 ">
              <h5 className="text-white font-black text-sm mb-2">Empowering Referrals</h5>
              <p className="text-slate-400 text-[11px] font-medium leading-relaxed mb-5">
                Your contributions help bridge the gap between talent and opportunity. Keep posting!
              </p>
              <button
                onClick={() => navigate("/employee/requests")}
                className="w-full py-2.5 bg-white text-black text-[9px] font-black uppercase tracking-[0.15em] rounded-xl hover:bg-slate-100 transition-all shadow-sm"
              >
                Review Requests
              </button>
            </div>

          </div>
        </div>
      </main>

      {previewImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-6xl w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition"
            >
              ✕
            </button>

            {/* Image */}
            <img
              src={previewImage || undefined}
              alt="Preview"
              className="max-h-[90vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeFeed;
