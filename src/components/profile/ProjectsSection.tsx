import { FolderGit2, Plus, Trash2, Link, FileText, ExternalLink } from "lucide-react";

export const Projects = ({
  data = [],
  onChange,
}: {
  data?: any[];
  onChange: (projects: any[]) => void;
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <FolderGit2 className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Projects</h3>
            <p className="text-xs text-gray-400">Showcase your best work</p>
          </div>
        </div>

        <button
          onClick={addProject}
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
          <FolderGit2 className="w-8 h-8 text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No projects added yet.</p>
          <button
            onClick={addProject}
            className="mt-3 text-sm text-gray-600 font-medium hover:text-black underline underline-offset-2 transition"
          >
            + Add your first project
          </button>
        </div>
      )}

      {/* Project cards */}
      <div className="space-y-4">
        {data.map((project, index) => (
          <div
            key={index}
            className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50"
          >
            {/* Card header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Project {index + 1}
                </span>
                {project.name && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-700 font-medium truncate max-w-[160px]">
                      {project.name}
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={() => removeProject(index)}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Project Name"
                icon={<FolderGit2 className="w-4 h-4" />}
                value={project.name}
                placeholder="e.g. Job Referral Portal"
                onChange={(e: any) => handleChange(index, "name", e.target.value)}
              />

              <TextArea
                label="Description"
                value={project.description}
                placeholder="Briefly describe what this project does, tech used, and your role..."
                onChange={(e: any) => handleChange(index, "description", e.target.value)}
              />

              <Input
                label="Project Link"
                icon={<Link className="w-4 h-4" />}
                value={project.link}
                placeholder="https://github.com/username/project"
                onChange={(e: any) => handleChange(index, "link", e.target.value)}
              />

              {/* Live preview chip */}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open link
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── REUSABLE INPUT ── */
const Input = ({
  label, value, onChange, placeholder, icon,
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

/* ── REUSABLE TEXTAREA ── */
const TextArea = ({
  label, value, onChange, placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: any) => void;
  placeholder?: string;
}) => (
  <div>
    <div className="flex items-center gap-1.5 mb-1.5">
      <FileText className="w-3.5 h-3.5 text-gray-400" />
      <p className="text-xs font-medium text-gray-500">{label}</p>
    </div>
    <textarea
      rows={3}
      value={value}
      onChange={onChange}
      placeholder={placeholder || label}
      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all resize-none"
    />
  </div>
);