"use client";

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeesByCompany } from "../../services/employee.service";
import {
  getCollegesWithEmployees,
  getCompanies,
  getEmployeesByCollege,
} from "../../services/company.service";
import {
  ArrowLeft,
  ChevronsLeft,
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

  // Page mount animation
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

      {/* ════════════════════════════════════════
          HERO HEADER
      ════════════════════════════════════════ */}
      <div
        id="hero-header"
        className="relative overflow-hidden bg-black"
        onMouseMove={(e) => {
          const el = document.getElementById("hero-header");
          const glow = document.getElementById("hero-mouse-glow");
          if (!el || !glow) return;
          const r = el.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
          const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
          glow.style.background = `radial-gradient(ellipse 60% 90% at ${x}% ${y}%, rgba(255,195,0,0.20) 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 80% 20%, rgba(255,120,0,0.10) 0%, transparent 50%), radial-gradient(ellipse 30% 50% at 20% 80%, rgba(80,40,255,0.07) 0%, transparent 50%)`;
        }}
      >
        {/* Mouse-tracking gradient glow */}
        <div id="hero-mouse-glow" className="absolute inset-0 pointer-events-none transition-all duration-75" style={{ background: "radial-gradient(ellipse 60% 90% at 50% 40%, rgba(255,195,0,0.18) 0%, transparent 60%)" }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        {/* Floating golden particles */}
        {[
          { l: "8%",  d: 3.2, delay: 0,   c: "#FFC300", s: 5 },
          { l: "20%", d: 4.5, delay: 0.8, c: "#FF8C00", s: 7 },
          { l: "38%", d: 3.8, delay: 1.5, c: "#FFC300", s: 4 },
          { l: "55%", d: 5.0, delay: 0.3, c: "#FF8C00", s: 6 },
          { l: "70%", d: 3.4, delay: 1.1, c: "#FFC300", s: 5 },
          { l: "85%", d: 4.2, delay: 0.6, c: "#FF8C00", s: 8 },
          { l: "93%", d: 3.6, delay: 1.9, c: "#FFC300", s: 4 },
        ].map((p, i) => (
          <div key={i} className="absolute bottom-0 rounded-full pointer-events-none"
            style={{ left: p.l, width: p.s, height: p.s, background: p.c, opacity: 0,
              animation: `heroParticle ${p.d}s linear ${p.delay}s infinite` }}
          />
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-8">

          {/* Back arrow row */}
          <button
            onClick={goBack}
            className="group flex items-center gap-2 text-white/50 hover:text-white transition-all duration-200 mb-6"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-200">
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            </span>
          </button>

          {/* Title block */}
          {!isDetailView ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[2.5px] uppercase text-amber-400">
                  <span className="w-5 h-px bg-amber-400 inline-block" />
                  {visibleCompanies.length}+ Companies Available
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
                Find Your <span className="text-amber-400">Referrer</span>
              </h1>
              <p className="text-white/40 text-sm font-light max-w-md">
                Browse companies, discover college alumni, and get referred directly — skip the application queue.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {selectedCompany?.logo ? (
                <img src={selectedCompany.logo} className="w-12 h-12 rounded-xl object-contain bg-white/10 border border-white/10 p-1.5" alt={selectedCompany.name} />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-xl font-bold text-amber-400">
                  {(selectedCompany?.name || selectedCollege || "?").charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {selectedCompany ? selectedCompany.name : selectedCollege}
                </h1>
                <p className="text-white/40 text-sm font-light mt-0.5">
                  {employees.length} employee{employees.length !== 1 ? "s" : ""} open to refer
                </p>
              </div>
            </div>
          )}

          {/* Search + Toggle row — only in list view */}
          {!isDetailView && (
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <div className="flex items-center gap-3 bg-white/8 border border-white/10 rounded-xl px-4 py-3 focus-within:bg-white/12 focus-within:border-amber-400/40 transition-all backdrop-blur-sm">
                  <Search className="w-4 h-4 text-white/30 shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Search company, role, location..."
                    className="flex-1 outline-none bg-transparent text-sm text-white placeholder-white/25"
                  />
                  {searchTerm && (
                    <button onClick={() => { setSearchTerm(""); setFilteredResults([]); }} className="text-white/30 hover:text-white/60 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Suggestions */}
                {showSuggestions && searchTerm && filteredResults.length > 0 && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto z-50">
                    {filteredResults.slice(0, 10).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => { if (item.type === "company") handleCompanyClick(item.data); else handleCompanyClick(item.companyData); setSearchTerm(""); setShowSuggestions(false); }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-amber-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                      >
                        {item.type === "company" ? (
                          <>
                            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 border border-amber-100">
                              <Building2 className="w-4 h-4 text-amber-500" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                              <p className="text-xs text-slate-400">{item.industry} · {item.location}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-sm font-bold text-slate-600">
                              {item.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                              <p className="text-xs text-slate-400">{item.designation} · {item.companyName}</p>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {showSuggestions && searchTerm && filteredResults.length === 0 && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 px-4 py-5 text-center text-slate-400 text-sm">
                    No results for "<span className="text-slate-700 font-medium">{searchTerm}</span>"
                  </div>
                )}
              </div>

              {/* Toggle */}
              <div className="inline-flex bg-white/8 border border-white/10 rounded-xl p-1 gap-1 self-start sm:self-auto backdrop-blur-sm">
                <button
                  onClick={() => setViewMode("company")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${viewMode === "company" ? "bg-amber-400 text-black shadow-sm" : "text-white/50 hover:text-white"}`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Companies
                </button>
                <button
                  onClick={() => setViewMode("college")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${viewMode === "college" ? "bg-amber-400 text-black shadow-sm" : "text-white/50 hover:text-white"}`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  Colleges
                </button>
              </div>
            </div>
          )}

          {/* Filter chips — company view only */}
          {!isDetailView && viewMode === "company" && (
            <div className="flex flex-wrap gap-2 mt-4">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                    activeFilter === f
                      ? "bg-amber-400 text-black border-amber-400"
                      : "border-white/15 text-white/40 hover:border-white/30 hover:text-white/70"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════
          CONTENT AREA
      ════════════════════════════════════════ */}
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
        {viewMode === "company" && !selectedCompany && (
          <>
            <p className="text-[11px] text-slate-400 font-semibold mb-6 uppercase tracking-[3px]">
              {visibleCompanies.length} Companies
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {visibleCompanies.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-24 text-slate-300">
                  <Building2 className="w-14 h-14 mb-4 opacity-30" />
                  <p className="text-sm font-medium text-slate-500">No companies yet</p>
                </div>
              ) : (
                visibleCompanies.map((company, i) => (
                  <div
                    key={company._id}
                    onClick={() => handleCompanyClick(company)}
                    className="relative rounded-2xl cursor-pointer group overflow-hidden"
                    style={{
                      opacity: companyVisible[i] ? 1 : 0,
                      transform: companyVisible[i] ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
                      transition: `opacity 0.45s ease ${i * 0.05}s, transform 0.45s cubic-bezier(0.23,1,0.32,1) ${i * 0.05}s`,
                    }}
                  >
                    {/* Card background with hover glow */}
                    <div className="absolute inset-0 rounded-2xl bg-white border border-slate-100/80 shadow-sm group-hover:shadow-xl transition-shadow duration-300" />
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "linear-gradient(135deg, rgba(255,195,0,0.04) 0%, rgba(255,140,0,0.02) 100%)" }} />
                    {/* Amber left border accent on hover */}
                    <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:top-2 group-hover:bottom-2" />

                    <div className="relative z-10 p-5 transition-transform duration-300 group-hover:-translate-y-0.5">
                      {/* Logo + Name */}
                      <div className="flex items-center gap-3 mb-4">
                        {company.logo ? (
                          <div className="w-12 h-12 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                            <img src={company.logo} alt={company.name} className="w-10 h-10 object-contain" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-amber-500 shadow-sm group-hover:shadow-md transition-all duration-300"
                            style={{ background: "linear-gradient(135deg, #fff7e0 0%, #ffedd5 100%)", border: "1px solid #fde68a" }}>
                            {company.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate group-hover:text-amber-600 text-sm transition-colors duration-200">{company.name}</p>
                          <p className="text-xs text-slate-400 truncate font-light mt-0.5">{company.industry || "—"}</p>
                        </div>
                      </div>

                      {/* Chips */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100 group-hover:border-amber-100 group-hover:bg-amber-50/50 transition-colors duration-200">
                          <MapPin className="w-3 h-3" />{company.location}
                        </span>
                        {company.jobs?.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100 group-hover:border-amber-100 group-hover:bg-amber-50/50 transition-colors duration-200">
                            <Briefcase className="w-3 h-3" />{company.jobs.length} {company.jobs.length === 1 ? "role" : "roles"}
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-50 group-hover:border-amber-100/60 transition-colors duration-200">
                        {company.website ? (
                          <a href={company.website} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs text-amber-500 hover:text-amber-600 transition-colors">
                            <Globe className="w-3 h-3" /> Website
                          </a>
                        ) : <span />}
                        <span className="flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-amber-500 transition-colors duration-200">
                          View <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* ── COLLEGE LIST ── */}
        {viewMode === "college" && !selectedCollege && (
          <>
            <p className="text-[11px] text-slate-400 font-semibold mb-6 uppercase tracking-[3px]">
              {colleges.length} Colleges
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {colleges.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-24 text-slate-300">
                  <GraduationCap className="w-14 h-14 mb-4 opacity-30" />
                  <p className="text-sm font-medium text-slate-500">No colleges found</p>
                  <p className="text-xs text-slate-400 font-light mt-1">Alumni data will appear here</p>
                </div>
              ) : (
                colleges.map((college, i) => (
                  <div
                    key={college}
                    onClick={() => handleCollegeClick(college)}
                    className="relative rounded-2xl cursor-pointer group overflow-hidden"
                    style={{
                      opacity: collegeVisible[i] ? 1 : 0,
                      transform: collegeVisible[i] ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
                      transition: `opacity 0.45s ease ${i * 0.05}s, transform 0.45s cubic-bezier(0.23,1,0.32,1) ${i * 0.05}s`,
                    }}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-white border border-slate-100/80 shadow-sm group-hover:shadow-xl transition-shadow duration-300" />
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "linear-gradient(135deg, rgba(255,195,0,0.04) 0%, rgba(255,140,0,0.02) 100%)" }} />
                    <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:top-2 group-hover:bottom-2" />

                    <div className="relative z-10 p-5 flex items-center gap-4 transition-transform duration-300 group-hover:-translate-y-0.5">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                        style={{ background: "linear-gradient(135deg, #fff7e0 0%, #ffedd5 100%)", border: "1px solid #fde68a" }}>
                        <GraduationCap className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800 truncate group-hover:text-amber-600 text-sm transition-colors duration-200">{college}</p>
                        <p className="text-xs text-slate-400 font-light mt-0.5 flex items-center gap-1">
                          View alumni <ChevronRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* ── EMPLOYEES DETAIL VIEW ── */}
        {isDetailView && (
          <>
            <p className="text-[11px] text-slate-400 font-semibold mb-6 uppercase tracking-[3px]">
              {employees.length} Employees
            </p>
            {employees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-300">
                <Users className="w-14 h-14 mb-4 opacity-30" />
                <p className="text-sm font-medium text-slate-500">No employees found</p>
                <p className="text-xs text-slate-400 font-light mt-1">Try a different company or college</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {employees.map((emp, i) => {
                  const jobTitle = selectedCompany?.jobs.find((job) => job._id === emp.designation)?.title;
                  return (
                    <div
                      key={emp._id}
                      className="relative rounded-2xl group overflow-hidden"
                      style={{
                        opacity: empVisible[i] ? 1 : 0,
                        transform: empVisible[i] ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
                        transition: `opacity 0.45s ease ${i * 0.05}s, transform 0.45s cubic-bezier(0.23,1,0.32,1) ${i * 0.05}s`,
                      }}
                    >
                      <div className="absolute inset-0 rounded-2xl bg-white border border-slate-100/80 shadow-sm group-hover:shadow-xl transition-shadow duration-300" />
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: "linear-gradient(135deg, rgba(255,195,0,0.04) 0%, rgba(255,140,0,0.02) 100%)" }} />
                      <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:top-2 group-hover:bottom-2" />

                      <div className="relative z-10 p-5 transition-transform duration-300 group-hover:-translate-y-0.5">
                        <div className="flex items-center gap-3 mb-4">
                          {emp.profilePhoto ? (
                            <img src={emp.profilePhoto} alt={emp.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 group-hover:border-amber-200 transition-colors duration-200" />
                          ) : (
                            <div className="w-12 h-12 rounded-full text-white flex items-center justify-center text-lg font-bold shrink-0 shadow-sm"
                              style={{ background: "linear-gradient(135deg, #374151 0%, #111827 100%)" }}>
                              {emp.name?.charAt(0) || "?"}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate text-sm group-hover:text-slate-900">{emp.name}</p>
                            <p className="text-xs text-amber-500 font-medium truncate mt-0.5">{jobTitle || "Employee"}</p>
                            <p className="text-xs text-slate-400 font-light mt-0.5">{emp.experience ? `${emp.experience} yrs exp` : "Fresher"}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => { setSelectedEmployee(emp); setShowModal(true); setUseJobId(false); setSelectedJobId(""); setManualJobId(""); }}
                          className="w-full py-2.5 rounded-xl text-xs font-semibold active:scale-95 transition-all duration-200 relative overflow-hidden"
                          style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)", color: "white" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #FFC300 0%, #FF8C00 100%)"; (e.currentTarget as HTMLButtonElement).style.color = "#000"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)"; (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
                        >
                          Send Request
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

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