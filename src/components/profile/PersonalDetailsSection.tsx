// import { useState } from "react"

// export const PersonalDetailsSection = () => {
//   const [data, setData] = useState({
//     name: "Anjali",
//     email: "anjali@gmail.com",
//     phone: "",
//     gender: "",
//   })

//   const handleChange = (field: string, value: string) => {
//     setData({ ...data, [field]: value })
//   }

//   return (
//     <div className="bg-white rounded-2xl shadow p-6">
//       <h3 className="font-semibold mb-6 text-lg">
//         Personal Information
//       </h3>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Input label="Full Name" value={data.name} onChange={(e: { target: { value: string } }) => handleChange("name", e.target.value)} />
//         <Input label="Email" value={data.email} onChange={(e: { target: { value: string } }) => handleChange("email", e.target.value)} />
//         <Input label="Phone" value={data.phone} onChange={(e: { target: { value: string } }) => handleChange("phone", e.target.value)} />
//         <Input label="Gender" value={data.gender} onChange={(e: { target: { value: string } }) => handleChange("gender", e.target.value)} />
//       </div>
//     </div>
//   )
// }

// const Input = ({ label, value, onChange }: any) => (
//   <div>
//     <p className="text-xs text-gray-500 mb-1">{label}</p>
//     <input
//       value={value}
//       onChange={onChange}
//       className="w-full px-3 py-2 border rounded-lg"
//       placeholder={label}
//     />
//   </div>
// )

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
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="font-semibold mb-6 text-lg">Personal Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={data.name || ""}
          onChange={(e: { target: { value: string } }) =>
            handleChange("name", e.target.value)
          }
        />

        <Input
          label="Email"
          value={data.email || ""}
          onChange={(e: { target: { value: string } }) =>
            handleChange("email", e.target.value)
          }
        />

        <Input
          label="Phone"
          value={data.contact || ""}
          onChange={(e: { target: { value: string } }) =>
            handleChange("contact", e.target.value)
          }
        />

        <div>
  <p className="text-xs text-gray-500 mb-2">Gender</p>

  <div className="flex gap-6">
    <label className="flex items-center gap-2 text-sm">
      <input
        type="radio"
        name="gender"
        value="male"
        checked={data.gender === "male"}
        onChange={() => handleChange("gender", "male")}
      />
      Male
    </label>

    <label className="flex items-center gap-2 text-sm">
      <input
        type="radio"
        name="gender"
        value="female"
        checked={data.gender === "female"}
        onChange={() => handleChange("gender", "female")}
      />
      Female
    </label>

    <label className="flex items-center gap-2 text-sm">
      <input
        type="radio"
        name="gender"
        value="other"
        checked={data.gender === "other"}
        onChange={() => handleChange("gender", "other")}
      />
      Other
    </label>
  </div>
</div>

        <Input
          label="LinkedIn Profile"
          value={data.linkedin || ""}
          onChange={(e: { target: { value: string } }) =>
            handleChange("linkedin", e.target.value)
          }
        />
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
      className="w-full px-3 py-2 border rounded-lg"
      placeholder={label}
    />
  </div>
);
