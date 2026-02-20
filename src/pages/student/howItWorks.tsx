import { Building2, Users, Sparkles } from "lucide-react";

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Building2,
    title: "Find a Company",
    desc: "Browse 500+ companies hiring through referrals right now.",
  },
  {
    step: "02",
    icon: Users,
    title: "Connect with Alumni",
    desc: "Reach out to employees from your college network.",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Get Referred",
    desc: "Alumni submit your profile internally — skip the queue.",
  },
];

function HowItWorks() {
  return (
    <section className="mt-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">
      <h3 className="text-base font-semibold text-slate-700 mb-5">How It Works</h3>

      <div className="flex gap-4">
        {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
          <div
            key={step}
            className="group relative flex-1 rounded-2xl border border-slate-100 p-5 overflow-hidden transition-all duration-300 hover:border-amber-200 hover:shadow-md hover:-translate-y-0.5"
            style={{
              background: `
                radial-gradient(ellipse 120% 80% at 110% -10%, rgba(251,191,36,0.13) 0%, transparent 55%),
                radial-gradient(ellipse 80% 60% at -10% 110%, rgba(251,191,36,0.07) 0%, transparent 50%),
                #ffffff
              `,
            }}
          >
            {/* Noise texture overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
                backgroundSize: "160px 160px",
              }}
            />

            {/* Step watermark */}
            <span
              className="absolute -bottom-2 -right-1 font-black select-none leading-none pointer-events-none"
              style={{ fontSize: 72, color: "rgba(15,23,42,0.04)", letterSpacing: "-3px" }}
            >
              {step}
            </span>

            {/* Left amber accent bar — hover */}
            <div
              className="absolute left-0 top-5 bottom-5 w-[3px] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(180deg,#FFC300,#FF8C00)" }}
            />

            {/* Icon */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 border border-amber-100"
              style={{ background: "linear-gradient(135deg,#fffbeb,#fef3c7)" }}
            >
              <Icon size={16} className="text-amber-500" />
            </div>

            <p className="text-sm font-semibold text-slate-800 mb-1">{title}</p>
            <p className="text-xs text-slate-400 font-light leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;