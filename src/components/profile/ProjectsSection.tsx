import { FolderGit2, Plus, Trash2, Link, FileText, ExternalLink } from "lucide-react";

export const Projects = ({
  data = [],
  onChange,
  themeColor = "indigo",
}: {
  data?: any[];
  onChange: (projects: any[]) => void;
  themeColor?: string;
}) => {
  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addProject = () => {
    onChange([...data, { name: "", description: "", link: "" }]);
  };

  const removeProject = (index: number) => {
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
            <FolderGit2 className={`w-5 h-5 ${theme.icon}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none mb-1">Project Portfolio</h3>
            <p className="text-xs text-slate-500 font-medium">Showcase your practical work</p>
          </div>
        </div>

        <button
          onClick={addProject}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 active:scale-95 transition-all shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Project
        </button>
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/20">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-3">
            <FolderGit2 className="w-6 h-6 text-slate-200" />
          </div>
          <p className="text-xs text-slate-400 font-bold mb-3">No projects listed</p>
          <button
            onClick={addProject}
            className={`text-[11px] font-bold ${theme.text} ${theme.bg} px-5 py-2 rounded-lg hover:brightness-95 transition-all shadow-sm`}
          >
            + New Project
          </button>
        </div>
      )}

      {/* Project cards */}
      <div className="space-y-5">
        {data.map((project, index) => (
          <div
            key={index}
            className="group border border-slate-100 rounded-2xl p-5 bg-slate-50/50 relative hover:border-slate-200 transition-all"
          >
            {/* Card header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3 sm:gap-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Project Record #{index + 1}
                </span>
                {project.name && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className={`text-[11px] ${theme.text} font-bold truncate max-w-[120px] sm:max-w-[140px]`}>
                      {project.name}
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={() => removeProject(index)}
                className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500 hover:text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg transition-all border border-rose-100 opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-2.5 h-2.5" />
                Remove
              </button>
            </div>

            <div className="space-y-5">
              <Input
                label="Project Title"
                icon={<FolderGit2 className="w-3.5 h-3.5" />}
                value={project.name}
                placeholder="e.g. AI Dashboard"
                onChange={(e: any) => handleChange(index, "name", e.target.value)}
                themeColor={themeColor}
              />

              <TextArea
                label="Description & Outcomes"
                value={project.description}
                placeholder="Problem, solution, and tech stack..."
                onChange={(e: any) => handleChange(index, "description", e.target.value)}
                themeColor={themeColor}
              />

              <div className="relative">
                <Input
                  label="URL / Repository"
                  icon={<Link className="w-3.5 h-3.5" />}
                  value={project.link}
                  placeholder="https://github.com/..."
                  onChange={(e: any) => handleChange(index, "link", e.target.value)}
                  themeColor={themeColor}
                />

                {/* Live preview chip */}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`absolute top-0 right-0 inline-flex items-center gap-1 text-[9px] font-bold ${theme.text} hover:opacity-80 ${theme.bg} px-2 py-1 rounded-lg border ${theme.border} shadow-sm transition-all`}
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                    Preview
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── REUSABLE INPUT ── */
const Input = ({
  label, value, onChange, placeholder, icon, themeColor = "indigo",
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
    <div className={`flex items-center gap-2.5 border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white focus-within:border-${themeColor}-400 focus-within:ring-4 focus-within:ring-${themeColor}-50 transition-all shadow-sm`}>
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

/* ── REUSABLE TEXTAREA ── */
const TextArea = ({
  label, value, onChange, placeholder, themeColor = "indigo",
}: {
  label: string;
  value: string;
  onChange: (e: any) => void;
  placeholder?: string;
  themeColor?: string;
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-1.5 mb-1 ml-1">
      <FileText className="w-3.5 h-3.5 text-slate-400" />
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
    </div>
    <textarea
      rows={3}
      value={value}
      onChange={onChange}
      placeholder={placeholder || label}
      className={`w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white text-sm font-semibold text-slate-800 placeholder-slate-300 outline-none focus:border-${themeColor}-400 focus:ring-4 focus:ring-${themeColor}-50 transition-all resize-none shadow-sm`}
    />
  </div>
);