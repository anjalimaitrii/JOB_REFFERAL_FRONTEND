export const Skills = ({
  data = [],
  onChange,
}: {
  data?: string[];
  onChange: (skills: string[]) => void;
}) => {
  const handleChange = (index: number, value: string) => {
    const updated = [...data];
    updated[index] = value;
    onChange(updated);
  };

  const addSkill = () => {
    onChange([...data, ""]);
  };

  const removeSkill = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Skills</h3>

        <button
          onClick={addSkill}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600"
        >
          + Add Skill
        </button>
      </div>

      {data.length === 0 && (
        <p className="text-sm text-gray-400">
          No skills added yet.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((skill, index) => (
          <div
            key={index}
            className="relative border rounded-xl p-4"
          >
            <Input
              label={`Skill ${index + 1}`}
              value={skill}
              onChange={(e: any) =>
                handleChange(index, e.target.value)
              }
            />

            <button
              onClick={() => removeSkill(index)}
              className="absolute top-3 right-3 text-red-500 text-xs hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
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

