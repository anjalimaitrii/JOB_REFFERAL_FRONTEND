import { Briefcase, Building2, MapPin, Calendar, BadgeCheck, Plus, Trash2 } from "lucide-react";

export const Experience = ({
  data = [],
  onChange,
  themeColor = "indigo",
}: {
  data?: any[];
  onChange: (u: any[]) => void;
  themeColor?: string;
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

  const theme = {
    bg: `bg-${themeColor}-50`,
    icon: `text-${themeColor}-600`,
    text: `text-${themeColor}-600`,
    ring: `ring-${themeColor}-50`,
    focus: `focus-within:border-${themeColor}-400 focus-within:ring-${themeColor}-50`,
    badge: `bg-${themeColor}-50 text-${themeColor}-600 border-${themeColor}-100`
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 sm:gap-0">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${theme.bg} flex items-center justify-center`}>
            <Briefcase className={`w-5 h-5 ${theme.icon}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none mb-1">Career Journey</h3>
            <p className="text-xs text-slate-500 font-medium">Professional work history</p>
          </div>
        </div>

        <button
          onClick={addExperience}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 active:scale-95 transition-all shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Experience
        </button>
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/20">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-6 h-6 text-slate-200" />
          </div>
          <p className="text-xs text-slate-400 font-bold mb-3">No professional history added</p>
          <button
            onClick={addExperience}
            className={`text-[11px] font-bold ${theme.text} ${theme.bg} px-5 py-2 rounded-lg hover:brightness-95 transition-all shadow-sm`}
          >
            + Add First Entry
          </button>
        </div>
      )}

      {/* Experience cards */}
      <div className="space-y-5">
        {data.map((exp, index) => (
          <div
            key={index}
            className="group border border-slate-100 rounded-2xl p-5 bg-slate-50/50 relative hover:border-slate-200 transition-all"
          >
            {/* Card header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Experience Record #{index + 1}
                </span>
              </div>
              <button
                onClick={() => removeExperience(index)}
                className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500 hover:text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg transition-all border border-rose-100 opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-2.5 h-2.5" />
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Company"
                icon={<Building2 className="w-3.5 h-3.5" />}
                value={exp.company}
                placeholder="e.g. Amazon"
                onChange={(e: any) => handleChange(index, "company", e.target.value)}
                themeColor={themeColor}
              />

              <Input
                label="Designation"
                icon={<BadgeCheck className="w-3.5 h-3.5" />}
                value={exp.role}
                placeholder="e.g. Lead Designer"
                onChange={(e: any) => handleChange(index, "role", e.target.value)}
                themeColor={themeColor}
              />

              <Input
                label="Location"
                icon={<MapPin className="w-3.5 h-3.5" />}
                value={exp.location}
                placeholder="e.g. Remote"
                onChange={(e: any) => handleChange(index, "location", e.target.value)}
                themeColor={themeColor}
              />

              <Input
                label="Duration"
                icon={<Calendar className="w-3.5 h-3.5" />}
                value={exp.duration}
                placeholder="e.g. 2021 – Present"
                onChange={(e: any) => handleChange(index, "duration", e.target.value)}
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
const Input = ({
  label,
  value,
  onChange,
  placeholder,
  icon,
  themeColor = "indigo",
}: {
  label: string;
  value: string;
  onChange: (e: any) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  themeColor?: string;
}) => (
  <div className="space-y-1.5">
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</p>
    <div className={`flex items-center gap-3 border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white focus-within:bg-white focus-within:border-${themeColor}-400 focus-within:ring-4 focus-within:ring-${themeColor}-50 transition-all shadow-sm`}>
      {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        className="flex-1 bg-transparent outline-none text-sm font-semibold text-slate-800 placeholder-slate-300"
      />
    </div>
  </div>
);