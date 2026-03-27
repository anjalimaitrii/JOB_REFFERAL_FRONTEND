import { useEffect, useState } from "react";
import { getColleges } from "../../services/college.service";
import { GraduationCap, Plus, Trash2, Search, ChevronDown, Loader2 } from "lucide-react";

export const EducationSection = ({
  education = [],
  onChange,
  themeColor = "indigo",
}: {
  education?: any[];
  onChange: (edu: any[]) => void;
  themeColor?: string;
}) => {

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addEducation = () => {
    onChange([...education, { level: "", institute: "", board: "", subject: "", grade: "", year: "" }]);
  };

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  const shouldShowSubject = (level: string) =>
    ["12th", "Diploma", "Graduation", "Post Graduation", "PhD"].includes(level);

  const getSubjectLabel = (level: string) => {
    if (level === "12th") return "Stream";
    if (level === "Graduation" || level === "Post Graduation") return "Specialization / Major";
    return "Specialization";
  };

  /* ── COLLEGE SEARCH ── */
  const [colleges, setColleges] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const data = await getColleges(search);
        setColleges(data || []);
      } catch {
        console.error("Failed to fetch colleges");
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchColleges, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const LEVELS = ["10th", "12th", "Diploma", "Graduation", "Post Graduation", "PhD"];

  const theme = {
    bg: `bg-${themeColor}-50`,
    icon: `text-${themeColor}-600`,
    text: `text-${themeColor}-600`,
    border: `border-${themeColor}-100`,
    ring: `ring-${themeColor}-50`,
    focus: `focus:border-${themeColor}-400`,
    hoverBg: `hover:bg-${themeColor}-50`,
    hoverText: `hover:text-${themeColor}-600`
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 sm:gap-0">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${theme.bg} flex items-center justify-center`}>
            <GraduationCap className={`w-5 h-5 ${theme.icon}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none mb-1">Academic History</h3>
            <p className="text-xs text-slate-500 font-medium">Your educational milestones</p>
          </div>
        </div>
        <button
          onClick={addEducation}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 active:scale-95 transition-all shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Qualification
        </button>
      </div>

      {/* Empty state */}
      {education.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/20">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-50 flex items-center justify-center mx-auto mb-3">
            <GraduationCap className={`w-6 h-6 text-slate-200`} />
          </div>
          <p className="text-xs text-slate-400 font-bold mb-3">No records found</p>
          <button
            onClick={addEducation}
            className={`text-[11px] font-bold ${theme.text} ${theme.bg} px-5 py-2 rounded-lg hover:brightness-95 transition-all shadow-sm`}
          >
            + Add First Entry
          </button>
        </div>
      )}

      {/* Education cards */}
      <div className="space-y-5">
        {education.map((edu, index) => (
          <div key={index} className="group border border-slate-100 rounded-2xl p-5 bg-slate-50/50 relative hover:border-slate-200 transition-all">
            
            {/* Card top */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center`}>
                  {index + 1}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Qualification #{index + 1}
                </span>
              </div>
              <button
                onClick={() => removeEducation(index)}
                className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500 hover:text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg transition-all border border-rose-100 opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-2.5 h-2.5" />
                Remove
              </button>
            </div>

            {/* Level select */}
            <div className="mb-5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Level</p>
              <div className="relative">
                <select
                  value={edu.level}
                  onChange={(e) => handleChange(index, "level", e.target.value)}
                  className={`w-full appearance-none px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white text-sm font-semibold text-slate-700 outline-none ${theme.focus} focus:ring-4 ${theme.ring} transition-all cursor-pointer shadow-sm`}
                >
                  <option value="">— Select Qualification —</option>
                  {LEVELS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* College Search */}
              <div className="relative md:col-span-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">University / Institute</p>
                <div className={`flex items-center gap-3 border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white focus-within:border-${themeColor}-400 focus-within:ring-4 focus-within:ring-${themeColor}-50 transition-all shadow-sm`}>
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    value={edu.institute || search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      handleChange(index, "institute", e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    placeholder="Search college name..."
                    className="flex-1 bg-transparent outline-none text-sm font-semibold text-slate-800 placeholder-slate-400"
                  />
                  {loading && (
                    <Loader2 className={`w-3.5 h-3.5 ${theme.icon} animate-spin shrink-0`} />
                  )}
                </div>

                {/* Dropdown */}
                {showDropdown && colleges.length > 0 && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl max-h-52 overflow-y-auto z-50 p-1.5">
                    {colleges.map((c) => (
                      <div
                        key={c._id}
                        onMouseDown={() => {
                          handleChange(index, "institute", c.name);
                          setSearch(c.name);
                          setShowDropdown(false);
                        }}
                        className={`px-3 py-2 text-[13px] font-semibold text-slate-700 ${theme.hoverBg} ${theme.hoverText} rounded-lg cursor-pointer transition-colors`}
                      >
                        {c.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Input
                label="Course / Board"
                value={edu.board}
                placeholder="e.g. B.Tech (Computer Science)"
                onChange={(e: any) => handleChange(index, "board", e.target.value)}
                themeColor={themeColor}
              />

              {shouldShowSubject(edu.level) && (
                <Input
                  label={getSubjectLabel(edu.level)}
                  value={edu.subject}
                  placeholder="e.g. Artificial Intelligence"
                  onChange={(e: any) => handleChange(index, "subject", e.target.value)}
                  themeColor={themeColor}
                />
              )}

              <Input
                label="Final Score"
                value={edu.grade}
                placeholder="e.g. 9.5 CGPA"
                onChange={(e: any) => handleChange(index, "grade", e.target.value)}
                themeColor={themeColor}
              />

              <Input
                label="Batch Year"
                value={edu.year}
                placeholder="e.g. 2025"
                onChange={(e: any) => handleChange(index, "year", e.target.value)}
                themeColor={themeColor}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── REUSABLE INPUT ── */
const Input = ({ label, value, onChange, placeholder, themeColor = "indigo" }: any) => (
  <div className="space-y-1.5">
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</p>
    <div className={`flex items-center gap-3 border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white focus-within:border-${themeColor}-400 focus-within:ring-4 focus-within:ring-${themeColor}-50 transition-all shadow-sm`}>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        className="w-full bg-transparent outline-none text-sm font-semibold text-slate-800 placeholder-slate-300"
      />
    </div>
  </div>
);