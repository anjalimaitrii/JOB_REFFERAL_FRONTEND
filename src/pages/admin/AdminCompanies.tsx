import { useEffect, useState } from "react";
import { getAllCompaniesForAdmin, verifyCompany } from "../../services/company.service";
import { useNavigate } from "react-router-dom";
import { Building2, ChevronLeft, Search, Filter, CheckCircle2, Globe, MapPin } from "lucide-react";
import { motion } from "framer-motion";

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
  const [searchTerm, setSearchTerm] = useState("");

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
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (companyId: string, status: boolean) => {
    try {
      await verifyCompany(companyId, status);
      fetchCompanies(); // Refresh list
    } catch (error) {
      console.error("Failed to verify company:", error);
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesFilter = filter === "all" || (filter === "pending" ? !company.isVerified : company.isVerified);
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = companies.filter((c) => !c.isVerified).length;
  const verifiedCount = companies.filter((c) => c.isVerified).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Building2 className="w-4 h-4" />
            </div>
            <h1 className="text-sm font-bold tracking-tight text-slate-800 uppercase">Company Management</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Total partners"
            count={companies.length}
            isActive={filter === "all"}
            onClick={() => setFilter("all")}
            icon={<Globe className="w-4 h-4" />}
          />
          <StatCard
            label="Pending Approval"
            count={pendingCount}
            isActive={filter === "pending"}
            onClick={() => setFilter("pending")}
            icon={<Filter className="w-4 h-4" />}
            accent="amber"
          />
          <StatCard
            label="Verified Entities"
            count={verifiedCount}
            isActive={filter === "verified"}
            onClick={() => setFilter("verified")}
            icon={<CheckCircle2 className="w-4 h-4" />}
            accent="emerald"
          />
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-[1.2rem] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Companies List */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-2 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="py-20 text-center bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
            <p className="text-slate-400 uppercase text-[10px] font-bold tracking-widest italic">No matching companies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCompanies.map((company, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={company._id}
                className="group bg-gradient-to-br from-white to-slate-100 rounded-[2rem] border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden"
              >
                <div className="flex items-start gap-5 relative z-10">
                  {/* Logo Container */}
                  <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 flex items-center justify-center p-2 shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-500">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="w-8 h-8 text-slate-200" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-slate-800 uppercase truncate">{company.name}</h3>
                      {company.isVerified ? (
                        <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-wider rounded-full border border-emerald-100">Verified</div>
                      ) : (
                        <div className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[8px] font-black uppercase tracking-wider rounded-full border border-amber-100">Pending</div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
                      <div className="flex items-center gap-1.5 ">
                        <span className="text-slate-400 text-[9px] font-bold uppercase">Industry:</span>
                        <span className="text-[11px] font-medium text-slate-600">{company.industry}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-300" />
                        <span className="text-[11px] font-medium text-slate-600">{company.location}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <p className="text-slate-400 text-[8px] font-bold uppercase tracking-widest mb-1">Company size</p>
                        <p className="text-[11px] font-semibold text-slate-700">{company.companySize}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[8px] font-bold uppercase tracking-widest mb-1">Website</p>
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-indigo-600 hover:underline truncate block">Visit site</a>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <div className="text-[10px] font-medium text-slate-400">
                        {/* ID: <span className="uppercase tracking-tighter text-slate-300">#{company._id.slice(-6)}</span> */}
                      </div>
                      <div className="flex gap-2">
                        {!company.isVerified ? (
                          <>
                            <button
                              onClick={() => handleVerify(company._id, true)}
                              className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-700 transition shadow-sm active:scale-95"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleVerify(company._id, false)}
                              className="px-4 py-2 bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition active:scale-95"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleVerify(company._id, false)}
                            className="px-4 py-2 bg-white border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition active:scale-95"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle visual decoration */}
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                  <Building2 size={120} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, count, isActive, onClick, icon, accent = "indigo" }: any) {
  const accents: any = {
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100"
  };

  return (
    <button
      onClick={onClick}
      className={`text-left p-6 rounded-[2rem] border transition-all duration-500 relative overflow-hidden group ${isActive
        ? "bg-white border-slate-200 shadow-xl scale-[1.02]"
        : "bg-slate-50 border-transparent hover:border-slate-200 opacity-70 grayscale hover:grayscale-0"
        }`}
    >
      <div className={`p-2.5 rounded-xl w-fit mb-4 transition-colors ${isActive ? accents[accent] : "bg-slate-200 text-slate-400"}`}>
        {icon}
      </div>
      <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 ${isActive ? "text-slate-400" : "text-slate-400"}`}>{label}</p>
      <p className={`text-3xl font-black tracking-tighter ${isActive ? "text-slate-900" : "text-slate-500"}`}>{count}</p>

      {isActive && (
        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
      )}
    </button>
  );
}

export default AdminCompanies;
