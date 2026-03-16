import { User, Mail, Phone, Linkedin, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { sendOtp, verifyOtp } from "../../services/user.service";

export const PersonalDetailsSection = ({
  data,
  onChange,
}: {
  data: any;
  onChange: (u: any) => void;
}) => {
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleSendOtp = async () => {
    if (!data.email) return alert("Please enter an email first");
    try {
      setLoading(true);
      setError("");
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
      onChange({ ...data, isEmailVerified: true });
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Personal Information</h3>
          <p className="text-xs text-gray-400">Update your personal details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Full Name"
          icon={<User className="w-4 h-4" />}
          value={data.name || ""}
          placeholder="John Doe"
          onChange={(e: any) => handleChange("name", e.target.value)}
        />

        <div className="relative">
          <Input
            label="Email"
            icon={<Mail className="w-4 h-4" />}
            value={data.email || ""}
            placeholder="john@example.com"
            type="email"
            onChange={(e: any) => handleChange("email", e.target.value)}
          />
          <div className="absolute top-0 right-0">
            {data.isEmailVerified ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-0.5">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            ) : (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full mt-0.5 transition-colors disabled:opacity-50"
              >
                {loading && !showOtpField ? "Sending..." : "Verify Email"}
              </button>
            )}
          </div>

          {showOtpField && !data.isEmailVerified && (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300 animate-in fade-in slide-in-from-top-2">
              <p className="text-[10px] font-medium text-gray-500 mb-2">Enter 6-digit OTP sent to your email</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-gray-400"
                  placeholder="000000"
                />
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="bg-gray-900 text-white text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-800 transition shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Verify"}
                </button>
              </div>
              {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
            </div>
          )}
        </div>

        <Input
          label="Phone"
          icon={<Phone className="w-4 h-4" />}
          value={data.contact || ""}
          placeholder="+91 9876543210"
          type="tel"
          onChange={(e: any) => handleChange("contact", e.target.value)}
        />

        {/* Gender — pill toggle */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Gender</p>
          <div className="flex gap-2">
            {["male", "female", "other"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => handleChange("gender", g)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${data.gender === g
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                  }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="LinkedIn Profile"
          icon={<Linkedin className="w-4 h-4" />}
          value={data.linkedin || ""}
          placeholder="linkedin.com/in/username"
          onChange={(e: any) => handleChange("linkedin", e.target.value)}
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
}: {
  label: string;
  value: string;
  onChange: (e: any) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
}) => (
  <div>
    <p className="text-xs font-medium text-gray-500 mb-1.5">{label}</p>
    <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:bg-white focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 transition-all">
      {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
      />
    </div>
  </div>
);
