import { Building2, MapPin, Globe, Briefcase, ChevronRight } from "lucide-react";

type Props = {
    viewMode: "company" | "college";
    selectedCompany: any;
    visibleCompanies: any[];
    companyVisible: boolean[];
    handleCompanyClick: (company: any) => Promise<void>;
};


function CompanyCard({
    viewMode,
    selectedCompany,
    visibleCompanies,
    companyVisible,
    handleCompanyClick,
}: Props) {
    return (
        <div>
            {viewMode === "company" && !selectedCompany && (
                <>
                    <p className="text-[11px] text-slate-400 font-semibold mb-6 uppercase tracking-[3px]">
                        {visibleCompanies.length} Companies
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-5">
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
        </div>
    )
}

export default CompanyCard