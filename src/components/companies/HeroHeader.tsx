import { ChevronsLeft, Search, X, Building2, GraduationCap } from "lucide-react";


type Props = {
    visibleCompanies: number;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    setFilteredResults: (value: any[]) => void;
    filteredResults: any[];
    showSuggestions: boolean;
    setShowSuggestions: (value: boolean) => void;
    handleCompanyClick: (company: any) => void;
    viewMode: "company" | "college";
    setViewMode: (mode: "company" | "college") => void;
    goBack: () => void;
    selectedCompany: any;
    selectedCollege: string | null;
    employees: any[];
    activeFilter: string;
    setActiveFilter: (value: string) => void;
    detailView: "feed" | "employees";
    setDetailView: (view: "feed" | "employees") => void;
};


const HeroHeader = ({
    visibleCompanies,
    searchTerm,
    setSearchTerm,
    filteredResults,
    showSuggestions,
    setShowSuggestions,
    handleCompanyClick,
    viewMode,
    setViewMode,
    goBack,
    selectedCompany,
    selectedCollege,
    employees,
    setFilteredResults,
    detailView,
    setDetailView
}: Props) => {
    const isDetailView = !!(selectedCompany || selectedCollege);
    return (
        <div>
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
                    { l: "8%", d: 3.2, delay: 0, c: "#FFC300", s: 5 },
                    { l: "20%", d: 4.5, delay: 0.8, c: "#FF8C00", s: 7 },
                    { l: "38%", d: 3.8, delay: 1.5, c: "#FFC300", s: 4 },
                    { l: "55%", d: 5.0, delay: 0.3, c: "#FF8C00", s: 6 },
                    { l: "70%", d: 3.4, delay: 1.1, c: "#FFC300", s: 5 },
                    { l: "85%", d: 4.2, delay: 0.6, c: "#FF8C00", s: 8 },
                    { l: "93%", d: 3.6, delay: 1.9, c: "#FFC300", s: 4 },
                ].map((p, i) => (
                    <div key={i} className="absolute bottom-0 rounded-full pointer-events-none"
                        style={{
                            left: p.l, width: p.s, height: p.s, background: p.c, opacity: 0,
                            animation: `heroParticle ${p.d}s linear ${p.delay}s infinite`
                        }}
                    />
                ))}

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-8">

                    {/* Back arrow row */}
                    <button
                        onClick={goBack}
                        className="group flex items-center gap-2 text-white/50 hover:text-white transition-all duration-200 mb-6"
                    >
                        <span className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-200">
                            <ChevronsLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                        </span>
                    </button>

                    {/* Title block */}
                    {!isDetailView ? (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[2.5px] uppercase text-amber-400">
                                    <span className="w-5 h-px bg-amber-400 inline-block" />
                                    {visibleCompanies}+ Companies Available
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
                        <>
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

                            {/* Detail View Filters: Post & Emp */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {selectedCompany && (
                                    <button
                                        onClick={() => setDetailView("feed")}
                                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${detailView === "feed"
                                            ? "bg-amber-400 text-black border-amber-400"
                                            : "border-white/15 text-white/40 hover:border-white/30 hover:text-white/70"
                                            }`}
                                    >
                                        Post
                                    </button>
                                )}
                                <button
                                    onClick={() => setDetailView("employees")}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${detailView === "employees"
                                        ? "bg-amber-400 text-black border-amber-400"
                                        : "border-white/15 text-white/40 hover:border-white/30 hover:text-white/70"
                                        }`}
                                >
                                    Emp
                                </button>
                            </div>
                        </>
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



                </div>
            </div>
        </div >
    );
};

export default HeroHeader;
