import { useEffect, useState } from "react";
import { getColleges } from "../../services/college.service";

export const EducationSection = ({
  education = [],
  onChange,
}: {
  education?: any[];
  onChange: (edu: any[]) => void;
}) => {
  /* ================== EDUCATION HANDLERS ================== */

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...education];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  const addEducation = () => {
    onChange([
      ...education,
      {
        level: "",
        institute: "",
        board: "",
        subject: "",
        grade: "",
        year: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  const shouldShowSubject = (level: string) => {
    return (
      level === "12th" ||
      level === "Diploma" ||
      level === "Graduation" ||
      level === "Post Graduation" ||
      level === "PhD"
    );
  };

  const getSubjectLabel = (level: string) => {
    if (level === "12th") return "Stream (Science / Commerce / Arts)";
    if (level === "Graduation" || level === "Post Graduation")
      return "Specialization / Major (optional)";
    if (level === "Diploma" || level === "PhD")
      return "Specialization (optional)";
    return "Subject";
  };

  /* ================== COLLEGE SEARCH ================== */

  const [colleges, setColleges] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const data = await getColleges(
        search, // 🔥 typed text backend ko ja raha
      );
        setColleges(data || []);
      } catch (err) {
        console.error("Failed to fetch colleges");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchColleges, 400); // debounce
    return () => clearTimeout(timer);
  }, [search]);

  /* ================== UI ================== */

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Education</h3>
        <button
          onClick={addEducation}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600"
        >
          + Add Education
        </button>
      </div>

      {education.length === 0 && (
        <p className="text-sm text-gray-400">
          No education added yet. Click <b>Add Education</b> to begin.
        </p>
      )}

      {education.map((edu, index) => (
        <div key={index} className="relative border rounded-xl p-4 space-y-4">
          <Select
            label="Education Level"
            value={edu.level}
            onChange={(e: any) =>
              handleChange(index, "level", e.target.value)
            }
            options={[
              "10th",
              "12th",
              "Diploma",
              "Graduation",
              "Post Graduation",
              "PhD",
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 🔥 College Search + Select */}
            <div>
              <p className="text-xs text-gray-500 mb-1">
                School / University
              </p>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type college name"
                className="w-full px-3 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <select
                value={edu.institute}
                onChange={(e) =>
                  handleChange(index, "institute", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">
                  {loading ? "Loading..." : "Select College"}
                </option>
                {colleges.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Board / Degree"
              value={edu.board}
              onChange={(e: any) =>
                handleChange(index, "board", e.target.value)
              }
            />

            {shouldShowSubject(edu.level) && (
              <Input
                label={getSubjectLabel(edu.level)}
                value={edu.subject}
                onChange={(e: any) =>
                  handleChange(index, "subject", e.target.value)
                }
              />
            )}

            <Input
              label="Grade / Percentage"
              value={edu.grade}
              onChange={(e: any) =>
                handleChange(index, "grade", e.target.value)
              }
            />

            <Input
              label="Passing Year"
              value={edu.year}
              onChange={(e: any) =>
                handleChange(index, "year", e.target.value)
              }
            />
          </div>

          <button
            onClick={() => removeEducation(index)}
            className="absolute top-3 right-3 text-red-500 text-xs hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

/* ================== REUSABLE INPUT ================== */

const Input = ({ label, value, onChange }: any) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <input
      value={value}
      onChange={onChange}
      placeholder={label}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />
  </div>
);

/* ================== REUSABLE SELECT ================== */

const Select = ({ label, value, onChange, options }: any) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      <option value="">Select</option>
      {options.map((opt: string) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
