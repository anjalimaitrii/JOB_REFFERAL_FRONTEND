import { Users } from "lucide-react";

type Employee = {
    _id: string;
    name: string;
    designation: string;
    profilePhoto?: string;
    experience?: string;
};
type Props = {
    isDetailView: boolean;
    employees: Employee[];
    empVisible: boolean[];
    setSelectedEmployee: (emp: Employee) => void;
    setShowModal: (value: boolean) => void;
    setManualJobId: (value: string) => void;
};

const EmployeeCard = ({ isDetailView,
    employees,
    empVisible,
    setSelectedEmployee,
    setShowModal,
    setManualJobId }: Props) => {
    return (
        <div>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-5">
                            {employees.map((emp, i) => {
                                const jobTitle = emp.designation || (emp as any).jobTitle || "Employee";
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
                                                onClick={() => { setSelectedEmployee(emp); setShowModal(true); setManualJobId(""); }}
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
    )
}

export default EmployeeCard 