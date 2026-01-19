export const Experience = ({
  data = [],
  onChange,
}: {
  data?: any[];
  onChange: (u: any[]) => void;
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

  const addExperience = () => {
    onChange([
      ...data,
      { company: "", role: "", location: "", duration: "" },
    ]);
  };

  const removeExperience = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Experience</h3>

        <button
          onClick={addExperience}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600"
        >
          + Add Experience
        </button>
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <p className="text-sm text-gray-400">
          No experience added yet.
        </p>
      )}

      {/* Experience blocks */}
      {data.map((exp, index) => (
        <div
          key={index}
          className="relative border rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Input
            label="Company Name"
            value={exp.company}
            onChange={(e: any) =>
              handleChange(index, "company", e.target.value)
            }
          />

          <Input
            label="Role / Designation"
            value={exp.role}
            onChange={(e: any) =>
              handleChange(index, "role", e.target.value)
            }
          />

          <Input
            label="Location"
            value={exp.location}
            onChange={(e: any) =>
              handleChange(index, "location", e.target.value)
            }
          />

          <Input
            label="Duration (e.g. 2022 – 2024)"
            value={exp.duration}
            onChange={(e: any) =>
              handleChange(index, "duration", e.target.value)
            }
          />

          <button
            onClick={() => removeExperience(index)}
            className="absolute top-3 right-3 text-red-500 text-xs hover:underline"
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

