import { useState } from "react";
import { Code2, Plus, X } from "lucide-react";

const SUGGESTED_SKILLS = [
  "React", "Node.js", "TypeScript", "Python", "Java",
  "MongoDB", "SQL", "AWS", "Docker", "Git",
  "Tailwind CSS", "Next.js", "Express.js", "Spring Boot", "Figma",
];

export const Skills = ({
  data = [],
  onChange,
}: {
  data?: string[];
  onChange: (skills: string[]) => void;
}) => {
  const [input, setInput] = useState("");

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed || data.includes(trimmed)) return;
    onChange([...data, trimmed]);
    setInput("");
  };

  const removeSkill = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(input);
    }
    if (e.key === "Backspace" && !input && data.length > 0) {
      removeSkill(data.length - 1);
    }
  };

  const suggestions = SUGGESTED_SKILLS.filter(
    (s) => !data.includes(s) && s.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
          <Code2 className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Skills</h3>
          <p className="text-xs text-gray-400">Type and press Enter to add a skill</p>
        </div>
      </div>

      {/* Tag input box */}
      <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 focus-within:bg-white focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 transition-all min-h-[56px] flex flex-wrap gap-2">
        {/* Existing skill tags */}
        {data.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="hover:text-gray-300 transition"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Input */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={data.length === 0 ? "e.g. React, Python, SQL..." : "Add more..."}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
        />
      </div>

      <p className="text-xs text-gray-400 mt-1.5 ml-1">
        Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px]">Enter</kbd> or{" "}
        <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px]">,</kbd> to add
      </p>

      {/* Suggestions */}
      {input && suggestions.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-400 mb-2">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 6).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addSkill(s)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-500 hover:text-gray-900 transition"
              >
                <Plus className="w-3 h-3" />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick-add suggestions (when input is empty) */}
      {!input && data.length < 5 && (
        <div className="mt-4">
          <p className="text-xs text-gray-400 mb-2">Quick add</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_SKILLS.filter((s) => !data.includes(s)).slice(0, 8).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addSkill(s)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-dashed border-gray-200 text-gray-500 rounded-lg hover:border-gray-400 hover:text-gray-800 transition"
              >
                <Plus className="w-3 h-3" />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Count */}
      {data.length > 0 && (
        <p className="text-xs text-gray-400 mt-3">
          {data.length} skill{data.length !== 1 ? "s" : ""} added
        </p>
      )}
    </div>
  );
};