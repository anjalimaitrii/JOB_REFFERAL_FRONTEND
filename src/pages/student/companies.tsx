"use client";

import  { useState } from "react";

/* ================= TYPES ================= */
type Company = {
  id: number;
  name: string;
  logo?: string;
  industry?: string;
  location: string;
  otherLocations?: string[];
  companySize?: string;
  website?: string;
};

type Employee = {
  id: number;
  companyId: number;
  name: string;
  role: string;
  rating: number;
  photo?: string;
};

/* ================= DATA ================= */
const companiesData: Company[] = [
  {
    id: 1,
    name: "Google",
    logo: "https://logo.clearbit.com/google.com",
    industry: "Technology",
    location: "Bangalore",
    otherLocations: ["Hyderabad", "Pune"],
    companySize: "1000+",
    website: "https://www.google.com",
  },
  {
    id: 2,
    name: "Amazon",
    logo: "https://logo.clearbit.com/amazon.com",
    industry: "E-commerce",
    location: "Hyderabad",
    otherLocations: ["Bangalore", "Chennai"],
    companySize: "1000+",
    website: "https://www.amazon.jobs",
  },
];

const employeesData: Employee[] = [
  { id: 1, companyId: 1, name: "Rahul Sharma", role: "Frontend Developer", rating: 4.2, photo: "https://randomuser.me/api/portraits/men/32.jpg", },
  { id: 2, companyId: 1, name: "Anjali Verma", role: "Backend Developer", rating: 4.1 , photo: "https://randomuser.me/api/portraits/men/32.jpg",},
  { id: 3, companyId: 2, name: "Neha Gupta", role: "Software Engineer", rating: 3.8, photo: "https://randomuser.me/api/portraits/men/32.jpg", },
  { id: 4, companyId: 2, name: "Rohit Mehta", role: "Cloud Engineer", rating: 4.5, photo: "https://randomuser.me/api/portraits/men/32.jpg", },
];

/* ================= UI ================= */
function Companies() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const companyEmployees = employeesData.filter(
    (emp) => emp.companyId === selectedCompany?.id
  );

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      {/* ================= COMPANY LIST ================= */}
      {!selectedCompany && (
        <>
          <h1 className="text-3xl font-bold text-center mb-8">Companies</h1>

          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
                  <th className="p-4">Company</th>
                  <th className="p-4">Industry</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">Website</th>
                </tr>
              </thead>

              <tbody>
                {companiesData.map((company) => (
                  <tr
                    key={company.id}
                    onClick={() => setSelectedCompany(company)}
                    className="cursor-pointer border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-8 h-8 object-contain"
                      />
                      <span className="font-medium">{company.name}</span>
                    </td>

                    <td className="p-4 text-gray-600">
                      {company.industry || "-"}
                    </td>

                    <td className="p-4 text-gray-600">
                      {company.location}
                      {company.otherLocations && (
                        <span className="text-xs text-gray-400">
                          {" "}
                          +{company.otherLocations.length} more
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-gray-600">
                      {company.companySize || "-"}
                    </td>

                    <td
                      className="p-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ================= EMPLOYEES ================= */}
      {selectedCompany && (
        <>
          <button
            onClick={() => setSelectedCompany(null)}
            className="mb-6 text-blue-600 font-medium"
          >
            ← Back to Companies
          </button>

          <h1 className="text-3xl font-bold text-center mb-8">
            {selectedCompany.name} Employees
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {companyEmployees.map((emp) => (
             <div
  key={emp.id}
  className="bg-white rounded-2xl p-5 shadow hover:shadow-xl transition"
>
  {/* PROFILE */}
  <div className="flex items-center gap-4">
    {emp.photo ? (
      <img
        src={emp.photo}
        alt={emp.name}
        className="w-12 h-12 rounded-full object-cover"
      />
    ) : (
      <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
        {emp.name[0]}
      </div>
    )}

    <div>
      <p className="font-semibold text-lg">{emp.name}</p>
      <p className="text-gray-500 text-sm">{emp.role}</p>
    </div>
  </div>

  {/* RATING */}
  <div className="mt-3 text-yellow-500">
    ⭐ {emp.rating}
  </div>

  {/* ACTION */}
  <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg">
    Send Referral Request
  </button>
</div>

            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Companies;
