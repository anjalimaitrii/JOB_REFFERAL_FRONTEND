import { useEffect, useState } from "react";
import { getAllCompaniesForAdmin, verifyCompany } from "../../services/company.service";
import { useNavigate } from "react-router-dom";
import { Building2, ChevronLeft, Users } from "lucide-react";

type Company = {
  _id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  otherLocations?: string[];
  companySize: string;
  website: string;
  jobs?: { _id: string; title: string }[];
  isVerified: boolean;
  createdAt: string;
};

function AdminCompanies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "verified">("all");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await getAllCompaniesForAdmin();
      setCompanies(res.data);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      alert("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (companyId: string, status: boolean) => {
    try {
      await verifyCompany(companyId, status);
      alert(`Company ${status ? "approved" : "rejected"} successfully`);
      fetchCompanies(); // Refresh list
    } catch (error) {
      console.error("Failed to verify company:", error);
      alert("Failed to update company status");
    }
  };

  const filteredCompanies = companies.filter((company) => {
    if (filter === "pending") return !company.isVerified;
    if (filter === "verified") return company.isVerified;
    return true;
  });

  const pendingCount = companies.filter((c) => !c.isVerified).length;
  const verifiedCount = companies.filter((c) => c.isVerified).length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <nav className="bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-white" />
            <h1 className="text-lg font-bold tracking-tight text-white uppercase">Company Management</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {/* Filter Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-4">
          <button
            onClick={() => setFilter("all")}
            className={`text-left bg-white rounded-xl p-4 border transition ${filter === "all" ? "border-black shadow-sm" : "border-gray-200 hover:border-gray-900"}`}
          >
            <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-0.5">Total</p>
            <p className="text-2xl font-black text-gray-900">{companies.length}</p>
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`text-left bg-white rounded-xl p-4 border-2 transition ${filter === "pending" ? "border-black shadow-sm" : "border-gray-200 hover:border-gray-900"}`}
          >
            <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-0.5">Pending Approval</p>
            <p className="text-2xl font-black text-gray-900">{pendingCount}</p>
          </button>

          <button
            onClick={() => setFilter("verified")}
            className={`text-left bg-white rounded-xl p-4 border transition ${filter === "verified" ? "border-black shadow-sm" : "border-gray-200 hover:border-gray-900"}`}
          >
            <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-0.5">Verified</p>
            <p className="text-2xl font-black text-gray-900">{verifiedCount}</p>
          </button>
        </div>

        {/* Companies List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mx-auto"></div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl">
            <p className="text-gray-400 uppercase text-sm font-bold tracking-widest italic">No matching companies found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCompanies.map((company) => (
              <div
                key={company._id}
                className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
              >
                {/* LEFT ACCENT BAR */}
                <div
                  className={`absolute left-0 top-0 h-full w-1 ${company.isVerified
                    ? "bg-gradient-to-b from-gray-600 to-gray-400"
                    : "bg-gradient-to-b from-black to-gray-700"
                    }`}
                />

                <div className="flex flex-col md:flex-row gap-6 p-5 pl-8">
                  {/* LEFT CONTENT */}
                  <div className="flex flex-1 gap-6">
                    {/* LOGO */}
                    <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/80/f9fafb/9ca3af?text=LOGO";
                          }}
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    {/* INFO */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold tracking-tight text-gray-900 uppercase">{company.name}</h3>
                        {company.isVerified ? (
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[8px] font-bold uppercase tracking-wider rounded">Verified</span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-black text-white text-[8px] font-bold uppercase tracking-wider rounded">Review</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Industry:</span>
                          <span className="text-[11px] font-bold text-gray-700">{company.industry}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Base:</span>
                          <span className="text-[11px] font-bold text-gray-900">{company.location}</span>
                        </div>
                      </div>

                      {company.otherLocations && company.otherLocations.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-gray-400 text-[8px] font-bold uppercase tracking-widest">Network</span>
                          <div className="flex flex-wrap gap-1">
                            {company.otherLocations.map((loc, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded border border-gray-100 text-[9px] font-bold text-gray-500 bg-gray-50/50">
                                {loc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 pt-3 mt-4 border-t border-gray-100">
                        <div>
                          <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest mb-0.5">Analytics</p>
                          <p className="text-[11px] font-bold text-gray-700">Size: {company.companySize}</p>
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-black underline hover:no-underline">Website</a>
                        </div>
                        <div>
                          <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest mb-0.5">Status</p>
                          <p className="text-[11px]">
                            {company.jobs && company.jobs.length > 0 ? (
                              <span className="font-bold text-gray-900">{company.jobs.length} Active Jobs</span>
                            ) : (
                              <span className="text-gray-400 italic">No listing</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT ACTION PANEL */}
                  <div className="w-full md:w-32 flex flex-col gap-2 justify-center">
                    {!company.isVerified ? (
                      <>
                        <button
                          onClick={() => handleVerify(company._id, true)}
                          className="w-full py-2.5 rounded-lg bg-black text-white text-[9px] font-bold uppercase tracking-wider hover:bg-gray-800 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerify(company._id, false)}
                          className="w-full py-2.5 rounded-lg border border-gray-200 text-gray-500 text-[9px] font-bold uppercase tracking-wider hover:border-black hover:text-black transition"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleVerify(company._id, false)}
                        className="w-full py-2.5 rounded-lg border border-black text-black text-[9px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCompanies;
