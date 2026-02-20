import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function ApplyNow() {
  const navigate = useNavigate();
  return (
    <div>
      <section className="mt-8 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div
          className="relative rounded-3xl overflow-hidden p-10 sm:p-16 cursor-pointer group"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const x = (((e.clientX - r.left) / r.width) * 100).toFixed(1);
            const y = (((e.clientY - r.top) / r.height) * 100).toFixed(1);
            e.currentTarget.style.setProperty("--mx", x + "%");
            e.currentTarget.style.setProperty("--my", y + "%");
          }}
          style={{
            background: "#0a0a0f",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.06)",
            transition: "transform 0.4s ease, box-shadow 0.4s ease",
          }}
        >
          {/* Animated gradient mesh */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-100"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at var(--mx,50%) var(--my,40%), rgba(255,195,0,0.20) 0%, transparent 60%),
                radial-gradient(ellipse 60% 80% at 80% 20%, rgba(255,120,0,0.13) 0%, transparent 50%),
                radial-gradient(ellipse 40% 60% at 20% 80%, rgba(100,60,255,0.10) 0%, transparent 50%)
              `,
            }}
          />
          {/* Grid texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Floating particles */}
          {[
            { l: "10%", d: 3.2, delay: 0, c: "#FFC300" },
            { l: "25%", d: 4.0, delay: 0.7, c: "#FF8C00" },
            { l: "42%", d: 3.6, delay: 1.2, c: "#FFC300" },
            { l: "60%", d: 4.4, delay: 0.3, c: "#FF8C00" },
            { l: "75%", d: 3.0, delay: 1.8, c: "#FFC300" },
            { l: "88%", d: 5.0, delay: 0.9, c: "#FF8C00" },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute bottom-0 rounded-full pointer-events-none"
              style={{
                left: p.l,
                width: `${5 + (i % 3) * 2}px`,
                height: `${5 + (i % 3) * 2}px`,
                background: p.c,
                animation: `floatUp ${p.d}s linear ${p.delay}s infinite`,
                opacity: 0,
              }}
            />
          ))}

          {/* Content */}
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10 flex-wrap">
            {/* Text */}
            <div className="flex-1 min-w-[260px]">
              <p className="text-amber-400 text-[11px] font-bold tracking-[3px] uppercase mb-4 flex items-center gap-2">
                <span className="inline-block w-8 h-[2px] bg-amber-400" />
                500+ Companies Hiring Now
              </p>
              <h2
                className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.05] tracking-tight mb-5"
                style={{ fontFamily: "inherit" }}
              >
                Ready to Land Your{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg,#FFC300,#FF8C00)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Dream Job?
                </span>
              </h2>
              <p className="text-white/40 text-base leading-relaxed max-w-md">
                Browse top companies, connect with alumni referrers, and get
                referred directly — skip the queue entirely.
              </p>
            </div>

            {/* Button + mini stats */}
            <div className="flex flex-col items-center gap-5 shrink-0">
              <button
                onClick={() => navigate("/student/companies")}
                className="relative flex items-center gap-3 px-12 py-5 rounded-full font-extrabold text-lg text-black border-none cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:scale-105 group/btn"
                style={{
                  background: "linear-gradient(135deg,#FFC300,#FF8C00)",
                  boxShadow: "0 8px 32px rgba(255,140,0,0.4)",
                  animation: "pulseGlow 2.5s ease-in-out infinite",
                }}
              >
                <span
                  className="absolute inset-0 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg,rgba(255,255,255,0.25),transparent)",
                  }}
                />
                Browse Companies
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-full transition-transform duration-300 group-hover/btn:translate-x-1"
                  style={{ background: "rgba(0,0,0,0.15)" }}
                >
                  <ChevronRight className="w-4 h-4" />
                </span>
              </button>

              {/* Mini stats */}
              <div className="flex items-stretch gap-6">
                {[
                  { num: "8.5K+", label: "Referrals Done" },
                  { num: "3 Wks", label: "Avg. to Offer" },
                  { num: "92%", label: "Success Rate" },
                ].map((s, i, arr) => (
                  <div key={s.label} className="flex items-stretch gap-6">
                    <div className="text-center">
                      <div className="text-white font-extrabold text-xl tracking-tight">
                        {s.num}
                      </div>
                      <div className="text-white/35 text-[11px] mt-1">
                        {s.label}
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-px bg-white/10 self-stretch" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Keyframe styles */}
        <style>{`
          @keyframes floatUp {
            0%   { transform: translateY(0) scale(0); opacity: 0; }
            10%  { opacity: 0.9; }
            90%  { opacity: 0.4; }
            100% { transform: translateY(-200px) scale(1.4); opacity: 0; }
          }
          @keyframes pulseGlow {
            0%,100% { box-shadow: 0 0 0 0 rgba(255,195,0,0.45), 0 8px 32px rgba(255,140,0,0.4); }
            50%      { box-shadow: 0 0 0 14px rgba(255,195,0,0), 0 8px 40px rgba(255,140,0,0.65); }
          }
        `}</style>
      </section>
    </div>
  );
}

export default ApplyNow;
