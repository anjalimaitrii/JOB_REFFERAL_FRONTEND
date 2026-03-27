import { Sparkles, Check, X } from "lucide-react";

const ROLES = [
  { label: "Frontend Developer",     emoji: "🎨" },
  { label: "Backend Developer",      emoji: "⚙️" },
  { label: "Full Stack Developer",   emoji: "🧩" },
  { label: "MERN Stack Developer",   emoji: "🟢" },
  { label: "Java Developer",         emoji: "☕" },
  { label: "DevOps Engineer",        emoji: "🔧" },
  { label: "Data Scientist",         emoji: "📊" },
  { label: "UI/UX Designer",        emoji: "✏️" },
  { label: "Mobile Developer",       emoji: "📱" },
  { label: "Cloud Engineer",         emoji: "☁️" },
];

export const InterestSection = ({
  interests,
  onChange,
  themeColor = "indigo",
}: {
  interests: string[];
  onChange: (roles: string[]) => void;
  themeColor?: string;
}) => {
  const toggleRole = (role: string) => {
    onChange(
      interests.includes(role)
        ? interests.filter((r) => r !== role)
        : [...interests, role]
    );
  };

  const theme = {
    bg: `bg-${themeColor}-50`,
    icon: `text-${themeColor}-600`,
    text: `text-${themeColor}-600`,
    ring: `ring-${themeColor}-50`,
    border: `border-${themeColor}-100`,
    badge: `bg-${themeColor}-50 text-${themeColor}-600 border-${themeColor}-100`
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${theme.bg} flex items-center justify-center`}>
            <Sparkles className={`w-5 h-5 ${theme.icon}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none mb-1">Preferred Roles</h3>
            <p className="text-xs text-slate-500 font-medium">Select target referral positions</p>
          </div>
        </div>

        {interests.length > 0 && (
          <span className="text-[9px] font-bold bg-slate-900 text-white px-3 py-1 rounded-full shadow-md uppercase tracking-widest">
            {interests.length} selected
          </span>
        )}
      </div>

      {/* Role pills */}
      <div className="flex flex-wrap gap-2.5">
        {ROLES.map(({ label, emoji }) => {
          const isSelected = interests.includes(label);
          return (
            <button
              key={label}
              type="button"
              onClick={() => toggleRole(label)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                isSelected
                  ? `bg-slate-900 text-white border-slate-800 shadow-lg shadow-slate-100 ring-4 ${theme.ring}`
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 shadow-sm"
              }`}
            >
              <span className="text-base transition-all">{emoji}</span>
              {label}
              {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Selected summary */}
      {interests.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 ml-1">Current Preferences</p>
          <div className="flex flex-wrap gap-2">
            {interests.map((role) => (
              <span
                key={role}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 text-slate-700 text-[11px] font-bold rounded-lg shadow-sm"
              >
                {role}
                <button
                  onClick={() => toggleRole(role)}
                  className="text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};