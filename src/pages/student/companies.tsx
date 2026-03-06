"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeesByCompany } from "../../services/employee.service";
import {
  getCollegesWithEmployees,
  getCompanies,
  getEmployeesByCollege,
} from "../../services/company.service";
import {
  ArrowLeft,
  Search,
  Building2,
  GraduationCap,
  MapPin,
  Globe,
  Users,
  X,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { sendRequestToEmployee } from "../../services/request.service";
import HeroHeader from "@/components/companies/HeroHeader";
import CompanyCard from "@/components/companies/CompanyCard";
import EmployeeCard from "@/components/companies/EmployeeCard";
import CollegeCard from "@/components/companies/CollegeCard";

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

const FILTERS = ["All", "Remote", "Bengaluru", "Hyderabad", "Startup", "MNC", "Product"];

// Staggered animation hook
function useStaggeredVisible(count: number, delay = 60) {
  const [visible, setVisible] = useState<boolean[]>(Array(count).fill(false));
  useEffect(() => {
    setVisible(Array(count).fill(false));
    const timers = Array.from({ length: count }, (_, i) =>
      setTimeout(() => {
        setVisible((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 80 + i * delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [count, delay]);
  return visible;
}

function Companies() {
  const navigate = useNavigate();
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
  const [pageVisible, setPageVisible] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const myCompanyId =
    typeof user?.company === "object"
      ? String(user?.company?._id)
      : String(user?.company || "");

  const visibleCompanies = companies.filter((c) => {
    if (!myCompanyId) return true;
    return String(c._id) !== myCompanyId;
  });

  const [viewMode, setViewMode] = useState<"company" | "college">("company");
  const [colleges, setColleges] = useState<string[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchData, setSearchData] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");

  const companyVisible = useStaggeredVisible(visibleCompanies.length, 55);
  const collegeVisible = useStaggeredVisible(colleges.length, 55);
  const empVisible = useStaggeredVisible(employees.length, 50);


  useEffect(() => {
    const t = setTimeout(() => setPageVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        const allCompanies = data.data;
        setCompanies(allCompanies);
        let combined: any[] = [];
        for (let company of allCompanies) {
          combined.push({ type: "company", id: company._id, name: company.name, industry: company.industry, location: company.location, data: company });
          const empRes = await getEmployeesByCompany(company._id);
          const emps = empRes.data;
          for (let emp of emps) {
            const jobTitle = company.jobs?.find((job: any) => job._id === emp.designation)?.title;
            combined.push({ type: "employee", id: emp._id, name: emp.name, designation: jobTitle || "Employee", companyName: company.name, data: emp, companyData: company, otherLocations: company.otherLocations || [] });
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
    if (!searchTerm.trim()) { setFilteredResults([]); return; }
    const term = searchTerm.toLowerCase();
    setFilteredResults(searchData.filter((item) =>
      item.name?.toLowerCase().includes(term) ||
      item.industry?.toLowerCase().includes(term) ||
      item.location?.toLowerCase().includes(term) ||
      item.designation?.toLowerCase().includes(term) ||
      item.companyName?.toLowerCase().includes(term) ||
      (item.otherLocations?.some((loc: string) => loc.toLowerCase().includes(term)))
    ));
  }, [searchTerm, searchData]);

  const handleCompanyClick = async (company: Company) => {
    setSelectedCompany(company);
    setSelectedCollege(null);
    try {
      const res = await getEmployeesByCompany(company._id);
      setEmployees(res.data);
    } catch { console.error("Failed to fetch employees"); }
  };

  useEffect(() => {
    if (viewMode !== "college") return;
    (async () => {
      try { const res = await getCollegesWithEmployees(); setColleges(res.data || []); }
      catch { setColleges([]); }
    })();
  }, [viewMode]);

  const handleCollegeClick = async (collegeName: string) => {
    setSelectedCollege(collegeName);
    setSelectedCompany(null);
    try { const res = await getEmployeesByCollege(collegeName); setEmployees(res.data || []); }
    catch { setEmployees([]); }
  };

  const handleSendRequest = async (employeeId: string, companyId: string, role: string) => {
    if (!role) { alert("Please select a job or enter Job ID"); return; }
    try {
      await sendRequestToEmployee({ receiver: employeeId, company: companyId, role });
      alert("Request sent");
      setShowModal(false);
    } catch { alert("Failed to send request"); }
  };

  const goBack = () => {
    if (selectedCompany || selectedCollege) {
      setSelectedCompany(null);
      setSelectedCollege(null);
      setEmployees([]);
    } else {
      navigate("/student/dashboard");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 border-[3px] border-slate-100 rounded-full" />
          <div className="w-14 h-14 border-[3px] border-t-amber-400 border-r-amber-400 rounded-full animate-spin absolute inset-0" />
        </div>
        <p className="text-slate-400 text-sm font-light tracking-wide">Loading companies...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );

  const isDetailView = !!(selectedCompany || selectedCollege);

  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{ opacity: pageVisible ? 1 : 0, transform: pageVisible ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}
    >


      {/* ════ HERO HEADER ════ */}

      <HeroHeader
        visibleCompanies={visibleCompanies.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredResults={filteredResults}
        setFilteredResults={setFilteredResults}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        handleCompanyClick={handleCompanyClick}
        viewMode={viewMode}
        setViewMode={setViewMode}
        goBack={goBack}
        selectedCompany={selectedCompany}
        selectedCollege={selectedCollege}
        employees={employees}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}

      />

      {/* ════ CONTENT AREA ════ */}
      <div
        className="relative min-h-[60vh]"
        style={{
          background: "linear-gradient(160deg, #f8f7ff 0%, #fffbf0 40%, #f0f9ff 100%)",
        }}
      >
        {/* Soft decorative blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #FFC300 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-8">

          {/* ── COMPANY CARDS ── */}

          <CompanyCard
            viewMode={viewMode}
            selectedCompany={selectedCompany}
            visibleCompanies={visibleCompanies}
            companyVisible={companyVisible}
            handleCompanyClick={handleCompanyClick}
          />
          {/* ── COLLEGE LIST ── */}
          <CollegeCard
            viewMode={viewMode}
            selectedCollege={selectedCollege}
            colleges={colleges}
            collegeVisible={collegeVisible}
            handleCollegeClick={handleCollegeClick}
          />

          {/* ── EMPLOYEES DETAIL VIEW ── */}
          <EmployeeCard
            isDetailView={isDetailView}
            employees={employees}
            empVisible={empVisible}
            selectedCompany={selectedCompany}
            setSelectedEmployee={setSelectedEmployee}
            setShowModal={setShowModal}
            setUseJobId={setUseJobId}
            setSelectedJobId={setSelectedJobId}
            setManualJobId={setManualJobId}
          />

        </div>
      </div>

      {/* ════ MODAL ════ */}
      {showModal && selectedEmployee && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={() => setShowModal(false)}
          style={{ animation: "fadeIn 0.2s ease" }}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl p-6 w-full sm:max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "slideUp 0.3s cubic-bezier(0.23, 1, 0.32, 1)" }}
          >
            {/* Handle bar for mobile */}
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5 sm:hidden" />

            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Send Referral Request</h3>
                <p className="text-xs text-slate-400 font-light mt-0.5">to <span className="text-slate-600 font-medium">{selectedEmployee.name}</span></p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {!useJobId ? (
              <>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Select Job Role</label>
                <select
                  value={selectedJobId}
                  onChange={(e) => { setSelectedJobId(e.target.value); setManualJobId(""); }}
                  className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-300 bg-slate-50 transition-all"
                >
                  <option value="">— Choose a role —</option>
                  {selectedCompany?.jobs?.map((job) => (
                    <option key={job._id} value={job._id}>{job.title}</option>
                  ))}
                </select>
                <button onClick={() => { setUseJobId(true); setSelectedJobId(""); }} className="mt-2 text-xs text-slate-400 hover:text-amber-500 underline transition-colors">
                  Don't see your role? Enter Job ID manually
                </button>
              </>
            ) : (
              <>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Job ID</label>
                <input
                  value={manualJobId}
                  onChange={(e) => { setManualJobId(e.target.value); setSelectedJobId(""); }}
                  placeholder="Paste Job ID here..."
                  className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-300 bg-slate-50 transition-all"
                />
                <button onClick={() => { setUseJobId(false); setManualJobId(""); }} className="mt-2 text-xs text-slate-400 hover:text-amber-500 underline transition-colors">
                  ← Back to job list
                </button>
              </>
            )}

            <button
              onClick={() => handleSendRequest(selectedEmployee._id, selectedCompany?._id || selectedEmployee.company?._id || selectedEmployee.company, selectedJobId || manualJobId)}
              disabled={!selectedJobId && !manualJobId}
              className="mt-5 w-full py-3.5 rounded-xl bg-black text-white font-semibold text-sm hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-200"
            >
              Send Request
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes heroParticle {
          0%   { transform: translateY(0) scale(0);   opacity: 0; }
          10%  { opacity: 0.85; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(-130px) scale(1.5); opacity: 0; }
        }
      `}</style>

    </div>
  );
}

export default Companies;