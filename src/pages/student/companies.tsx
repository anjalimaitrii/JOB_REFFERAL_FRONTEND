"use client";

import  { useEffect, useState } from "react";
import { getEmployeesByCompany } from "../../services/employee.service";
import { getCompanies } from "../../services/company.service";
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
};

type Employee = {
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

  /* ================= COMPANY CLICK ================= */
  const handleCompanyClick = async (company: Company) => {
    setSelectedCompany(company);

    try {
      const res = await getEmployeesByCompany(company._id);
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading companies...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }
  const handleSendRequest = async (employeeId: string) => {
    try {
      await sendRequestToEmployee(employeeId);
      alert("Request sent successfully");
    } catch (error) {
      alert("Failed to send request");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      {!selectedCompany && (
        <h1 className="text-3xl font-bold text-center mb-8">Companies</h1>
      )}
      {/* ================= COMPANIES TABLE ================= */}
      {!selectedCompany && (
        <div className="max-w-8xl mx-auto bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
                <th className="p-4">Logo</th>
                <th className="p-4">Company</th>
                <th className="p-4">Industry</th>
                <th className="p-4">Location</th>
                <th className="p-4">Size</th>
                <th className="p-4">Website</th>
              </tr>
            </thead>

            <tbody>
              {companies.map((company) => (
                <tr
                  key={company._id}
                  onClick={() => handleCompanyClick(company)}
                  className="cursor-pointer border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={company.logo}
                      className="w-8 h-8 object-contain"
                    />
                  </td>
                  <td className="p-4 text-gray-600">{company.name || "-"}</td>

                  <td className="p-4 text-gray-600">
                    {company.industry || "-"}
                  </td>

                  <td className="p-4 text-gray-600">{company.location}</td>

                  <td className="p-4 text-gray-600">
                    {company.companySize || "-"}
                  </td>

                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        className="text-blue-600 hover:underline"
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

      {/* ================= EMPLOYEES SECTION ================= */}
      {selectedCompany && (
        <div className="mt-12">
          <button
            onClick={() => {
              setSelectedCompany(null);
              setEmployees([]);
            }}
            className="mb-4 text-sm text-gray hover:underline"
          >
            <ChevronsLeft size={18} />
          </button>
          <h2 className="text-2xl font-semibold text-center mb-6">
            {selectedCompany.name} Employees
          </h2>

          {employees.length === 0 ? (
            <p className="text-center text-gray-500">
              No employees found for this company
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-w-8xl mx-auto">
              {employees.map((emp) => (
                <div
                  key={emp._id}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {/* TOP SECTION */}
                  <div className="flex items-center gap-4">
                    {emp.profilePhoto ? (
                      <img
                        src={emp.profilePhoto}
                        alt={emp.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-semibold">
                        {emp.name[0]}
                      </div>
                    )}

                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {emp.name}
                      </p>
                      <p className="text-sm text-gray-500">{emp.designation}</p>
                    </div>
                  </div>

                  {/* DIVIDER */}
                  <div className="my-4 border-t" />

                  {/* BOTTOM SECTION */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Experience
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        {emp.experience ? `${emp.experience} Years` : "Fresher"}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSendRequest(emp._id)}
                      className="px-4 py-1.5 text-sm rounded-full bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100 transition"
                    >
                      Send Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Companies;
