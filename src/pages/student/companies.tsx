"use client";

import { useEffect, useState } from "react";
import { getEmployeesByCompany } from "../../services/employee.service";
import {
  getCollegesWithEmployees,
  getCompanies,
  getEmployeesByCollege,
} from "../../services/company.service";
import { ChevronsLeft } from "lucide-react";
import { sendRequestToEmployee } from "../../services/request.service";

type Company = {
  _id: string;
  name: string;
  logo?: string;
  industry?: string;
  location: string;
  otherLocations?: string[];
  companySize?: string;
  website?: string;
  jobs: { _id: string; title: string }[];
};

type Employee = {
  jobTitle: string;
  _id: string;
  name: string;
  designation: string;
  profilePhoto?: string;
  experience?: string;
};

function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const [useJobId, setUseJobId] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [manualJobId, setManualJobId] = useState("");

  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const user = stored.user;
  const isEmployee = user?.role === "employee";
  const myCompanyId = String(user?.company);

  const visibleCompanies = isEmployee
    ? companies.filter((c) => String(c._id) !== myCompanyId)
    : companies;

  const [viewMode, setViewMode] = useState<"company" | "college">("company");
  const [colleges, setColleges] = useState<string[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);


  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleCompanyClick = async (company: Company) => {
    setSelectedCompany(company);
    try {
      const res = await getEmployeesByCompany(company._id);
      setEmployees(res.data);
    } catch {
      console.error("Failed to fetch employees");
    }
  };

  useEffect(() => {
    if (viewMode !== "college") return;
    const fetchColleges = async () => {
      try {
        const res = await getCollegesWithEmployees();
        setColleges(res.data || []);
      } catch {
        setColleges([]);
      }
    };
    fetchColleges();
  }, [viewMode]);

  const handleCollegeClick = async (collegeName: string) => {
    setSelectedCollege(collegeName);
    setSelectedCompany(null);
    try {
      const res = await getEmployeesByCollege(collegeName);
      setEmployees(res.data || []);
    } catch {
      setEmployees([]);
    }
  };

  const handleSendRequest = async (
    employeeId: string,
    companyId: string,
    role: string,
  ) => {
    if (!role) {
      alert("Please select a job or enter Job ID");
      return;
    }
    try {
      await sendRequestToEmployee({
        receiver: employeeId,
        company: companyId,
        role,
      });
      alert("Request sent");
      setShowModal(false);
    } catch {
      alert("Failed to send request");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading companies...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      {/* Search */}
      <div className="flex justify-center mt-10 sm:mt-6 mb-6 sm:mb-8">
        <input
          placeholder="Search employee name, job..."
          className="w-full sm:max-w-xl px-5 py-3 rounded-full
      bg-white text-gray-700 border border-gray-300
      shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>
      {/* TOGGLE */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setViewMode("company")}
            className={`px-10 py-4 rounded-lg text-sm font-medium ${viewMode === "company" ? "bg-black text-white" : "text-gray-600"
              }`}
          >
            Companies
          </button>
          <button
            onClick={() => setViewMode("college")}
            className={`px-10 py-4 rounded-lg text-sm font-medium ${viewMode === "college" ? "bg-black text-white" : "text-gray-600"
              }`}
          >
            Colleges
          </button>
        </div>
      </div>

      {!selectedCompany && (
        <h1 className="text-3xl font-bold text-center mb-8">
          {viewMode === "company" ? "Companies" : "Colleges"}
        </h1>
      )}

      {/* COMPANIES */}
      {viewMode === "company" && !selectedCompany && (
        <div className="max-w-8xl mx-auto bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-sm uppercase text-gray-600">
              <tr>
                <th className="p-4">Logo</th>
                <th className="p-4">Company</th>
                <th className="p-4">Industry</th>
                <th className="p-4">Location</th>
                <th className="p-4">Website</th>
              </tr>
            </thead>
            <tbody>
              {visibleCompanies.map((company) => (
                <tr
                  key={company._id}
                  onClick={() => handleCompanyClick(company)}
                  className="border-t hover:bg-gray-50 text-center cursor-pointer"
                >
                  <td className="p-4">
                    <img src={company.logo} className="w-8 h-8" />
                  </td>
                  <td className="p-4">{company.name}</td>
                  <td className="p-4">{company.industry || "-"}</td>
                  <td className="p-4">{company.location}</td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        className="px-8 py-2 rounded-lg bg-black text-white text-xs"
                      >
                        Visit
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* COLLEGES */}
      {viewMode === "college" && !selectedCollege && (
        <div className="max-w-8xl mx-auto bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
                <th className="p-4">College Name</th>
              </tr>
            </thead>

            <tbody>
              {colleges.length === 0 ? (
                <tr>
                  <td className="p-4 text-gray-400 text-center">
                    No colleges found
                  </td>
                </tr>
              ) : (
                colleges.map((college) => (
                  <tr
                    key={college}
                    onClick={() => handleCollegeClick(college)}
                    className="cursor-pointer border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4 text-gray-700 font-medium">{college}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* EMPLOYEES */}
      {(selectedCompany || selectedCollege) && (
        <div className="mt-12">
          <button
            onClick={() => {
              setSelectedCompany(null);
              setSelectedCollege(null);
              setEmployees([]);
            }}
            className="mb-4 text-sm text-gray hover:underline flex items-center gap-1"
          >
            <ChevronsLeft size={18} />
          </button>

          <h2 className="text-2xl font-semibold text-center mb-6">
            {selectedCompany
              ? `${selectedCompany.name} Employees`
              : `${selectedCollege} Employees`}
          </h2>

          {employees.length === 0 ? (
            <p className="text-center text-gray-500">No employees found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-8xl mx-auto">
              {employees.map((emp) => {
                const jobTitle = selectedCompany?.jobs.find(
                  (job) => job._id === emp.designation,
                )?.title;

                return (
                  <div
                    key={emp._id}
                    className="
                rounded-2xl p-6 shadow-md
                bg-gradient-to-br from-gray-50 via-white to-gray-100
                hover:shadow-xl transition
              "
                  >
                    <div className="flex items-center gap-4">
                      {emp.profilePhoto ? (
                        <img
                          src={emp.profilePhoto}
                          alt={emp.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gray-400 text-white flex items-center justify-center text-lg font-semibold">
                          {emp.name[0]}
                        </div>
                      )}

                      <div>
                        <p className="text-lg font-semibold text-gray-800">
                          {emp.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {jobTitle || "Employee"}
                        </p>
                      </div>
                    </div>

                    <div className="my-4 border-t" />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">
                          Experience
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          {emp.experience
                            ? `${emp.experience} Years`
                            : "Fresher"}
                        </p>
                      </div>

                      {/* SEND REQUEST BUTTON (BACK) */}
                      <button
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setShowModal(true);
                          setUseJobId(false);
                          setSelectedJobId("");
                          setManualJobId("");
                        }}
                        className="px-4 py-1.5 text-sm rounded-full bg-black text-white"
                      >
                        Send Request
                      </button>
                    </div>

                    {/*  MODAL (SAME AS OLD CODE) */}
                    {showModal && selectedEmployee && (
                      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div
                          className="bg-white rounded-2xl p-6 w-[420px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <h3 className="text-lg font-semibold mb-4">
                            Send Referral Request
                          </h3>

                          <label className="text-sm text-gray-500">
                            Select Job Role
                          </label>

                          <div className="flex gap-2 mt-1">
                            <select
                              // disabled={useJobId || !selectedCompany}
                              value={selectedJobId}
                              onChange={(e) => {
                                setSelectedJobId(e.target.value);
                                setManualJobId("");
                              }}
                              className="flex-1 border rounded-lg px-3 py-2 disabled:bg-gray-100"
                            >
                              <option value="">Select a job</option>
                              {selectedCompany?.jobs?.map((job) => (
                                <option key={job._id} value={job._id}>
                                  {job.title}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={() => {
                                setUseJobId(true);
                                setSelectedJobId("");
                              }}
                              className="px-3 py-2 text-xs rounded-lg border text-gray-600"
                            >
                              Use Job ID
                            </button>
                          </div>

                          {useJobId && (
                            <div className="mt-4">
                              <label className="text-sm text-gray-500">
                                Enter Job ID
                              </label>

                              <input
                                value={manualJobId}
                                onChange={(e) => {
                                  setManualJobId(e.target.value);
                                  setSelectedJobId("");
                                }}
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                              />

                              <button
                                onClick={() => {
                                  setUseJobId(false);
                                  setManualJobId("");
                                }}
                                className="text-xs mt-2 text-gray-500 underline"
                              >
                                Back to job list
                              </button>
                            </div>
                          )}

                          <button
                            onClick={() =>
                              handleSendRequest(
                                selectedEmployee._id,
                                selectedCompany?._id ||
                                selectedEmployee.company?._id ||
                                selectedEmployee.company,
                                selectedJobId || manualJobId,
                              )
                            }
                            disabled={!selectedJobId && !manualJobId}
                            className="mt-6 w-full py-2 rounded-lg bg-black text-white disabled:opacity-50"
                          >
                            Send Request
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Companies;
