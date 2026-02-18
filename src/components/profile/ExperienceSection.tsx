import { Briefcase, Building2, MapPin, Calendar, BadgeCheck, Plus, Trash2 } from "lucide-react";

export const Experience = ({
  data = [],
  onChange,
}: {
  data?: any[];
  onChange: (u: any[]) => void;
}) => {
  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addExperience = () => {
    onChange([...data, { company: "", role: "", location: "", duration: "" }]);
  };

  const removeExperience = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Experience</h3>
            <p className="text-xs text-gray-400">Add your work history</p>
          </div>
        </div>

        <button
          onClick={addExperience}
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
          <Briefcase className="w-8 h-8 text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No experience added yet.</p>
          <button
            onClick={addExperience}
            className="mt-3 text-sm text-gray-600 font-medium hover:text-black underline underline-offset-2 transition"
          >
            + Add your first experience
          </button>
        </div>
      )}

      {/* Experience cards */}
      <div className="space-y-4">
        {data.map((exp, index) => (
          <div
            key={index}
            className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50"
          >
            {/* Card header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Experience {index + 1}
              </span>
              <button
                onClick={() => removeExperience(index)}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                icon={<Building2 className="w-4 h-4" />}
                value={exp.company}
                placeholder="e.g. Google, Infosys"
                onChange={(e: any) => handleChange(index, "company", e.target.value)}
              />

              <Input
                label="Role / Designation"
                icon={<BadgeCheck className="w-4 h-4" />}
                value={exp.role}
                placeholder="e.g. Software Engineer"
                onChange={(e: any) => handleChange(index, "role", e.target.value)}
              />

              <Input
                label="Location"
                icon={<MapPin className="w-4 h-4" />}
                value={exp.location}
                placeholder="e.g. Bangalore, Remote"
                onChange={(e: any) => handleChange(index, "location", e.target.value)}
              />

              <Input
                label="Duration"
                icon={<Calendar className="w-4 h-4" />}
                value={exp.duration}
                placeholder="e.g. Jan 2022 – Mar 2024"
                onChange={(e: any) => handleChange(index, "duration", e.target.value)}
              />
            </div>
          </div>
        ))}
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
}: {
  label: string;
  value: string;
  onChange: (e: any) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}) => (
  <div>
    <p className="text-xs font-medium text-gray-500 mb-1.5">{label}</p>
    <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 transition-all">
      {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
      />
    </div>
  </div>
);