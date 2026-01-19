import { useEffect, useRef, useState } from "react";
import { getProfile, updateProfile } from "../../services/user.service";
import { PersonalDetailsSection } from "../../components/profile/PersonalDetailsSection";
import { EducationSection } from "../../components/profile/EducationSection";
import { JobInformationSection } from "../../components/profile/JobInformationSection";
import { InterestSection } from "../../components/profile/InterestsSection";
import { Experience } from "../../components/profile/ExperienceSection";
import { Skills } from "../../components/profile/SkillsSection";
import { Projects } from "../../components/profile/ProjectsSection";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PROFILE_TABS: Record<string, string[]> = {
  student: ["Personal Information", "Education", "Skills", "Projects"],
  employee: [
    "Personal Information",
    "Education",
    "Job Information",
    "Interest",
    "Experience",
    "Skills",
  ],
};

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Personal Information");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

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
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Profile update failed", err);
      alert("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setUser((prev: any) => ({
      ...prev,
      profilePhoto: preview,
    }));

    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      setLoading(true);
      await updateProfile(formData);
    } catch (err) {
      console.error("Photo update failed", err);
      alert("Profile photo update failed");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  const TABS = PROFILE_TABS[user.role] || [];

  return (
    <div className="bg-slate-100 min-h-screen p-8 space-y-6">
      <div className="relative rounded-2xl shadow overflow-hidden">
        <button
          onClick={() =>
            navigate(
              user.role === "student"
                ? "/student/dashboard"
                : "/employee/dashboard"
            )
          }
          className="absolute top-4 left-4 z-20 bg-black/60 text-white p-2 rounded-full hover:bg-black transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519681393784-d120267933ba')",
          }}
        />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 px-6 pt-40 pb-6 flex items-center gap-6">
          <div className="relative">
            <img
              src={user.profilePhoto || "/avatar.png"}
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-black text-white p-1.5 rounded-full hover:bg-gray-800"
            >
              ✏️
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          <div className="text-white">
            <h2 className="text-xl font-semibold">{user.name}</h2>

            {user.role === "employee" && (
              <>
                <p className="text-sm text-white/80">
                  {user.designation || "—"}
                </p>
                <p className="text-xs text-white/60">{user.company || "—"}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="-mt-4 relative z-20 px-4">
        <div className="bg-white rounded-xl shadow px-4 py-2 flex gap-2 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition
                ${
                  activeTab === tab
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-6">
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

      <div className="flex justify-end">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
