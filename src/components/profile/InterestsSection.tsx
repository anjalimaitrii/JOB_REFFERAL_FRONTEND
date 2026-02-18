import { Sparkles, Check } from "lucide-react";

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
}: {
  interests: string[];
  onChange: (roles: string[]) => void;
}) => {
  const toggleRole = (role: string) => {
    onChange(
      interests.includes(role)
        ? interests.filter((r) => r !== role)
        : [...interests, role]
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Interested Roles</h3>
            <p className="text-xs text-gray-400">Select roles you want to be referred for</p>
          </div>
        </div>

        {interests.length > 0 && (
          <span className="text-xs font-semibold bg-gray-900 text-white px-2.5 py-1 rounded-full">
            {interests.length} selected
          </span>
        )}
      </div>

      {/* Role pills */}
      <div className="flex flex-wrap gap-2">
        {ROLES.map(({ label, emoji }) => {
          const isSelected = interests.includes(label);
          return (
            <button
              key={label}
              type="button"
              onClick={() => toggleRole(label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all active:scale-95 ${
                isSelected
                  ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900"
              }`}
            >
              <span>{emoji}</span>
              {label}
              {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Selected summary */}
      {interests.length > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2 font-medium">Your selections</p>
          <div className="flex flex-wrap gap-2">
            {interests.map((role) => (
              <span
                key={role}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-100 text-gray-700 text-xs rounded-full"
              >
                {role}
                <button
                  onClick={() => toggleRole(role)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};