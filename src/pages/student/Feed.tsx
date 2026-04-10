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
  ChevronsLeft,
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
import { getEmployeesByCompany, getAllEmployees } from "../../services/employee.service";
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
        companyId ? getEmployeesByCompany(companyId) : getAllEmployees(),
        getCompanies()
      ]);

      const employees = Array.isArray(empRes.data) ? empRes.data : (Array.isArray(empRes) ? empRes : []);
      const companies = Array.isArray(compRes.data) ? compRes.data : (Array.isArray(compRes) ? compRes : []);

      // Sort by wallet amount and slice to top 4
      const sortedMentors = [...employees]
        .sort((a: any, b: any) => (b.wallet || 0) - (a.wallet || 0))
        .slice(0, 4);

      setSuggestedEmployees(sortedMentors);
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
  }, [filter, companyId]);

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
    <div className="min-h-screen bg-slate-50 overflow-y-auto selection:bg-amber-100">
      {/* Sticky Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm w-full">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/student/dashboard")}
                className="p-2.5  hover:bg-slate-100 rounded-xl  text-slate-500 hover:text-slate-900 transition-all group"
              >
                <ChevronsLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">Activity Feed</h2>
              </div>
            </div>

            <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-100 px-4 py-2 flex-1 md:max-w-md shadow-inner">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search community..."
                className="bg-transparent border-none outline-none text-slate-800 text-sm w-full placeholder:text-slate-400 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Main Feed */}
          <div className="lg:col-span-8 space-y-6">

            {/* Feed Filters */}
            <div className="flex justify-end">
              <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm">
                <button
                  onClick={() => setFilter("recent")}
                  className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${filter === "recent" ? "bg-amber-400 text-white shadow-md shadow-slate-200" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
                >
                  Following
                </button>
                <button
                  onClick={() => setFilter("explore")}
                  className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${filter === "explore" ? "bg-amber-400 text-white shadow-md shadow-slate-200" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
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
                <p className="text-slate-500 font-medium">Loading your feed...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-10 h-10 text-slate-300" />
                </div>
                <h4 className="text-slate-900 font-bold text-lg mb-2">No results found</h4>
                <p className="text-slate-500 max-w-xs mx-auto">
                  {searchQuery
                    ? `No matches found for "${searchQuery}". Try different keywords.`
                    : filter === "recent"
                      ? "You are not following any employees yet. Step outside your circle and explore!"
                      : "The explore feed is currently quiet. Check back later!"}
                </p>
                {!searchQuery && filter === "recent" && (
                  <button
                    onClick={() => setFilter("explore")}
                    className="mt-6 text-amber-500 text-sm font-bold hover:underline"
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
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="p-4 sm:p-5">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm shadow-inner shrink-0 border border-slate-200">
                              {getAuthorInitial(post.employee?.name)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-slate-900 text-sm font-bold hover:text-amber-500 transition-colors cursor-pointer">
                                  {post.employee?.name}
                                </h4>
                                <div className="h-1 w-1 rounded-full bg-slate-300" />
                                <button
                                  disabled={togglingFollow === post.employee?._id}
                                  onClick={() =>
                                    handleFollowToggle(
                                      post.employee?._id,
                                      !!isFollowing,
                                    )
                                  }
                                  className={`text-[11px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${isFollowing
                                    ? "text-slate-400 hover:text-slate-600"
                                    : "text-amber-500 hover:text-amber-400 bg-amber-50 px-2 py-0.5 rounded-md"
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
                              <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1.5 font-medium">
                                <Briefcase className="w-3 h-3 text-amber-400/50" />
                                {jobTitle || "Employee"} @{" "}
                                <span className="text-amber-500 font-bold">{post.company?.name || "Company"}</span>
                                <span className="text-slate-300 mx-1">•</span>
                                {new Date(post.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <button className="p-2.5 hover:bg-slate-50 rounded-2xl text-slate-400 transition-all opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="mb-4">
                          <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
                            {post.content}
                          </p>
                          {(() => {
                            const postImages: string[] = Array.isArray(post.image) ? post.image : (typeof post.image === 'string' ? [post.image] : (post.images || []));
                            if (postImages.length === 0) return null;

                            return (
                              <div className={`mt-4 grid gap-2 ${postImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 shadow-inner`}>
                                {postImages.map((img, idx) => (
                                  <img
                                    key={idx}
                                    src={img}
                                    alt={`Post image ${idx + 1}`}
                                    onClick={() => setPreviewImage(img)}
                                    className={`w-full object-cover cursor-pointer transition-transform duration-300 hover:scale-[1.02] ${postImages.length === 1 ? 'max-h-[400px] object-contain' : 'h-48'}`}
                                  />
                                ))}
                              </div>
                            );
                          })()}
                        </div>

                        {/* Actions */}
                        <div className="pt-4 border-t border-slate-100 flex items-center gap-6">
                          <button
                            onClick={() => handleLike(post._id)}
                            className={`flex items-center gap-2.5 transition-all duration-300 group ${isLiked
                              ? "text-rose-500 scale-110"
                              : "text-slate-400 hover:text-rose-500"
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
                            className={`flex items-center gap-2.5 transition-all duration-300 ${commentingOn === post._id ? "text-amber-500" : "text-slate-400 hover:text-amber-500"}`}
                          >
                            <MessageSquare className="w-5 h-5" />
                            <span className="text-sm font-bold tracking-tight">
                              {post.comments?.length || 0}
                            </span>
                          </button>

                          <div className="flex-1" />

                          <button className="text-slate-300 hover:text-slate-600 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Comments Section */}
                        {commentingOn === post._id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 pt-4 border-t border-slate-100"
                          >
                            <div className="flex gap-3 mb-6">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-sm font-bold text-amber-500 shrink-0 border border-slate-100">
                                {userInitial}
                              </div>
                              <div className="flex-1 flex gap-2">
                                <input
                                  type="text"
                                  value={commentContent}
                                  onChange={(e) => setCommentContent(e.target.value)}
                                  placeholder="Share your thoughts..."
                                  className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-400"
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
                                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-bold text-amber-500 shrink-0 border border-slate-100">
                                    {getAuthorInitial(comment.user?.name)}
                                  </div>
                                  <div className="bg-slate-50 rounded-3xl px-5 py-4 flex-1 border border-slate-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-1.5">
                                      <p className="text-xs font-bold text-slate-900">
                                        {comment.user?.name}
                                      </p>
                                      <p className="text-[10px] text-slate-400 font-medium">
                                        {new Date(
                                          comment.createdAt,
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">
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
          <div className="lg:col-span-4 space-y-5 hidden lg:block">

            {/* User Perspective Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 blur-2xl rounded-full" />
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-400 flex items-center justify-center text-black text-2xl font-black mb-4 shadow-lg shadow-amber-200 mx-auto transform group-hover:rotate-3 transition-transform">
                  {userInitial}
                </div>
                <h4 className="text-lg font-black text-slate-900 tracking-tight">Hello, {userName}!</h4>
                <p className="text-slate-500 font-bold text-[11px] mb-5">Aspirant Access</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-amber-500 font-black text-xl">{posts.length}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Feed</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-emerald-500 font-black text-xl">Active</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Status</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/profile")}
                  className="w-full mt-5 py-2.5 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-800 transition-all shadow-md shadow-slate-200"
                >
                  View My Profile
                </button>
              </div>
            </div>

            {/* Suggested Employees */}
            <div className="bg-gradient-to-br from-[#1a1a1a] via-[#333] to-[#444] text-white rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
              <div className="p-5 border-b border-gray-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <h5 className="text-xs font-bold text-white uppercase tracking-widest">Top Mentors</h5>
                </div>
              </div>
              <div className="p-5 space-y-5">
                {suggestedEmployees.length > 0 ? suggestedEmployees.map((emp, idx) => (
                  <div key={emp._id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-emerald-400 font-bold text-sm border border-gray-700">
                          {getAuthorInitial(emp.name)}
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-gray-800" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-white text-sm font-bold leading-none group-hover:text-emerald-400 transition-colors cursor-pointer">{emp.name}</p>
                          {idx === 0 && <span className="text-[8px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1 rounded uppercase font-black">Top</span>}
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium mt-1">
                          {emp.company?.name || "Verified Professional"}
                        </p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-400 text-xs text-center py-4">Finding mentors...</p>
                )}
              </div>
            </div>

            {/* Trending Companies */}
            {/* Trending Companies */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-500" />
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Trending Companies</h5>
              </div>
              <div className="p-5 space-y-5">
                {trendingCompanies.length > 0 ? trendingCompanies.slice(0, 2).map((company, idx) => (
                  <div key={company._id} className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate("/student/companies")}>
                    <div className="text-slate-300 font-black italic text-lg">{idx + 1}</div>
                    <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500 border border-sky-100">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900 text-sm font-bold leading-none mb-1 group-hover:text-sky-500 transition-colors">{company.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{company.industry || "Technology"} • {company.location || "Remote"}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-400 text-xs text-center py-4">Loading hiring trends...</p>
                )}
                <button
                  onClick={() => navigate("/student/companies")}
                  className="w-full mt-2 py-3 bg-sky-50 hover:bg-sky-100 text-sky-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-sky-100 transition-all"
                >
                  Browse All Companies
                </button>
              </div>
            </div>

            {/* Platform tats Small */}
            {/* Platform Stats Small */}
            <div className="bg-gradient-to-br from-[#1a1a1a] via-[#333] to-[#444] text-white border-gray-800 shadow-xl rounded-2xl p-6 border">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-5 h-5 text-amber-400 fill-current" />
                <h5 className="text-white font-black text-sm uppercase lg:tracking-wider">Join the Elite</h5>
              </div>
              <p className="text-slate-400 text-[11px] font-medium leading-relaxed mb-5">
                Connect with verified employees from top tier companies globally.
              </p>
              <button
                onClick={() => navigate("/student/companies")}
                className="w-full py-2.5 bg-white text-black text-[9px] font-black uppercase tracking-[0.15em] rounded-xl hover:bg-slate-100 transition-all shadow-sm"
              >
                Request a Referral
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

export default Feed;
