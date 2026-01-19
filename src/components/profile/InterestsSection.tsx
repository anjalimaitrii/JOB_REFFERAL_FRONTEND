const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "MERN Stack Developer",
  "Java Developer",
]

export const InterestSection = ({
  interests,
  onChange,
}: {
  interests: string[]
  onChange: (roles: string[]) => void
}) => {
  const toggleRole = (role: string) => {
    onChange(
      interests.includes(role)
        ? interests.filter((r) => r !== role)
        : [...interests, role]
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="font-semibold mb-2 text-lg">
        Interested Roles
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Select roles you are interested in
      </p>

      <div className="flex flex-wrap gap-3">
        {ROLES.map((role) => (
          <button
            key={role}
            onClick={() => toggleRole(role)}
            className={`px-4 py-2 rounded-full text-sm border transition
              ${
                interests.includes(role)
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  )
}
