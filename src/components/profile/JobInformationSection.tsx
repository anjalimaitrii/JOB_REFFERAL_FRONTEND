import { Briefcase, Building2, Layers, Clock, BadgeCheck } from "lucide-react";
import { useState } from "react";

const JOB_TITLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager",
  "UI/UX Designer",
  "QA Engineer",
  "Mobile Developer",
  "Cloud Architect",
  "Security Engineer"
];

export const JobInformationSection = ({
  data,
  onChange,
}: {
  data: any;
  onChange: (u: any) => void;
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });

    if (field === "designation") {
      if (value.trim()) {
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
          <Briefcase className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Job Information</h3>
          <p className="text-xs text-gray-400">Your current role and work details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <Input
          label="Company Name"
          icon={<Building2 className="w-4 h-4" />}
          value={data.company || ""}
          placeholder="e.g. Google, Infosys"
          onChange={(e: any) => handleChange("company", e.target.value)}
        />

        <div className="relative">
          <Input
            label="Designation"
            icon={<BadgeCheck className="w-4 h-4" />}
            value={data.designation || ""}
            placeholder="e.g. Software Engineer"
            onChange={(e: any) => handleChange("designation", e.target.value)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onFocus={() => {
              if (data.designation?.trim()) setShowSuggestions(true);
            }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
              {suggestions.map((title, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    handleChange("designation", title);
                    setShowSuggestions(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {title}
                </div>
              ))}
            </div>
          )}
        </div>

        <Input
          label="Department"
          icon={<Layers className="w-4 h-4" />}
          value={data.department || ""}
          placeholder="e.g. Engineering, HR, Finance"
          onChange={(e: any) => handleChange("department", e.target.value)}
        />

        <Input
          label="Experience (Years)"
          icon={<Clock className="w-4 h-4" />}
          value={data.experienceLevel || ""}
          placeholder="e.g. 3"
          type="number"
          onChange={(e: any) => handleChange("experienceLevel", e.target.value)}
        />

        {/* Employment Type — pill toggle */}
        <div className="md:col-span-2">
          <p className="text-xs font-medium text-gray-500 mb-2">Employment Type</p>
          <div className="flex flex-wrap gap-2">
            {["Full-time", "Part-time", "Contract", "Internship", "Freelance"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleChange("employmentType", type)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${data.employmentType === type
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

      </div>
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
  onFocus
}: {
  label: string;
  value: string;
  onChange: (e: any) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  type?: string;
  onBlur?: () => void;
  onFocus?: () => void;
}) => (
  <div>
    <p className="text-xs font-medium text-gray-500 mb-1.5">{label}</p>
    <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:bg-white focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 transition-all">
      {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder || label}
        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
      />
    </div>
  </div>
);