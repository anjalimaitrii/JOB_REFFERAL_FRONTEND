"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeesByCompany } from "../../services/employee.service";
import { getCompanyPosts, type Post } from "../../services/post.service";
import {
  getCollegesWithEmployees,
  getCompanies,
  getEmployeesByCollege,
} from "../../services/company.service";
import { sendRequestToEmployee } from "../../services/request.service";
import HeroHeader from "@/components/companies/HeroHeader";
import CompanyCard from "@/components/companies/CompanyCard";
import EmployeeCard from "@/components/companies/EmployeeCard";
import CollegeCard from "@/components/companies/CollegeCard";
import Feed from "./Feed";
import { X } from "lucide-react";

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
  jobTitle: string;
  _id: string;
  name: string;
  designation: string;
  profilePhoto?: string;
  experience?: string;
};


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
  const [manualJobId, setManualJobId] = useState("");
  const [manualRole, setManualRole] = useState("");
  const [manualDescription, setManualDescription] = useState("");
  const [showRoleInput, setShowRoleInput] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const [detailView, setDetailView] = useState<"feed" | "employees">("employees");
  const [, setCompanyPosts] = useState<Post[]>([]);
  const [, setPostsLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const myCollege =
    user?.education?.find(
      (e: any) => e.level?.toLowerCase() === "graduation"
    )?.institute || "";

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
            combined.push({ type: "employee", id: emp._id, name: emp.name, designation: emp.designation || "Employee", companyName: company.name, data: emp, companyData: company, otherLocations: company.otherLocations || [] });
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
    setDetailView("employees");
    try {
      const res = await getEmployeesByCompany(company._id);
      setEmployees(res.data);
    } catch { console.error("Failed to fetch employees"); }
  };

  useEffect(() => {
    if (selectedCompany && detailView === "feed") {
      const fetchPosts = async () => {
        setPostsLoading(true);
        try {
          const res = await getCompanyPosts(selectedCompany._id);

          let postsData: any[] = [];

          if (Array.isArray(res)) {
            postsData = res;
          } else if (res.data && Array.isArray(res.data)) {
            postsData = res.data;
          } else if (res.posts && Array.isArray(res.posts)) {
            postsData = res.posts;
          } else if (res.data?.posts && Array.isArray(res.data.posts)) {
            postsData = res.data.posts;
          } else if (res && typeof res === 'object') {
            const possibleArray = Object.values(res).find(val => Array.isArray(val));
            if (possibleArray) {
              postsData = possibleArray as any[];
            } else if (res._id || res.id) {
              postsData = [res];
            }
          }

          setCompanyPosts(postsData);
        } catch (error) {
          console.error("Error fetching company posts:", error);
        } finally {
          setPostsLoading(false);
        }
      };
      fetchPosts();
    }
  }, [selectedCompany?._id, detailView]);

  useEffect(() => {
    if (viewMode !== "college") return;
    (async () => {
      try {
        const res = await getCollegesWithEmployees();
        let collegeList = res.data || [];

        if (user?.role === "employee" && myCollege) {
          collegeList = collegeList.filter(
            (c: string) =>
              c.trim().toLowerCase() !== myCollege.trim().toLowerCase()
          );
        }

        setColleges(collegeList);
      }
      catch { setColleges([]); }
    })();
  }, [viewMode]);

  const handleCollegeClick = async (collegeName: string) => {
    setSelectedCollege(collegeName);
    setSelectedCompany(null);

    try {
      const res = await getEmployeesByCollege(collegeName);
      const emps = res.data || [];

      // employees set karo
      setEmployees(emps);


    } catch {
      setEmployees([]);
    }
  };

  const handleSendRequest = async (employeeId: string, companyId: string, role: string, jobId?: string, description?: string) => {
    if (!role && !jobId) { alert("Please enter Job ID or Job Role"); return; }
    try {
      await sendRequestToEmployee({ receiver: employeeId, company: companyId, role: role || "", jobId, description });
      alert("Request sent");
      setManualRole("");
      setManualJobId("");
      setManualDescription("");
      setShowRoleInput(false);
      setShowModal(false);
    } catch (err: any) {
      alert(err.message || "Failed to send request");
    }
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
        detailView={detailView}
        setDetailView={setDetailView}
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
          {isDetailView && (detailView === "employees" ? (
            <EmployeeCard
              isDetailView={isDetailView}
              employees={employees}
              empVisible={empVisible}
              setSelectedEmployee={setSelectedEmployee}
              setShowModal={setShowModal}
              setManualJobId={setManualJobId}
            />
          ) : (
            // <div className="space-y-6 max-w-4xl mx-auto py-10">
            //   {postsLoading ? (
            //     <div className="flex flex-col items-center justify-center py-20 gap-4">
            //       <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
            //       <p className="text-slate-400 font-medium">Loading posts...</p>
            //     </div>
            //   ) : companyPosts.length === 0 ? (
            //     <div className="text-center py-20 bg-white/40 backdrop-blur-md rounded-3xl border border-dashed border-slate-200 shadow-sm">
            //       <p className="text-slate-400">No posts found for this company.</p>
            //     </div>
            //   ) : (
            //     companyPosts.map((post: any, index) => {
            //       // Resolve designation ID to Job Title from company.jobs
            //       const designationId =
            //         typeof post.employee === "object"
            //           ? post.employee?.designation
            //           : post.designation;

            //       const resolvedDesignation =
            //         post.company?.jobs?.find((job: any) => job._id === designationId)?.title ||
            //         "Employee";

            //       return (
            //         <motion.div
            //           key={post._id || index}
            //           initial={{ opacity: 0, y: 20 }}
            //           animate={{ opacity: 1, y: 0 }}
            //           transition={{ delay: index * 0.1 }}
            //           className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-xl relative z-20"
            //         >
            //           <div className="flex items-center gap-3 mb-4">
            //             <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-black font-bold text-lg">
            //               {typeof post.employee === 'object' ? post.employee?.name?.charAt(0) : (post.userName?.charAt(0) || "P")}
            //             </div>
            //             <div>
            //               <h4 className="text-slate-900 font-bold">
            //                 {typeof post.employee === 'object' ? post.employee?.name : (post.userName || "Author")}
            //               </h4>
            //               <p className="text-slate-400 text-xs text-left">
            //                 {resolvedDesignation} • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Just now"}
            //               </p>
            //             </div>
            //           </div>
            //           {post.content && (
            //             <p className="text-slate-700 text-left leading-relaxed whitespace-pre-wrap mb-4 text-sm">
            //               {post.content}
            //             </p>
            //           )}
            //           {post.image && (
            //             <div className="rounded-2xl overflow-hidden border border-slate-100 mb-4">
            //               <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-[400px]" />
            //             </div>
            //           )}
            //           <div className="pt-4 border-t border-slate-50 flex items-center gap-6">
            //             <div className="flex items-center gap-2 text-slate-400">
            //               <Heart className="w-4 h-4" />
            //               <span className="text-xs font-semibold">{post.likes?.length || 0}</span>
            //             </div>
            //             <div className="flex items-center gap-2 text-slate-400">
            //               <MessageSquare className="w-4 h-4" />
            //               <span className="text-xs font-semibold">{post.comments?.length || 0}</span>
            //             </div>
            //           </div>
            //         </motion.div>
            //       );
            //     })
            //   )}
            // </div>
            selectedCompany && <Feed companyId={selectedCompany._id} />
          ))}

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

            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Job ID</label>
              {!showRoleInput && (
                <button 
                  onClick={() => setShowRoleInput(true)}
                  className="text-[10px] font-bold text-amber-500 hover:text-amber-600 transition-colors uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-md"
                >
                  + Add Job Role
                </button>
              )}
            </div>
            <input
              value={manualJobId}
              onChange={(e) => setManualJobId(e.target.value)}
              placeholder="e.g. 123456"
              className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-300 bg-slate-50 transition-all font-mono"
            />

            {showRoleInput && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Job Role</label>
                  <button 
                    onClick={() => { setShowRoleInput(false); setManualRole(""); }}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider"
                  >
                    Remove
                  </button>
                </div>
                <input
                  value={manualRole}
                  onChange={(e) => setManualRole(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-300 bg-slate-50 transition-all"
                />
              </div>
            )}

            <div className="mt-4">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Description <span className="text-slate-300 font-normal lowercase">(Optional)</span></label>
              <textarea
                value={manualDescription}
                onChange={(e) => setManualDescription(e.target.value)}
                placeholder="Briefly describe why you are requesting a referral..."
                rows={3}
                className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-300 bg-slate-50 transition-all resize-none"
              />
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                Please provide the correct Job ID from the company's career portal for faster referral processing. {showRoleInput ? "Job Role helps employee identify the position." : ""}
              </p>
            </div>

            <button
              onClick={() => handleSendRequest(selectedEmployee._id, selectedCompany?._id || selectedEmployee.company?._id || selectedEmployee.company, manualRole, manualJobId, manualDescription)}
              disabled={!manualJobId && !manualRole}
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