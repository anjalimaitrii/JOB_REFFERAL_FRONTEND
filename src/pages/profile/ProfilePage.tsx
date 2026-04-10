import { useEffect, useRef, useState } from "react";
import { getProfile, updateProfile } from "../../services/user.service";
import { PersonalDetailsSection } from "../../components/profile/PersonalDetailsSection";
import { EducationSection } from "../../components/profile/EducationSection";
import { JobInformationSection } from "../../components/profile/JobInformationSection";
import { InterestSection } from "../../components/profile/InterestsSection";
import { Experience } from "../../components/profile/ExperienceSection";
import { Skills } from "../../components/profile/SkillsSection";
import { Projects } from "../../components/profile/ProjectsSection";
import {
  Camera, Save, User, GraduationCap, Briefcase,
  Sparkles, Clock, Code2, FolderGit2, CheckCircle2, Loader2,
  LogOut, Wallet, Menu, Puzzle
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const STUDENT_TABS = [
  { key: "Personal Information", icon: User },
  { key: "Education", icon: GraduationCap },
  { key: "Skills", icon: Code2 },
  { key: "Experience", icon: Clock },
  { key: "Projects", icon: FolderGit2 },
];

const EMPLOYEE_TABS = [
  { key: "Personal Information", icon: User },
  { key: "Education", icon: GraduationCap },
  { key: "Job Information", icon: Briefcase },
  { key: "Interest", icon: Sparkles },
  { key: "Experience", icon: Clock },
  { key: "Skills", icon: Code2 },
  { key: "Projects", icon: FolderGit2 },
];

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("Personal Information");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setUser(data);
    } catch (err) {
      console.error("Profile fetch failed", err);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      // Strip out company/companyDetails if null/empty so we never send invalid ObjectId
      const { company, companyDetails, ...rest } = user;
      const payload = { ...rest };
      if (company && typeof company === "object" && company._id) {
        // company is a populated object from backend — send just the _id
        payload.company = company._id;
      } else if (company && typeof company === "string" && company.length > 0) {
        // company is already a raw ObjectId string
        payload.company = company;
      }
      // If company is null/undefined/"" — don't include it in payload at all

      const res = await updateProfile(payload);
      if (res.user) {
        setUser(res.user);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    setUser((prev: any) => ({ ...prev, profilePhoto: blobUrl }));

    const formData = new FormData();
    formData.append("profilePhoto", file);
    try {
      setLoading(true);
      const res = await updateProfile(formData);
      if (res.user) {
        setUser(res.user);
      }
    } catch {
      alert("Profile photo update failed");
      fetchProfile();
    } finally {
      setLoading(false);
      e.target.value = "";
      URL.revokeObjectURL(blobUrl);
    }
  };

  const calcCompletion = () => {
    if (!user) return 0;
    const requiredFields = [
      user.name, user.email, user.contact, user.gender, user.linkedin,
      user.designation, user.department, user.experienceLevel, user.employmentType,
      user.education?.length > 0, user.experience?.length > 0,
      user.skills?.length > 0, user.projects?.length > 0
    ];
    const filled = requiredFields.filter(f => !!f).length;
    return Math.round((filled / requiredFields.length) * 100);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-slate-800 animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  // const isStudentMode = user.role === "employee" && location.pathname.includes("/student");
  const effectiveRole = user.role;
  const TABS = effectiveRole === "student" ? STUDENT_TABS : EMPLOYEE_TABS;
  const completionPercent = calcCompletion();

  // Theme configuration based on role
  const theme = effectiveRole === "student"
    ? { primary: "amber", gradient: "from-amber-400 to-orange-500", text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", shadow: "shadow-amber-100" }
    : { primary: "indigo", gradient: "from-indigo-600 to-violet-700", text: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", shadow: "shadow-indigo-100" };

  const themeColor = theme.primary;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">

      {/* ── SIDEBAR OVERLAY (Mobile) ── */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">

          <div
            className="p-5 flex items-center gap-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => navigate(effectiveRole === "student" ? "/student/dashboard" : "/employee/dashboard")}
          >
            <div className={`w-9 h-9 bg-gradient-to-br ${theme.gradient} rounded-lg flex items-center justify-center text-white shadow-lg ${theme.shadow}`}>
              <Puzzle className="w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold text-slate-900 tracking-tight italic">Referral Portal</span>
          </div>

          <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5">

            {/* Profile Card */}
            <div className={`bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden shadow-sm ${theme.shadow}`}>
              <div className={`absolute top-0 right-0 w-20 h-20 ${theme.bg} rounded-full -mr-10 -mt-10 opacity-40 blur-3xl`} />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-3 group">
                  <div className={`w-20 h-20 rounded-full border-2 ${theme.border} overflow-hidden shadow-inner bg-slate-50 flex items-center justify-center`}>
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <User className="w-10 h-10 text-slate-300" />
                    )}
                  </div>
                  <button
                    onClick={() => setActiveTab("Personal Information")}
                    className="absolute bottom-0 right-0 p-1.5 bg-slate-900 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity border-2 border-white"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h3 className="font-bold text-base text-slate-900 leading-tight tracking-tight">{user.name}</h3>
                <p className={`text-[9px] ${theme.text} font-bold mt-1 uppercase tracking-[0.2em]`}>
                  {user.designation || effectiveRole}
                </p>

                {user.wallet !== undefined && (
                  <div className={`mt-4 inline-flex items-center gap-2 ${theme.bg} ${theme.text} px-4 py-2 rounded-xl text-[10px] font-bold border ${theme.border} transition-all hover:bg-white shadow-sm`}>
                    <Wallet className="w-3.5 h-3.5" />
                    ₹{parseFloat(user.wallet).toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="space-y-0.5">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-3">Menu</p>
              {TABS.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => { setActiveTab(key); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 group ${activeTab === key
                    ? `bg-gradient-to-br from-[#1a1a1a] via-[#333] to-[#444] text-white border-gray-800 shadow-xl p-6 rounded-[2rem] border  shadow-slate-200`
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg transition-colors ${activeTab === key
                      ? `bg-white/10`
                      : "bg-slate-50 group-hover:bg-white border border-transparent group-hover:border-slate-100"
                      }`}>
                      <Icon className={`w-3.5 h-3.5 ${activeTab === key ? "text-white" : `group-hover:text-${theme.primary}-600`}`} />
                    </div>
                    {key}
                  </div>
                  {activeTab === key && (
                    <div className={`w-1 h-1 rounded-full bg-${theme.primary}-400 animate-pulse`} />
                  )}
                </button>
              ))}
            </div>

            {/* Profile Health */}
            <div className="pt-1">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3">
                <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="20" cy="20" r="16" className="stroke-slate-200 fill-none" strokeWidth="3" />
                    <circle cx="20" cy="20" r="16" className={`stroke-${theme.primary}-500 fill-none transition-all duration-1000`} strokeWidth="3" strokeDasharray={`${2 * Math.PI * 16}`} strokeDashoffset={`${2 * Math.PI * 16 * (1 - completionPercent / 100)}`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-[9px] font-bold text-slate-700">{completionPercent}%</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-800 uppercase tracking-tight leading-none mb-1">Stability Score</p>
                  <p className="text-[9px] text-slate-500 font-semibold leading-tight">Increase your referral odds</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-slate-100">
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-[13px] font-bold hover:bg-rose-100 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 min-w-0 relative">

        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-5 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">{activeTab}</h2>
              <div className="flex items-center gap-1.5">
                <span className={`w-1 h-1 rounded-full bg-${theme.primary}-500`} />
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Profile Configuration</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 ${saved
                ? "bg-emerald-500 text-white shadow-emerald-50"
                : `bg-gradient-to-br from-[#1a1a1a] via-[#333] to-[#444] text-white border-gray-800 shadow-xl p-6 rounded-[2rem]  hover:bg-slate-800 shadow-slate-100`
                }`}
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : saved ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {loading ? "Saving..." : saved ? "Synced" : "Sync Profile"}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-5 max-w-4xl mx-auto space-y-5">

          {/* Profile Photo Section (Integrated) */}
          {activeTab === "Personal Information" && (
            <div className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-${theme.primary}-50/20 to-transparent`}>
              <div className="relative group">
                <div className={`w-28 h-28 rounded-2xl border-2 border-dashed ${theme.border} overflow-hidden bg-white relative`}>
                  {user.profilePhoto ? (
                    <img src={user.profilePhoto} className="w-full h-full object-cover" alt="Avatar" />
                  ) : (
                    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                      <User className="w-12 h-12 text-slate-200" />
                    </div>
                  )}
                  {loading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                      <Loader2 className={`w-6 h-6 text-${theme.primary}-600 animate-spin`} />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-2 bg-gradient-to-br from-[#1a1a1a] via-[#333] to-[#444] text-white border-gray-800 shadow-xl  rounded-[2rem] border hover:scale-110 active:scale-95 transition-all "
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className={`px-2.5 py-1 ${theme.bg} ${theme.text} rounded-lg text-[9px] font-bold uppercase tracking-widest mb-2 inline-block shadow-sm`}>Identity Image</span>
                <h4 className="font-bold text-slate-900 text-lg tracking-tight mb-1">Visualization</h4>
                <p className="text-xs text-slate-500 font-medium mb-4 max-w-sm">Help professionals identify you to build trust within the portal.</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2.5">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`bg-gradient-to-br from-[#1a1a1a] via-[#333] to-[#444] text-white border-gray-800 shadow-xl text-[11px] font-bold px-4 py-2 rounded-lg hover:bg-slate-800 transition-all active:scale-95`}
                  >
                    Upload New
                  </button>

                </div>
              </div>
            </div>
          )}

          {/* Render Active Section */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "Personal Information" && (
              <PersonalDetailsSection data={user} onChange={setUser} themeColor={themeColor} />
            )}
            {activeTab === "Education" && (
              <EducationSection
                education={user.education || []}
                onChange={(education) => setUser({ ...user, education })}
                themeColor={themeColor}
              />
            )}
            {effectiveRole === "employee" && activeTab === "Job Information" && (
              <JobInformationSection data={user} onChange={setUser} themeColor={themeColor} />
            )}
            {effectiveRole === "employee" && activeTab === "Interest" && (
              <InterestSection
                interests={user.interests || []}
                onChange={(interests) => setUser({ ...user, interests })}
                themeColor={themeColor}
              />
            )}
            {activeTab === "Experience" && (
              <Experience
                data={user.experience || []}
                onChange={(experience) => setUser({ ...user, experience })}
                themeColor={themeColor}
              />
            )}
            {activeTab === "Skills" && (
              <Skills
                data={user.skills || []}
                onChange={(skills) => setUser({ ...user, skills })}
                themeColor={themeColor}
              />
            )}
            {activeTab === "Projects" && (
              <Projects
                data={user.projects || []}
                onChange={(projects) => setUser({ ...user, projects })}
                themeColor={themeColor}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;