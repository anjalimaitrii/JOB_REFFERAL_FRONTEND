
export const JobInformationSection = ({
  data,
  onChange,
}: {
  data: any
  onChange: (u: any) => void
}) => {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="font-semibold mb-6 text-lg">
        Job Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
          label="Company Name"
          value={data.company || ""}
          onChange={(e: { target: { value: string } }) =>
            handleChange("company", e.target.value)
          }
        />
        
        <Input
          label="Designation"
          value={data.designation || ""}
          onChange={(e: { target: { value: string } }) =>
            handleChange("designation", e.target.value)
          }
        />

        <Input
          label="Department"
          value={data.department || ""}
          onChange={(e: { target: { value: string } }) =>
            handleChange("department", e.target.value)
          }
        />

        <Input
          label="Experience (Years)"
          value={data.experienceLevel || ""}
          onChange={(e: { target: { value: string } }) =>
            handleChange("experienceLevel", e.target.value)
          }
        />

        <Input
          label="Employment Type"
          value={data.employmentType || ""}
          onChange={(e: { target: { value: string } }) =>
            handleChange("employmentType", e.target.value)
          }
        />
      </div>
    </div>
  )
}

const Input = ({ label, value, onChange }: any) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <input
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded-lg"
      placeholder={label}
    />
  </div>
)
