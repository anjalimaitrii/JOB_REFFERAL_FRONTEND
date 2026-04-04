import { Briefcase, Building2, Layers, Clock, BadgeCheck, X, Mail, ShieldCheck, Loader2, RefreshCcw, Building, User } from "lucide-react";
import { useState, useEffect } from "react";
import { sendOtp, verifyOtp, updateProfile } from "../../services/user.service";
import { getCompanies } from "../../services/company.service";

const JOB_TITLES = [
  "Software Engineer", "Frontend Developer", "Backend Developer", "Fullstack Developer",
  "DevOps Engineer", "Data Scientist", "Product Manager", "UI/UX Designer",
  "QA Engineer", "Mobile Developer", "Cloud Architect", "Security Engineer"
];

export const JobInformationSection = ({
  data,
  onChange,
  themeColor = "indigo",
}: {
  data: any;
  onChange: (u: any) => void;
  themeColor?: string;
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Company Search State
  const [allCompanies, setAllCompanies] = useState<any[]>([]);
  const [companySuggestions, setCompanySuggestions] = useState<any[]>([]);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [companySearch, setCompanySearch] = useState(data?.company?.name || "");

  // Job Update Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStage, setModalStage] = useState<"choice" | "email" | "otp">("choice");
  const [updateType, setUpdateType] = useState<"switch" | "unemployed">("switch");
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await getCompanies();
        console.log("Fetched companies:", res);
        // Handle both { companies: [...] } and direct array response
        const list = Array.isArray(res) ? res : (res?.companies || res?.data || []);
        console.log("Companies list:", list);
        setAllCompanies(list);
      } catch (err) {
        console.error("Failed to fetch companies", err);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (field: string, value: string) => {
    // Handle company search separately — don't call generic onChange for it
    if (field === "companyName") {
      setCompanySearch(value);
      if (value?.trim()) {
        const filtered = allCompanies.filter(c =>
          c.name?.toLowerCase().includes(value.toLowerCase())
        );
        setCompanySuggestions(filtered);
        setShowCompanySuggestions(true);
      } else {
        setCompanySuggestions([]);
        setShowCompanySuggestions(false);
      }
      return;
    }

    onChange({ ...data, [field]: value });

    if (field === "designation") {
      if (value?.trim()) {
        const filtered = JOB_TITLES.filter(title =>
          title.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  const theme = {
    bg: `bg-${themeColor}-50`,
    icon: `text-${themeColor}-600`,
    text: `text-${themeColor}-600`,
    ring: `ring-${themeColor}-50`,
    focus: `focus:border-${themeColor}-400`,
    hoverBg: `hover:bg-${themeColor}-50`,
    hoverText: `hover:text-${themeColor}-600`,
    border: `border-${themeColor}-100`
  };

  const handleSendOtp = async () => {
    if (!newEmail) return setError("Email is required");
    try {
      setLoading(true);
      setError("");

      // Now send the OTP - Backend will handle pendingEmail
      await sendOtp(newEmail);
      setModalStage("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setError("OTP is required");
    try {
      setLoading(true);
      setError("");
      await verifyOtp(newEmail, otp);

      // Successfully verified. Now we can update the profile state locally and in DB
      // Note: Backend has already updated the email and set isEmailVerified to true
      if (updateType === "unemployed") {
        // Build a clean payload for backend — remove `company` field entirely
        // so we never send null/empty string for an ObjectId reference
        const { company, companyDetails, ...rest } = data;
        const backendPayload = {
          ...rest,
          email: newEmail,
          isEmailVerified: true,
          companyName: "",
          designation: "",
          department: "",
          experienceLevel: "",
          employmentType: "",
        };
        await updateProfile(backendPayload);

        // For local UI state, also clear company so fields appear empty
        onChange({
          ...backendPayload,
          company: null,
          companyDetails: null,
        });
      } else {
        // "switch" flow — just update email
        const updatedData = {
          ...data,
          email: newEmail,
          isEmailVerified: true,
        };
        await updateProfile(updatedData);
        onChange(updatedData);
      }


      setIsModalOpen(false);
      setModalStage("choice");
      setNewEmail("");
      setOtp("");
      alert("Status updated and verified successfully!");
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 sm:gap-0">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${theme.bg} flex items-center justify-center`}>
            <Briefcase className={`w-5 h-5 ${theme.icon}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none mb-1">Job Information</h3>
            <p className="text-xs text-slate-500 font-medium leading-none">Your current vocational details</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-100 transition-all border border-rose-100 shadow-sm`}
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Left Company?
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="relative">
          <Input
            label="Current Company"
            icon={<Building2 className="w-3.5 h-3.5" />}
            value={companySearch}
            placeholder="Search company..."
            onChange={(e: any) => handleChange("companyName", e.target.value)}
            onFocus={() => {
              if (companySearch?.trim()) {
                const filtered = allCompanies.filter(c =>
                  c.name.toLowerCase().includes(companySearch.toLowerCase())
                );
                setCompanySuggestions(filtered);
                setShowCompanySuggestions(true);
              }
            }}
            onBlur={() => setTimeout(() => setShowCompanySuggestions(false), 200)}
            themeColor={themeColor}
          />
          {showCompanySuggestions && companySuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-52 overflow-y-auto p-1.5">
              {companySuggestions.map((c, idx) => (
                <div
                  key={c._id || c.id || idx}
                  onMouseDown={() => {
                    onChange({ ...data, companyName: c.name, company: c._id || c.id });
                    setCompanySearch(c.name);
                    setShowCompanySuggestions(false);
                  }}
                  className={`px-3 py-2 text-[13px] font-semibold text-slate-700 ${theme.hoverBg} ${theme.hoverText} rounded-lg cursor-pointer transition-colors flex items-center gap-2`}
                >
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {c.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <Input
            label="Designation / Role"
            icon={<BadgeCheck className="w-3.5 h-3.5" />}
            value={data?.designation || ""}
            placeholder="e.g. Senior Software Engineer"
            onChange={(e: any) => handleChange("designation", e.target.value)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onFocus={() => {
              if (data?.designation?.trim()) setShowSuggestions(true);
            }}
            themeColor={themeColor}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-52 overflow-y-auto p-1.5">
              {suggestions.map((title, idx) => (
                <div
                  key={idx}
                  onMouseDown={() => {
                    handleChange("designation", title);
                    setShowSuggestions(false);
                  }}
                  className={`px-3 py-2 text-[13px] font-semibold text-slate-700 ${theme.hoverBg} ${theme.hoverText} rounded-lg cursor-pointer transition-colors`}
                >
                  {title}
                </div>
              ))}
            </div>
          )}
        </div>

        <Input
          label="Department"
          icon={<Layers className="w-3.5 h-3.5" />}
          value={data?.department || ""}
          placeholder="e.g. Engineering"
          onChange={(e: any) => handleChange("department", e.target.value)}
          themeColor={themeColor}
        />

        <Input
          label="Total Experience (Years)"
          icon={<Clock className="w-3.5 h-3.5" />}
          value={data?.experienceLevel || ""}
          placeholder="e.g. 5"
          type="number"
          onChange={(e: any) => handleChange("experienceLevel", e.target.value)}
          themeColor={themeColor}
        />

        {/* Employment Type */}
        <div className="md:col-span-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Employment Type</p>
          <div className="flex flex-wrap gap-2">
            {["Full-time", "Part-time", "Contract", "Internship", "Freelance"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleChange("employmentType", type)}
                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all shadow-sm ${data?.employmentType === type
                  ? `bg-slate-900 text-white border-slate-800 ring-4 ${theme.ring}`
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── JOB UPDATE MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {modalStage === "choice" && (
              <div className="text-center">
                <div className={`w-12 h-12 rounded-2xl ${theme.bg} flex items-center justify-center mx-auto mb-4`}>
                  <RefreshCcw className={`w-6 h-6 ${theme.icon}`} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Update Employment Status</h4>
                <p className="text-sm text-slate-500 mb-6">Have you moved to a new company or are you currently taking a break?</p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setUpdateType("switch"); setModalStage("email"); }}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-slate-100 hover:border-${themeColor}-400 hover:bg-${themeColor}-50/30 transition-all group`}
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                      <Building className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Joined New Company</span>
                  </button>
                  <button
                    onClick={() => { setUpdateType("unemployed"); setModalStage("email"); }}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-slate-100 hover:border-rose-400 hover:bg-rose-50/30 transition-all group`}
                  >
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Currently Unemployed</span>
                  </button>
                </div>
              </div>
            )}

            {modalStage === "email" && (
              <div>
                <button
                  onClick={() => setModalStage("choice")}
                  className="mb-4 text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  ← Go Back
                </button>
                <div className="text-center mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${updateType === 'switch' ? theme.bg : 'bg-rose-50'} flex items-center justify-center mx-auto mb-4`}>
                    <Mail className={`w-6 h-6 ${updateType === 'switch' ? theme.icon : 'text-rose-600'}`} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">
                    {updateType === "switch" ? "New Company Email" : "Personal Email"}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {updateType === "switch"
                      ? "Add your new official work email to continue"
                      : "Add your personal email to keep receiving referrals"}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className={`flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus-within:bg-white transition-all shadow-sm`}>
                    <Mail className="w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="flex-1 bg-transparent outline-none text-sm font-semibold text-slate-800"
                    />
                  </div>
                  {error && <p className="text-[10px] text-rose-500 font-bold ml-1">{error}</p>}
                  <button
                    onClick={handleSendOtp}
                    disabled={loading || !newEmail}
                    className={`w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2`}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Identity"}
                  </button>
                </div>
              </div>
            )}

            {modalStage === "otp" && (
              <div>
                <button
                  onClick={() => setModalStage("email")}
                  className="mb-4 text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  ← Change Email
                </button>
                <div className="text-center mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4`}>
                    <ShieldCheck className={`w-6 h-6 text-emerald-600`} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">Verification Code</h4>
                  <p className="text-xs text-slate-500">We've sent a 6-digit OTP to <br /><span className="text-slate-900 font-bold">{newEmail}</span></p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-xl font-black tracking-[0.5em] outline-none focus:bg-white focus:border-emerald-400 transition-all shadow-sm"
                    placeholder="000000"
                  />
                  {error && <p className="text-[10px] text-rose-500 font-bold text-center">{error}</p>}
                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.length < 6}
                    className={`w-full py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2`}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Update Status"}
                  </button>
                  <button
                    onClick={handleSendOtp}
                    className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

/* ── REUSABLE INPUT ── */
const Input = ({
  label,
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
  onBlur,
  onFocus,
  themeColor = "indigo",
}: {
  label: string;
  value: string;
  onChange: (e: any) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  type?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  themeColor?: string;
}) => (
  <div className="space-y-1.5">
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</p>
    <div className={`flex items-center gap-2.5 border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white focus-within:border-${themeColor}-400 focus-within:ring-4 focus-within:ring-${themeColor}-50 transition-all shadow-sm`}>
      {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder || label}
        className="flex-1 bg-transparent outline-none text-sm font-semibold text-slate-800 placeholder-slate-300"
      />
    </div>
  </div>
);