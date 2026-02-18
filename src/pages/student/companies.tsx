"use client";

import { useEffect, useState } from "react";
import { getEmployeesByCompany } from "../../services/employee.service";
import {
  getCollegesWithEmployees,
  getCompanies,
  getEmployeesByCollege,
} from "../../services/company.service";
import { ChevronsLeft, Search, Building2, GraduationCap, MapPin, Globe, Users, X } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchData, setSearchData] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        const allCompanies = data.data;
        setCompanies(allCompanies);

        let combined: any[] = [];
        for (let company of allCompanies) {
          combined.push({
            type: "company",
            id: company._id,
            name: company.name,
            industry: company.industry,
            location: company.location,
            data: company,
          });
          const empRes = await getEmployeesByCompany(company._id);
          const emps = empRes.data;
          for (let emp of emps) {
            const jobTitle = company.jobs?.find(
              (job: { _id: string; title: string }) => job._id === emp.designation
            )?.title;
            combined.push({
              type: "employee",
              id: emp._id,
              name: emp.name,
              designation: jobTitle || "Employee",
              companyName: company.name,
              data: emp,
              companyData: company,
              otherLocations: company.otherLocations || [],
            });
          }
        }
        setSearchData(combined);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredResults([]);
      return;
    }
    const term = searchTerm.toLowerCase();
    const results = searchData.filter(
      (item) =>
        item.name?.toLowerCase().includes(term) ||
        item.industry?.toLowerCase().includes(term) ||
        item.location?.toLowerCase().includes(term) ||
        item.designation?.toLowerCase().includes(term) ||
        item.companyName?.toLowerCase().includes(term) ||
        (item.otherLocations &&
          item.otherLocations.some((loc: string) => loc.toLowerCase().includes(term)))
    );
    setFilteredResults(results);
  }, [searchTerm, searchData]);

  const handleCompanyClick = async (company: Company) => {
    setSelectedCompany(company);
    setSelectedCollege(null);
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

  const handleSendRequest = async (employeeId: string, companyId: string, role: string) => {
    if (!role) {
      alert("Please select a job or enter Job ID");
      return;
    }
    try {
      await sendRequestToEmployee({ receiver: employeeId, company: companyId, role });
      alert("Request sent");
      setShowModal(false);
    } catch {
      alert("Failed to send request");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading companies...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto">

      {/* ── SEARCH BAR ── */}
      <div className="relative mb-8">
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-3.5 focus-within:ring-2 focus-within:ring-black/20 transition">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search company, employee, role, location..."
            className="flex-1 outline-none text-gray-700 bg-transparent text-sm placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => { setSearchTerm(""); setFilteredResults([]); }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && searchTerm && filteredResults.length > 0 && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-72 overflow-y-auto z-50">
            {filteredResults.slice(0, 10).map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.type === "company") handleCompanyClick(item.data);
                  else handleCompanyClick(item.companyData);
                  setSearchTerm("");
                  setShowSuggestions(false);
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-0"
              >
                {item.type === "company" ? (
                  <>
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.industry} · {item.location}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold text-violet-600">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.designation} · {item.companyName}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {showSuggestions && searchTerm && filteredResults.length === 0 && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 px-4 py-4 text-center text-gray-400 text-sm">
            No results found for "{searchTerm}"
          </div>
        )}
      </div>

      {/* ── TOGGLE ── */}
      {!selectedCompany && !selectedCollege && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {viewMode === "company" ? `${visibleCompanies.length} Companies` : `${colleges.length} Colleges`}
          </h2>
          <div className="inline-flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode("company")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "company" ? "bg-black text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Companies
            </button>
            <button
              onClick={() => setViewMode("college")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "college" ? "bg-black text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Colleges
            </button>
          </div>
        </div>
      )}

      {/* ── COMPANY CARDS ── */}
      {viewMode === "company" && !selectedCompany && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleCompanies.map((company) => (
            <div
              key={company._id}
              onClick={() => handleCompanyClick(company)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer p-5 group"
            >
              {/* Logo + Name */}
              <div className="flex items-center gap-3 mb-4">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-12 h-12 rounded-xl object-contain border border-gray-100 p-1 bg-gray-50"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-500">
                    {company.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 truncate group-hover:text-black">
                    {company.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{company.industry || "—"}</p>
                </div>
              </div>

              {/* Info chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                  <MapPin className="w-3 h-3" />
                  {company.location}
                </span>
                {company.jobs?.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                    <Users className="w-3 h-3" />
                    {company.jobs.length} {company.jobs.length === 1 ? "role" : "roles"}
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                  >
                    <Globe className="w-3 h-3" /> Website
                  </a>
                ) : (
                  <span />
                )}
                <span className="text-xs text-gray-400 group-hover:text-black transition">
                  View Employees →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── COLLEGE LIST ── */}
      {viewMode === "college" && !selectedCollege && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {colleges.length === 0 ? (
            <p className="col-span-full text-center text-gray-400 py-10">No colleges found</p>
          ) : (
            colleges.map((college) => (
              <div
                key={college}
                onClick={() => handleCollegeClick(college)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer p-5 flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6 text-violet-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800 truncate group-hover:text-black">{college}</p>
                  <p className="text-xs text-gray-400 mt-0.5">View alumni →</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── EMPLOYEES VIEW ── */}
      {(selectedCompany || selectedCollege) && (
        <div>
          {/* Back + Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => {
                setSelectedCompany(null);
                setSelectedCollege(null);
                setEmployees([]);
              }}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition font-medium"
            >
              <ChevronsLeft className="w-4 h-4" />
              Back
            </button>
            <div className="h-5 w-px bg-gray-200" />
            <div className="flex items-center gap-3">
              {selectedCompany?.logo ? (
                <img
                  src={selectedCompany.logo}
                  className="w-8 h-8 rounded-lg object-contain border border-gray-100 p-0.5"
                />
              ) : null}
              <h2 className="text-lg font-bold text-gray-800">
                {selectedCompany ? selectedCompany.name : selectedCollege}
                <span className="text-gray-400 font-normal ml-2 text-sm">
                  · {employees.length} employee{employees.length !== 1 ? "s" : ""}
                </span>
              </h2>
            </div>
          </div>

          {employees.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No employees found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((emp) => {
                const jobTitle = selectedCompany?.jobs.find(
                  (job) => job._id === emp.designation
                )?.title;

                return (
                  <div
                    key={emp._id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5"
                  >
                    {/* Avatar + Info */}
                    <div className="flex items-center gap-4 mb-4">
                      {emp.profilePhoto ? (
                        <img
                          src={emp.profilePhoto}
                          alt={emp.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 flex items-center justify-center text-xl font-bold shrink-0">
                          {emp.name?.charAt(0) || "?"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{emp.name}</p>
                        <p className="text-sm text-gray-500 truncate">{jobTitle || "Employee"}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {emp.experience ? `${emp.experience} yrs exp` : "Fresher"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setShowModal(true);
                        setUseJobId(false);
                        setSelectedJobId("");
                        setManualJobId("");
                      }}
                      className="w-full py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 active:scale-95 transition-all"
                    >
                      Send Request
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── MODAL ── */}
      {showModal && selectedEmployee && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Send Referral Request</h3>
                <p className="text-sm text-gray-400 mt-0.5">to {selectedEmployee.name}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Job select */}
            {!useJobId ? (
              <>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Select Job Role
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => { setSelectedJobId(e.target.value); setManualJobId(""); }}
                  className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/10 bg-gray-50"
                >
                  <option value="">— Choose a role —</option>
                  {selectedCompany?.jobs?.map((job) => (
                    <option key={job._id} value={job._id}>{job.title}</option>
                  ))}
                </select>
                <button
                  onClick={() => { setUseJobId(true); setSelectedJobId(""); }}
                  className="mt-2 text-xs text-gray-400 hover:text-gray-700 underline"
                >
                  Don't see your role? Enter Job ID manually
                </button>
              </>
            ) : (
              <>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Job ID
                </label>
                <input
                  value={manualJobId}
                  onChange={(e) => { setManualJobId(e.target.value); setSelectedJobId(""); }}
                  placeholder="Paste Job ID here..."
                  className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/10 bg-gray-50"
                />
                <button
                  onClick={() => { setUseJobId(false); setManualJobId(""); }}
                  className="mt-2 text-xs text-gray-400 hover:text-gray-700 underline"
                >
                  ← Back to job list
                </button>
              </>
            )}

            <button
              onClick={() =>
                handleSendRequest(
                  selectedEmployee._id,
                  selectedCompany?._id || selectedEmployee.company?._id || selectedEmployee.company,
                  selectedJobId || manualJobId,
                )
              }
              disabled={!selectedJobId && !manualJobId}
              className="mt-6 w-full py-3 rounded-xl bg-black text-white font-semibold text-sm hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
            >
              Send Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Companies;