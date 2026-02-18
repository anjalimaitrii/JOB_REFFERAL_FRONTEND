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
  ArrowLeft, Camera, Save, User, GraduationCap, Briefcase,
  Sparkles, Clock, Code2, FolderGit2, CheckCircle2, Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const STUDENT_TABS = [
  { key: "Personal Information", icon: User },
  { key: "Education",            icon: GraduationCap },
  { key: "Skills",               icon: Code2 },
  { key: "Projects",             icon: FolderGit2 },
];

const EMPLOYEE_TABS = [
  { key: "Personal Information", icon: User },
  { key: "Education",            icon: GraduationCap },
  { key: "Job Information",      icon: Briefcase },
  { key: "Interest",             icon: Sparkles },
  { key: "Experience",           icon: Clock },
  { key: "Skills",               icon: Code2 },
];

const Profile = () => {
  const [user, setUser]           = useState<any>(null);
  const [loading, setLoading]     = useState(false);
  const [saved, setSaved]         = useState(false);
  const [activeTab, setActiveTab] = useState("Personal Information");
  const fileInputRef              = useRef<HTMLInputElement | null>(null);
  const navigate                  = useNavigate();

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
      await updateProfile(user);
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
    setUser((prev: any) => ({ ...prev, profilePhoto: URL.createObjectURL(file) }));
    const formData = new FormData();
    formData.append("profilePhoto", file);
    try {
      setLoading(true);
      await updateProfile(formData);
    } catch {
      alert("Profile photo update failed");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  const TABS = user.role === "student" ? STUDENT_TABS : EMPLOYEE_TABS;

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ── COVER + AVATAR ── */}
      <div className="relative h-52 sm:h-64 overflow-hidden">
        {/* Cover image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1600&auto=format&fit=crop&q=80')" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />

        {/* Back button */}
        <button
          onClick={() => navigate(user.role === "student" ? "/student/dashboard" : "/employee/dashboard")}
          className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-2 rounded-full hover:bg-black/70 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        {/* Role badge */}
        <div className="absolute top-4 right-4 z-20">
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30 capitalize">
            {user.role}
          </span>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Avatar row — overlaps cover */}
        <div className="relative -mt-14 mb-6 flex items-end justify-between">
          {/* Avatar */}
          <div className="relative">
            <img
              src={user.profilePhoto || "/avatar.png"}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white object-cover shadow-xl"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-gray-700 transition shadow-md"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </div>

          {/* Save button */}
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95 ${
              saved
                ? "bg-green-500 text-white"
                : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? "Saving..." : saved ? "Saved!" : "Save Profile"}
          </button>
        </div>

        {/* Name + role */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          {user.role === "employee" && (
            <p className="text-sm text-gray-500 mt-0.5">
              {user.designation || "—"}
              {user.company ? <span className="text-gray-400"> · {user.company}</span> : ""}
            </p>
          )}
        </div>

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div className="flex gap-6 pb-12">

          {/* LEFT: sticky tab sidebar */}
          <div className="hidden md:block w-52 shrink-0">
            <div className="sticky top-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-2 space-y-1">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 py-2">
                Sections
              </p>
              {TABS.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    activeTab === key
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile: horizontal tab scroll */}
          <div className="md:hidden w-full mb-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex gap-1 overflow-x-auto">
              {TABS.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeTab === key
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: content */}
          <div className="flex-1 min-w-0 space-y-4">
            {activeTab === "Personal Information" && (
              <PersonalDetailsSection data={user} onChange={setUser} />
            )}
            {activeTab === "Education" && (
              <EducationSection
                education={user.education || []}
                onChange={(education) => setUser({ ...user, education })}
              />
            )}
            {user.role === "employee" && activeTab === "Job Information" && (
              <JobInformationSection data={user} onChange={setUser} />
            )}
            {user.role === "employee" && activeTab === "Interest" && (
              <InterestSection
                interests={user.interests || []}
                onChange={(interests) => setUser({ ...user, interests })}
              />
            )}
            {user.role === "employee" && activeTab === "Experience" && (
              <Experience
                data={user.experience || []}
                onChange={(experience) => setUser({ ...user, experience })}
              />
            )}
            {activeTab === "Skills" && (
              <Skills
                data={user.skills || []}
                onChange={(skills) => setUser({ ...user, skills })}
              />
            )}
            {activeTab === "Projects" && (
              <Projects
                data={user.projects || []}
                onChange={(projects) => setUser({ ...user, projects })}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;