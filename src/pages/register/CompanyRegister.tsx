import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronsLeft } from "lucide-react";
import { registerCompany } from "../../services/company.service";

function CompanyRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [otherLocationInput, setOtherLocationInput] = useState("");
  const [jobInput, setJobInput] = useState("");

  const [form, setForm] = useState({
    name: "",
    logo: "",
    industry: "",
    location: "",
    otherLocations: [] as string[],
    companySize: "",
    website: "",
    jobs: [] as { title: string }[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddLocation = () => {
    if (otherLocationInput.trim()) {
      setForm({
        ...form,
        otherLocations: [...form.otherLocations, otherLocationInput.trim()],
      });
      setOtherLocationInput("");
    }
  };

  const handleRemoveLocation = (index: number) => {
    setForm({
      ...form,
      otherLocations: form.otherLocations.filter((_, i) => i !== index),
    });
  };

  const handleAddJob = () => {
    if (jobInput.trim()) {
      setForm({
        ...form,
        jobs: [...form.jobs, { title: jobInput.trim() }],
      });
      setJobInput("");
    }
  };

  const handleRemoveJob = (index: number) => {
    setForm({
      ...form,
      jobs: form.jobs.filter((_, i) => i !== index),
    });
  };

  const handleNext = () => {
    if (!form.name || !form.industry || !form.location || !form.companySize) {
      alert("Please fill all required fields");
      return;
    }
    setStep(2);
  };

  const handleRegister = async () => {
    if (!form.logo || !form.website) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        name: form.name,
        logo: form.logo,
        industry: form.industry,
        location: form.location,
        otherLocations: form.otherLocations,
        companySize: form.companySize,
        website: form.website,
        jobs: form.jobs,
      };

    

      await registerCompany(payload);
      alert("Company registered successfully");
      navigate("/");
    } catch (error) {
      console.error("❌ Registration error:", error);
      alert("Company registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-200 via-sky-100 to-white">
      <div className="w-full max-w-md rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl border border-white/40 px-8 py-10">
        {/* Header */}
        <h2 className="text-center text-2xl font-semibold text-gray-800">
          Company Registration
        </h2>
        <p className="text-center text-sm text-gray-500 mt-1 mb-6">
          Register your company
        </p>

        {/* Form */}
        <div className="space-y-4">
          {/* STEP 1 → BASIC INFO */}
          {step === 1 && (
            <>
              <input
                name="name"
                placeholder="Company Name *"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <input
                name="industry"
                placeholder="Industry (e.g., Technology) *"
                value={form.industry}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <input
                name="location"
                placeholder="Primary Location (e.g., Bangalore) *"
                value={form.location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <select
                name="companySize"
                value={form.companySize}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select Company Size *</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1001-5000">1001-5000</option>
                <option value="5001-10000">5001-10000</option>
                <option value="10000+">10000+</option>
              </select>
            </>
          )}

          {/* STEP 2 → ADDITIONAL DETAILS */}
          {step === 2 && (
            <>
              <div
                onClick={() => setStep(1)}
                className="text-sm text-indigo-600 cursor-pointer mb-2 flex items-center gap-1 hover:underline"
              >
                <ChevronsLeft />
              </div>

              <input
                name="logo"
                type="url"
                placeholder="Logo URL (e.g., https://logo.clearbit.com/google.com) *"
                value={form.logo}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <input
                name="website"
                type="url"
                placeholder="Website (e.g., https://www.google.com) *"
                value={form.website}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              {/* Other Locations */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Other Locations (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add location"
                    value={otherLocationInput}
                    onChange={(e) => setOtherLocationInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddLocation()}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddLocation}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>

                {/* Display added locations */}
                {form.otherLocations.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {form.otherLocations.map((loc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg"
                      >
                        <span className="text-sm text-gray-700">{loc}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLocation(index)}
                          className="text-red-500 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Jobs */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Job Positions (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add job title (e.g., Software Engineer)"
                    value={jobInput}
                    onChange={(e) => setJobInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddJob()}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddJob}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>

                {/* Display added jobs */}
                {form.jobs.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {form.jobs.map((job, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg"
                      >
                        <span className="text-sm text-gray-700">{job.title}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveJob(index)}
                          className="text-red-500 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* CTA */}
        {step === 1 ? (
          <button
            onClick={handleNext}
            className="w-full mt-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleRegister}
            className="w-full mt-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Register Company
          </button>
        )}

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-indigo-600 cursor-pointer font-medium hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default CompanyRegister;
