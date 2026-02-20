"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import { getMySentRequests, sendRequestToEmployee } from "../../services/request.service";
import { getAllEmployees } from "../../services/employee.service";


interface Employee {
  _id: string;
  name: string;
  designation: string;
  profilePhoto?: string;
   company: {
    _id: string;
    name: string;
    jobs: any[];
  };
  role: string;
  education: {
    level: string;
    institute: string;
  }[];
  
}

const VISIBLE = 2;



export default function Alumni() {
  const [current, setCurrent] = useState(0);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const maxIndex = Math.max(0, employees.length - VISIBLE);
  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(maxIndex, c + 1));
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  
  

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getAllEmployees();
        setEmployees(res.data || []);
      } catch (err) {
        console.error("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);
  useEffect(() => {
  const fetchSentRequests = async () => {
    try {
      const res = await getMySentRequests();

      const receiverIds = res.data.map(
        (req: any) => String(req.receiver._id)
      );

      setSentRequests(receiverIds);
    } catch (err) {
      console.error("Failed to fetch sent requests");
    }
  };

  fetchSentRequests();
}, []);

  if (loading) {
    return <div className="text-center py-10">Loading alumni...</div>;
  }

  return (
    <section className="mt-12 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div
          className="rounded-3xl overflow-hidden flex min-h-[340px]"
          style={{
            background: "linear-gradient(135deg, #0f1923 0%, #1a2535 100%)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          }}
        >
          {/* LEFT PANEL */}
          <div className="flex flex-col justify-between p-8 sm:p-10 shrink-0 w-[220px] sm:w-[260px] relative">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 120% 80% at -10% 80%, rgba(255,195,0,0.12) 0%, transparent 60%)",
              }}
            />

            <div className="relative z-10">
              <p className="text-[10px] font-bold tracking-[3px] uppercase text-amber-400 mb-3">
                Network
              </p>

              <div
                className="text-7xl font-black leading-none mb-2 select-none"
                style={{
                  color: "rgba(255,195,0,0.20)",
                  fontFamily: "Georgia, serif",
                }}
              >
                "
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                Alumni open
                <br />
                to refer
              </h3>

              <p className="text-white/35 text-xs font-light mt-2 leading-relaxed">
                Connect directly with seniors at your dream companies.
              </p>
            </div>

            {/* ARROWS */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <motion.button
                  onClick={prev}
                  disabled={current === 0}
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200"
                  style={{
                    borderColor:
                      current === 0
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(255,195,0,0.5)",
                    background:
                      current === 0
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(255,195,0,0.12)",
                    color: current === 0 ? "rgba(255,255,255,0.2)" : "#FFC300",
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>

                <motion.button
                  onClick={next}
                  disabled={current >= maxIndex}
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200"
                  style={{
                    borderColor:
                      current >= maxIndex
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(255,195,0,0.5)",
                    background:
                      current >= maxIndex
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(255,195,0,0.12)",
                    color:
                      current >= maxIndex
                        ? "rgba(255,255,255,0.2)"
                        : "#FFC300",
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* RIGHT CAROUSEL */}
          <div className="flex-1 relative overflow-hidden py-8 pr-0">
            <div
              className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(15,25,35,0.95))",
              }}
            />

            <motion.div
              className="flex gap-4 pl-6 h-full"
              animate={{ x: -(current * (280 + 16)) }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              style={{ width: employees.length * (280 + 16) }}
            >
              {employees.map((emp, i) => (
                <AlumniCard
                  key={emp._id}
                  person={emp}
                  active={i >= current && i < current + VISIBLE}
                  alreadyRequested={sentRequests.includes(emp._id)}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

const colorPalette = [
  { color: "#4285F4", bg: "#EBF2FF" }, 
  { color: "#16A34A", bg: "#EAF7EF" }, 
  { color: "#9333EA", bg: "#F3E8FF" }, 
  { color: "#F97316", bg: "#FFF1E6" }, 
  { color: "#DC2626", bg: "#FEECEC" }, 
  { color: "#0EA5E9", bg: "#E0F2FE" }, 
];

const getCardColor = (id: string) => {
  const index =
    id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colorPalette.length;

  return colorPalette[index];
};

function AlumniCard({
  person,
  active,
  alreadyRequested,
}: {
  person: Employee;
  active: boolean;
  alreadyRequested: boolean;
}) {
  const [requested, setRequested] = useState(alreadyRequested);
  

useEffect(() => {
  setRequested(alreadyRequested);
}, [alreadyRequested]);
  const { color, bg } = getCardColor(person._id);


  const jobTitle =
  person.company?.jobs?.find(
    (job: any) => job._id === person.designation
  )?.title || person.designation;

  const graduation =
  person.education?.find(
    (edu: any) =>
      edu.level?.toLowerCase() === "graduation" 
  );


const collegeName =
  graduation?.institute || "College not added";

  
  return (
    <motion.div
      className="shrink-0 rounded-2xl overflow-hidden flex flex-col"
      style={{ width: 280, height: "100%" }}
      animate={{ opacity: active ? 1 : 0.35, scale: active ? 1 : 0.96 }}
      transition={{ duration: 0.3 }}
      whileHover={active ? { y: -4, scale: 1.02 } : {}}
    >
      <div
        className="relative flex flex-col items-center justify-end pt-8 pb-6 px-5"
        style={{
          background: `linear-gradient(160deg, ${bg} 0%, ${color}22 100%)`,
          minHeight: 180,
        }}
      >
        {/* Available Badge */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
          style={{
            background: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.3)",
            color: "#10b981",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "#10b981",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          Available
        </div>

        {/* Avatar */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg mb-3"
          style={{
            background: `linear-gradient(135deg, ${color}dd, ${color}88)`,
            border: `3px solid ${color}40`,
          }}
        >
          {person.name?.charAt(0)}
        </div>

        {/* Company pill */}
        <div
          className="px-3 py-1 rounded-full text-[11px] font-bold"
          style={{
            background: `${color}18`,
            color: color,
            border: `1px solid ${color}30`,
          }}
        >
          @ {person.company.name}
        </div>
      </div>

      {/* Bottom */}
      <div className="bg-white flex-1 p-4 flex flex-col justify-between">
        <div>
          <p className="font-bold text-slate-800 text-sm">{person.name}</p>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            {jobTitle}
          </p>
          <p className="text-xs text-slate-400 font-light mt-2">
            {collegeName}
          </p>
         

        </div>

        <motion.button
          disabled={requested}
          onClick={async () => {
            try {
              await sendRequestToEmployee({
                receiver: person._id,
                company: person.company._id,
                role: person.designation,
              });
              setRequested(true);
            } catch {
              alert("Failed to send request");
            }
          }}
          className="mt-3 w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-300"
          style={
            requested
              ? {
                  background: "#f0fdf4",
                  color: "#10b981",
                  border: "1px solid #bbf7d0",
                }
              : {
                  background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                  color: "#fff",
                  boxShadow: `0 4px 16px ${color}40`,
                }
          }
        >
          {requested ? "✓ Requested!" : "Request Referral"}
        </motion.button>
      </div>
    </motion.div>
  );
}