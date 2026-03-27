import { User, Mail, Phone, Linkedin, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { sendOtp, verifyOtp, updateProfile } from "../../services/user.service";

export const PersonalDetailsSection = ({
  data,
  onChange,
  themeColor = "indigo",
}: {
  data: any;
  onChange: (u: any) => void;
  themeColor?: string;
}) => {
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const theme = {
    bg: `bg-${themeColor}-50`,
    icon: `text-${themeColor}-600`,
    text: `text-${themeColor}-600`,
    border: `border-${themeColor}-100`,
    ring: `ring-${themeColor}-50`,
    focus: `focus:border-${themeColor}-400`,
    badge: `bg-${themeColor}-50 text-${themeColor}-600 border-${themeColor}-100`
  };

  const handleSendOtp = async () => {
    if (!data.email) return alert("Please enter an email first");
    try {
      setLoading(true);
      setError("");
      
      // Save new email to DB first so OTP service works for new addresses
      await updateProfile({ ...data, isEmailVerified: false });
      
      await sendOtp(data.email);
      setShowOtpField(true);
      alert("OTP sent to your email!");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Please enter the OTP");
    try {
      setLoading(true);
      setError("");
      await verifyOtp(data.email, otp);
      
      // Mark as verified in DB
      const verifiedData = { ...data, isEmailVerified: true };
      await updateProfile(verifiedData);
      onChange(verifiedData);
      
      setShowOtpField(false);
      setOtp("");
      alert("Email verified successfully!");
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl ${theme.bg} flex items-center justify-center`}>
          <User className={`w-5 h-5 ${theme.icon}`} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Personal Details</h3>
          <p className="text-xs text-slate-500 font-medium leading-none">Manage your primary identity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Full Name"
          icon={<User className="w-3.5 h-3.5" />}
          value={data.name || ""}
          placeholder="Anjali Jangid"
          onChange={(e: any) => handleChange("name", e.target.value)}
          themeColor={themeColor}
        />

        <div className="relative">
          <Input
            label="Email Address"
            icon={<Mail className="w-3.5 h-3.5" />}
            value={data.email || ""}
            placeholder="anjiali@example.com"
            type="email"
            onChange={(e: any) => handleChange("email", e.target.value)}
            themeColor={themeColor}
          />
          <div className="absolute top-0 right-0">
            {data.isEmailVerified ? (
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full mt-1 border border-emerald-100 shadow-sm">
                <ShieldCheck className="w-2.5 h-2.5" /> Verified
              </span>
            ) : (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className={`text-[9px] font-bold ${theme.text} hover:opacity-80 ${theme.bg} px-2.5 py-1 rounded-full mt-1 transition-all border ${theme.border} shadow-sm disabled:opacity-50`}
              >
                {loading && !showOtpField ? "Sending..." : "Verify"}
              </button>
            )}
          </div>

          {showOtpField && !data.isEmailVerified && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 animate-in fade-in slide-in-from-top-2">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">6-digit OTP</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={`w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none ${theme.focus} focus:ring-4 ${theme.ring} transition-all shadow-sm`}
                  placeholder="000000"
                />
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-800 transition-all shadow-md"
                >
                  {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Sync"}
                </button>
              </div>
              {error && <p className="text-[9px] text-rose-500 font-bold mt-2 ml-1">{error}</p>}
            </div>
          )}
        </div>

        <Input
          label="Phone Number"
          icon={<Phone className="w-3.5 h-3.5" />}
          value={data.contact || ""}
          placeholder="+91 9876543210"
          type="tel"
          onChange={(e: any) => handleChange("contact", e.target.value)}
          themeColor={themeColor}
        />

        {/* Gender — pill toggle */}
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Gender</p>
          <div className="flex gap-2">
            {["male", "female", "other"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => handleChange("gender", g)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all capitalize shadow-sm ${data.gender === g
                  ? `bg-slate-900 text-white border-slate-800 ring-4 ${theme.ring}`
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="LinkedIn Profile"
          icon={<Linkedin className="w-3.5 h-3.5" />}
          value={data.linkedin || ""}
          placeholder="linkedin.com/in/username"
          onChange={(e: any) => handleChange("linkedin", e.target.value)}
          themeColor={themeColor}
        />
      </div>
    </div>
  );
};

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  themeColor = "indigo",
}: {
  label: string;
  value: string;
  onChange: (e: any) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  themeColor?: string;
}) => (
  <div>
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">{label}</p>
    <div className={`flex items-center gap-2.5 border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 focus-within:bg-white focus-within:border-${themeColor}-400 focus-within:ring-4 focus-within:ring-${themeColor}-50 transition-all shadow-sm`}>
      {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        className="flex-1 bg-transparent outline-none text-sm font-semibold text-slate-800 placeholder-slate-300"
      />
    </div>
  </div>
);
