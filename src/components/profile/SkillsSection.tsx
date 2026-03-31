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
  themeColor = "indigo",
}: {
  data?: string[];
  onChange: (skills: string[]) => void;
  themeColor?: string;
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

  const theme = {
    bg: `bg-${themeColor}-50`,
    icon: `text-${themeColor}-600`,
    text: `text-${themeColor}-600`,
    ring: `ring-${themeColor}-50`,
    focus: `focus-within:border-${themeColor}-400 focus-within:ring-${themeColor}-50`,
    hoverBg: `hover:bg-${themeColor}-50`,
    hoverText: `hover:text-${themeColor}-600`,
    hoverBorder: `hover:border-${themeColor}-400`,
    badge: `bg-${themeColor}-50 text-${themeColor}-600 border-${themeColor}-100`
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl ${theme.bg} flex items-center justify-center`}>
          <Code2 className={`w-5 h-5 ${theme.icon}`} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none mb-1">Toolkit & Expertise</h3>
          <p className="text-xs text-slate-500 font-medium">Highlight your technical stack</p>
        </div>
      </div>

      {/* Tag input box */}
      <div className={`border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 focus-within:bg-white ${theme.focus} transition-all min-h-[56px] flex flex-wrap gap-2 shadow-inner group`}>
        {/* Existing skill tags */}
        {data.map((skill, index) => (
          <span
            key={index}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-[#1a1a1a] via-[#333] to-[#444] text-white border-gray-800 shadow-xl p-6 rounded-[2rem] border text-[11px] font-bold animate-in fade-in zoom-in-95 duration-200 shadow-slate-100 ring-4 ${theme.ring}`}
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="text-slate-400 hover:text-white transition-colors p-0.5 rounded-md hover:bg-white/10"
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
          placeholder={data.length === 0 ? "Search skills (e.g. React, Python...)" : "Add skill..."}
          className="flex-1 min-w-[150px] bg-transparent outline-none text-sm font-semibold text-slate-800 placeholder-slate-400"
        />
      </div>

      <div className="flex items-center gap-2 mt-2.5 ml-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
        <span>Press</span>
        <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-500 shadow-sm leading-none">Enter</kbd>
        <span>to sync</span>
      </div>

      {/* Suggestions */}
      {input && suggestions.length > 0 && (
        <div className="mt-5 animate-in slide-in-from-top-1 duration-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1 leading-none">Matching Toolkit</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 8).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addSkill(s)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold border border-slate-200 text-slate-600 rounded-lg ${theme.hoverBorder} ${theme.hoverText} ${theme.hoverBg} transition-all bg-white shadow-sm`}
              >
                <Plus className="w-3 h-3" />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick-add suggestions */}
      {!input && (
        <div className="mt-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1 leading-none">Suggested Expertise</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_SKILLS.filter((s) => !data.includes(s)).slice(0, 10).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addSkill(s)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold bg-white border border-slate-200 text-slate-500 rounded-lg ${theme.hoverBorder} ${theme.hoverText} hover:shadow-md transition-all shadow-sm`}
              >
                <Plus className={`w-3 h-3 text-slate-300`} />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Persistence Info */}
      {data.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] font-bold text-slate-400 uppercase">
            {data.length} Experts Identified
          </p>
          {data.length >= 5 ? (
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">Strong Toolkit</span>
          ) : (
            <span className={`text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100`}>Needs {5 - data.length} more skills</span>
          )}
        </div>
      )}
    </div>
  );
};