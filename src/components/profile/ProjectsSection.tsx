export const Projects = ({
  data = [],
  onChange,
}: {
  data?: any[];
  onChange: (projects: any[]) => void;
}) => {
  const handleChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...data];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  const addProject = () => {
    onChange([
      ...data,
      { name: "", description: "", link: "" },
    ]);
  };

  const removeProject = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Projects</h3>

        <button
          onClick={addProject}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600"
        >
          + Add Project
        </button>
      </div>

      {data.length === 0 && (
        <p className="text-sm text-gray-400">
          No projects added yet.
        </p>
      )}

      {data.map((project, index) => (
        <div
          key={index}
          className="relative border rounded-xl p-4 space-y-4"
        >
          <Input
            label="Project Name"
            value={project.name}
            onChange={(e: any) =>
              handleChange(index, "name", e.target.value)
            }
          />

          <TextArea
            label="Project Description"
            value={project.description}
            onChange={(e: any) =>
              handleChange(index, "description", e.target.value)
            }
          />

          <Input
            label="Project Link (GitHub / Live)"
            value={project.link}
            onChange={(e: any) =>
              handleChange(index, "link", e.target.value)
            }
          />

          <button
            onClick={() => removeProject(index)}
            className="absolute top-0 right-3 text-red-500 text-xs hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};


const Input = ({ label, value, onChange }: any) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <input
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
      placeholder={label}
    />
  </div>
);

const TextArea = ({ label, value, onChange }: any) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <textarea
      rows={4}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
      placeholder={label}
    />
  </div>
);
