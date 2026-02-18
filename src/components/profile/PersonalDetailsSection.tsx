import { User, Mail, Phone, Linkedin } from "lucide-react";

export const PersonalDetailsSection = ({
  data,
  onChange,
}: {
  data: any;
  onChange: (u: any) => void;
}) => {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Personal Information</h3>
          <p className="text-xs text-gray-400">Update your personal details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Full Name"
          icon={<User className="w-4 h-4" />}
          value={data.name || ""}
          placeholder="John Doe"
          onChange={(e: any) => handleChange("name", e.target.value)}
        />

        <Input
          label="Email"
          icon={<Mail className="w-4 h-4" />}
          value={data.email || ""}
          placeholder="john@example.com"
          type="email"
          onChange={(e: any) => handleChange("email", e.target.value)}
        />

        <Input
          label="Phone"
          icon={<Phone className="w-4 h-4" />}
          value={data.contact || ""}
          placeholder="+91 9876543210"
          type="tel"
          onChange={(e: any) => handleChange("contact", e.target.value)}
        />

        {/* Gender — pill toggle */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Gender</p>
          <div className="flex gap-2">
            {["male", "female", "other"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => handleChange("gender", g)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${
                  data.gender === g
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="LinkedIn Profile"
          icon={<Linkedin className="w-4 h-4" />}
          value={data.linkedin || ""}
          placeholder="linkedin.com/in/username"
          onChange={(e: any) => handleChange("linkedin", e.target.value)}
        />
      </div>
    </div>
  );
};

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
}: {
  label: string;
  value: string;
  onChange: (e: any) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
}) => (
  <div>
    <p className="text-xs font-medium text-gray-500 mb-1.5">{label}</p>
    <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:bg-white focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 transition-all">
      {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
      />
    </div>
  </div>
);