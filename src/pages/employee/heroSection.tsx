import { lazy, Suspense } from "react";

const Scene = lazy(() => import("../../components/ui/scene/index.jsx"));
function HeroSection() {
  return (
    <div>
         <div
          className="relative w-full h-screen flex items-center justify-center overflow-hidden"
          style={{ background: "#000" }}
        >
          <div className="absolute inset-0 z-0">
            <Suspense fallback={<div className="w-full h-full bg-black" />}>
              <Scene />
            </Suspense>
          </div>

          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div
            className="absolute inset-0 z-[1] opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)",
            }}
          />
          <div className="absolute left-0 top-0 h-full w-1 z-[2] bg-gradient-to-b from-transparent via-white/30 to-transparent" />
          <div className="relative z-10 text-center px-6">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/80 text-xs font-medium tracking-widest uppercase">
                Referral Management
              </span>
            </div>
            <h2 className="text-7xl font-extrabold text-white leading-tight">
              Manage Your <span className="text-white/60">Network,</span>
            </h2>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mt-1">
              Grow Together
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-lg mx-auto">
              Review referral requests, track applications, and build meaningful
              professional connections.
            </p>
          </div>
        </div>
    </div>
  )
}

export default HeroSection