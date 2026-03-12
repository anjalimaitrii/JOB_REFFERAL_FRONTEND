import { motion } from "framer-motion";
import {
  MessageSquare,
  Heart,
  Briefcase,
  MoreHorizontal,
  Loader2,
  Plus,
  Check,
  Search,
  TrendingUp,
  Users,
  Building2,
  Star,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFollowingFeed,
  getExploreFeed,
  likePost,
  addComment,
  type Post,
} from "../../services/post.service";
import {
  followEmployee,
  unfollowEmployee,
} from "../../services/follow.service";
import { getAllEmployees } from "../../services/employee.service";
import { getCompanies } from "../../services/company.service";

type Props = {
  companyId?: string;
  limit?: number;
};

const Feed = ({ companyId }: Props) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"recent" | "explore">("explore");
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [togglingFollow, setTogglingFollow] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);


  // Sidebar states
  const [suggestedEmployees, setSuggestedEmployees] = useState<any[]>([]);
  const [trendingCompanies, setTrendingCompanies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.name || localStorage.getItem("userName") || "Student";
  const userInitial = userName.charAt(0).toUpperCase();
  const myCompanyId =
    typeof user?.company === "object"
      ? String(user?.company?._id)
      : String(user?.company || "");

  const isEmployee = user?.role === "employee";
  const fetchSidebarData = async () => {
    try {
      const [empRes, compRes] = await Promise.all([
        getAllEmployees(),
        getCompanies()
      ]);

      const employees = Array.isArray(empRes.data) ? empRes.data : (Array.isArray(empRes) ? empRes : []);
      const companies = Array.isArray(compRes.data) ? compRes.data : (Array.isArray(compRes) ? compRes : []);

      setSuggestedEmployees(employees.slice(0, 4));
      setTrendingCompanies(companies.slice(0, 2));
    } catch (error) {
      console.error("Failed to fetch sidebar data", error);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let data;

      if (companyId) {
        const posts =
          filter === "recent"
            ? await getFollowingFeed()
            : await getExploreFeed();

        data = posts.filter(
          (post: any) => String(post.company?._id) === String(companyId)
        );
      } else {
        data =
          filter === "recent"
            ? await getFollowingFeed()
            : await getExploreFeed();

        // hide own company posts if employee
        if (isEmployee && myCompanyId) {
          data = data.filter(
            (post: any) => String(post.company?._id) !== myCompanyId
          );
        }
      }

      setPosts(data);

    } catch (error) {
      console.error("Failed to fetch feed", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
    fetchSidebarData();
  }, [filter]);

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

  const handleFollowToggle = async (
    employeeId: string,
    isCurrentlyFollowing: boolean,
  ) => {
    if (!employeeId) return;
    setTogglingFollow(employeeId);
    try {
      if (isCurrentlyFollowing) {
        await unfollowEmployee(employeeId);
      } else {
        await followEmployee(employeeId);
      }
      // Update all posts from this specific employee in the current view
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          String(post.employee?._id) === String(employeeId)
            ? { ...post, isFollowing: !isCurrentlyFollowing }
            : post,
        ),
      );
      // Also update suggested employees if they are there
      setSuggestedEmployees(prev => prev.map(emp =>
        emp._id === employeeId ? { ...emp, isFollowing: !isCurrentlyFollowing } : emp
      ));
    } catch (error) {
      console.error("Failed to toggle follow", error);
    } finally {
      setTogglingFollow(null);
    }
  };

  const getAuthorInitial = (name: string) =>
    name ? name.charAt(0).toUpperCase() : "U";

  // Search and Filter Logic
  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    const matchesContent = post.content?.toLowerCase().includes(query);
    const matchesAuthor = post.employee?.name?.toLowerCase().includes(query);
    const matchesCompany = post.company?.name?.toLowerCase().includes(query);
    return matchesContent || matchesAuthor || matchesCompany;
  });

  return (
    <section className="min-h-screen bg-[#050505] pt-24 px-4 sm:px-6 lg:px-8 pb-12 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column - Main Feed */}
          <div className="lg:col-span-8 space-y-6">

            {/* Header & Search */}
            <div className="bg-[#12121a] p-6 rounded-3xl border border-white/5 shadow-2xl mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate("/student/dashboard")}
                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all group"
                  >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">Activity Feed</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Stay updated with latest opportunities and stories
                    </p>
                  </div>
                </div>
                <div className="flex items-center bg-white/5 rounded-2xl border border-white/10 px-4 py-2 flex-1 md:max-w-md">
                  <Search className="w-4 h-4 text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search posts, people, or companies..."
                    className="bg-transparent border-none outline-none text-white text-sm w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setFilter("recent")}
                  className={`px-6 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-300 ${filter === "recent"
                    ? "bg-amber-400 border-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                    : "border-white/10 text-gray-400 hover:bg-white/5 hover:border-white/20"
                    }`}
                >
                  Following
                </button>
                <button
                  onClick={() => setFilter("explore")}
                  className={`px-6 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-300 ${filter === "explore"
                    ? "bg-amber-400 border-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                    : "border-white/10 text-gray-400 hover:bg-white/5 hover:border-white/20"
                    }`}
                >
                  Explore
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-t-2 border-amber-500 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-500/50" />
                  </div>
                </div>
                <p className="text-gray-400 font-medium">Loading your feed...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 bg-[#12121a] rounded-3xl border border-dashed border-white/10"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-10 h-10 text-gray-600" />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">No results found</h4>
                <p className="text-gray-500 max-w-xs mx-auto">
                  {searchQuery
                    ? `No matches found for "${searchQuery}". Try different keywords.`
                    : filter === "recent"
                      ? "You are not following any employees yet. Step outside your circle and explore!"
                      : "The explore feed is currently quiet. Check back later!"}
                </p>
                {!searchQuery && filter === "recent" && (
                  <button
                    onClick={() => setFilter("explore")}
                    className="mt-6 text-amber-400 text-sm font-bold hover:underline"
                  >
                    Go to Explore Feed
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post, index) => {
                  const currentUserId = localStorage.getItem("userId");
                  const isLiked = post.likes?.includes(currentUserId || "");
                  const jobTitle = post.company?.jobs?.find(
                    (job) => job._id === post.employee?.designation,
                  )?.title;
                  const isFollowing = post.isFollowing;

                  return (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-[#12121a] rounded-3xl border border-white/5 overflow-hidden shadow-xl hover:border-white/10 transition-colors group"
                    >
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/5 flex items-center justify-center text-amber-400 font-bold text-xl shadow-inner border border-amber-400/20 ring-4 ring-black/50">
                              {getAuthorInitial(post.employee?.name)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-white font-bold hover:text-amber-400 transition-colors cursor-pointer">
                                  {post.employee?.name}
                                </h4>
                                <div className="h-1 w-1 rounded-full bg-gray-600" />
                                <button
                                  disabled={togglingFollow === post.employee?._id}
                                  onClick={() =>
                                    handleFollowToggle(
                                      post.employee?._id,
                                      !!isFollowing,
                                    )
                                  }
                                  className={`text-[11px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${isFollowing
                                    ? "text-gray-500 hover:text-white"
                                    : "text-amber-400 hover:text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md"
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
                              <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1.5 font-medium">
                                <Briefcase className="w-3 h-3 text-amber-500/50" />
                                {jobTitle || "Employee"} @{" "}
                                <span className="text-amber-400/80">{post.company?.name || "Company"}</span>
                                <span className="text-gray-700 mx-1">•</span>
                                {new Date(post.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <button className="p-2.5 hover:bg-white/5 rounded-2xl text-gray-500 transition-all opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="mb-6">
                          <p className="text-gray-300 leading-relaxed text-[15px] whitespace-pre-wrap">
                            {post.content}
                          </p>
                          {post.image && (
                            <div className="mt-4 rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 shadow-inner">
                              <img
                                src={post.image}
                                alt="Post"
                                onClick={() => setPreviewImage(post.image!)}
                                className="w-full max-h-[400px] object-contain cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                              />
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="pt-5 border-t border-white/5 flex items-center gap-8">
                          <button
                            onClick={() => handleLike(post._id)}
                            className={`flex items-center gap-2.5 transition-all duration-300 group ${isLiked
                              ? "text-rose-500 scale-110"
                              : "text-gray-500 hover:text-rose-500"
                              }`}
                          >
                            <Heart
                              className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                            />
                            <span className="text-sm font-bold tracking-tight">
                              {post.likes?.length || 0}
                            </span>
                          </button>
                          <button
                            onClick={() =>
                              setCommentingOn(
                                commentingOn === post._id ? null : post._id,
                              )
                            }
                            className={`flex items-center gap-2.5 transition-all duration-300 ${commentingOn === post._id ? "text-amber-400" : "text-gray-500 hover:text-amber-400"}`}
                          >
                            <MessageSquare className="w-5 h-5" />
                            <span className="text-sm font-bold tracking-tight">
                              {post.comments?.length || 0}
                            </span>
                          </button>

                          <div className="flex-1" />

                          <button className="text-gray-600 hover:text-white transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Comments Section */}
                        {commentingOn === post._id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-6 pt-6 border-t border-white/5"
                          >
                            <div className="flex gap-3 mb-6">
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-sm font-bold text-amber-400 shrink-0 border border-white/10">
                                {userInitial}
                              </div>
                              <div className="flex-1 flex gap-2">
                                <input
                                  type="text"
                                  value={commentContent}
                                  onChange={(e) => setCommentContent(e.target.value)}
                                  placeholder="Share your thoughts..."
                                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                                />
                                <button
                                  onClick={() => handleAddComment(post._id)}
                                  className="bg-amber-400 text-black px-6 py-2.5 rounded-2xl text-xs font-bold hover:bg-amber-500 transition-colors shadow-lg shadow-amber-400/20"
                                >
                                  Post
                                </button>
                              </div>
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                              {post.comments?.map((comment) => (
                                <div key={comment._id} className="flex gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-xs font-bold text-amber-400 shrink-0 border border-white/5">
                                    {getAuthorInitial(comment.user?.name)}
                                  </div>
                                  <div className="bg-white/5 rounded-3xl px-5 py-4 flex-1 border border-white/5">
                                    <div className="flex justify-between items-center mb-1.5">
                                      <p className="text-xs font-bold text-white">
                                        {comment.user?.name}
                                      </p>
                                      <p className="text-[10px] text-gray-500 font-medium">
                                        {new Date(
                                          comment.createdAt,
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed">
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

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-8 hidden lg:block">

            {/* User Perspective Card */}
            <div className="bg-[#12121a] rounded-3xl border border-white/5 p-8 relative overflow-hidden shadow-2xl group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 blur-[60px] rounded-full pointer-events-none" />
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-amber-400 flex items-center justify-center text-black text-3xl font-black mb-6 shadow-xl shadow-amber-400/20 mx-auto">
                  {userInitial}
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-bold text-white mb-1">Hello, {userName}!</h4>
                  <p className="text-gray-400 text-sm mb-6">Aspirant Access</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                      <p className="text-amber-400 font-bold text-lg">{posts.length}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Feed</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                      <p className="text-emerald-400 font-bold text-lg">Active</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Status</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-2xl border border-white/10 transition-all"
                  >
                    View My Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Suggested Employees */}
            <div className="bg-[#12121a] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <h5 className="text-sm font-bold text-white uppercase tracking-widest">Top Mentors</h5>
                </div>

              </div>
              <div className="p-6 space-y-6">
                {suggestedEmployees.length > 0 ? suggestedEmployees.map((emp, idx) => (
                  <div key={emp._id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center text-emerald-400 font-bold text-sm border border-emerald-400/20">
                          {getAuthorInitial(emp.name)}
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#12121a]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-white text-sm font-bold leading-none group-hover:text-emerald-400 transition-colors cursor-pointer">{emp.name}</p>
                          {idx === 0 && <span className="text-[8px] bg-amber-400/10 text-amber-400 px-1 rounded uppercase font-black">Top</span>}
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium">
                          {emp.company?.name || "Verified Professional"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollowToggle(emp._id, !!emp.isFollowing)}
                      disabled={togglingFollow === emp._id}
                      className={`p-2 rounded-lg transition-all ${emp.isFollowing
                        ? "bg-emerald-400/20 text-emerald-400"
                        : "bg-white/5 hover:bg-white/10 text-gray-400"}`}
                    >
                      {togglingFollow === emp._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : emp.isFollowing ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )) : (
                  <p className="text-gray-500 text-xs text-center py-4">Finding mentors...</p>
                )}
              </div>
            </div>

            {/* Trending Companies */}
            <div className="bg-[#12121a] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/5 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                <h5 className="text-sm font-bold text-white uppercase tracking-widest">Trending Companies</h5>
              </div>
              <div className="p-6 space-y-5">
                {trendingCompanies.length > 0 ? trendingCompanies.slice(0, 2).map((company, idx) => (
                  <div key={company._id} className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate("/student/companies")}>
                    <div className="text-gray-600 font-black italic text-lg">{idx + 1}</div>
                    <div className="w-10 h-10 rounded-xl bg-sky-400/10 flex items-center justify-center text-sky-400 border border-sky-400/20">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-bold leading-none mb-1 group-hover:text-sky-400 transition-colors">{company.name}</p>
                      <p className="text-[10px] text-gray-500 font-medium">{company.industry || "Technology"} • {company.location || "Remote"}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-xs text-center py-4">Loading hiring trends...</p>
                )}
                <button
                  onClick={() => navigate("/student/companies")}
                  className="w-full mt-2 py-3 bg-sky-400/5 hover:bg-sky-400/10 text-sky-400 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-sky-400/10 transition-all"
                >
                  Browse All Companies
                </button>
              </div>
            </div>

            {/* Platform Stats Small */}
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl p-6 shadow-2xl shadow-amber-400/10">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-5 h-5 text-black fill-current" />
                <h5 className="text-black font-black text-sm uppercase">Join the Elite</h5>
              </div>
              <p className="text-black/80 text-xs font-bold leading-relaxed mb-6">
                Connect with 2k+ verified employees from top tier companies globally.
              </p>
              <button
                onClick={() => navigate("/student/requests")}
                className="w-full py-3 bg-black text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] transition-all"
              >
                Request a Referral
              </button>
            </div>

          </div>
        </div>
      </div>
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
              src={previewImage}
              alt="Preview"
              className="max-h-[90vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Feed;
