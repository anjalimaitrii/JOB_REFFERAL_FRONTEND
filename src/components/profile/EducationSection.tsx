import { useEffect, useState } from "react";
import { getColleges } from "../../services/college.service";
import { GraduationCap, Plus, Trash2, Search, ChevronDown } from "lucide-react";

export const EducationSection = ({
  education = [],
  onChange,
}: {
  education?: any[];
  onChange: (edu: any[]) => void;
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Education</h3>
            <p className="text-xs text-gray-400">Add your academic qualifications</p>
          </div>
        </div>
        <button
          onClick={addEducation}
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      {/* Empty state */}
      {education.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
          <GraduationCap className="w-8 h-8 text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No education added yet.</p>
          <button
            onClick={addEducation}
            className="mt-3 text-sm text-gray-600 font-medium hover:text-black underline underline-offset-2 transition"
          >
            + Add your first qualification
          </button>
        </div>
      )}

      {/* Education cards */}
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50 relative">

            {/* Card top: level badge + remove */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Education {index + 1}
              </span>
              <button
                onClick={() => removeEducation(index)}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>

            {/* Level select */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-1.5">Education Level</p>
              <div className="relative">
                <select
                  value={edu.level}
                  onChange={(e) => handleChange(index, "level", e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all cursor-pointer"
                >
                  <option value="">— Select Level —</option>
                  {LEVELS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* College Search */}
              <div className="relative md:col-span-2">
                <p className="text-xs font-medium text-gray-500 mb-1.5">School / University</p>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 transition-all">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    value={edu.institute || search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      handleChange(index, "institute", e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    placeholder="Search college / school..."
                    className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                  />
                  {loading && (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin shrink-0" />
                  )}
                </div>

                {/* Dropdown */}
                {showDropdown && colleges.length > 0 && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-20">
                    {colleges.map((c) => (
                      <div
                        key={c._id}
                        onMouseDown={() => {
                          handleChange(index, "institute", c.name);
                          setSearch(c.name);
                          setShowDropdown(false);
                        }}
                        className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-b last:border-0 border-gray-50"
                      >
                        {c.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Input
                label="Board / Degree"
                value={edu.board}
                placeholder="e.g. CBSE / B.Tech / MBA"
                onChange={(e: any) => handleChange(index, "board", e.target.value)}
              />

              {shouldShowSubject(edu.level) && (
                <Input
                  label={getSubjectLabel(edu.level)}
                  value={edu.subject}
                  placeholder="e.g. Science / Computer Science"
                  onChange={(e: any) => handleChange(index, "subject", e.target.value)}
                />
              )}

              <Input
                label="Grade / Percentage"
                value={edu.grade}
                placeholder="e.g. 8.5 CGPA / 85%"
                onChange={(e: any) => handleChange(index, "grade", e.target.value)}
              />

              <Input
                label="Passing Year"
                value={edu.year}
                placeholder="e.g. 2024"
                onChange={(e: any) => handleChange(index, "year", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── REUSABLE INPUT ── */
const Input = ({ label, value, onChange, placeholder }: any) => (
  <div>
    <p className="text-xs font-medium text-gray-500 mb-1.5">{label}</p>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder || label}
      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
    />
  </div>
);