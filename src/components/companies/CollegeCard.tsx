import { GraduationCap, ChevronRight } from "lucide-react";
type Props = {
    viewMode: "company" | "college";
    selectedCollege: string | null;
    colleges: string[];
    collegeVisible: boolean[];
    handleCollegeClick: (college: string) => void;
};
const CollegeCard = ({ viewMode, selectedCollege, colleges, collegeVisible, handleCollegeClick }: Props) => {
    return (
        <div>
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
        </div>
    )
}

export default CollegeCard