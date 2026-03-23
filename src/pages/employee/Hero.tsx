import { motion } from "framer-motion";

export default function Hero() {
    return (
        <div className="relative h-screen w-full overflow-hidden bg-black">

            {/* 🎥 Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-70"
                src="/videos/file.mp4"
            />


            <div className="absolute inset-0 bg-black/40" />



            <motion.div
                className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"

                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 1,
                    duration: 0.9,
                    ease: "easeOut"
                }}
            >
                <p className="text-sm text-gray-300 mb-4">
                    Smart Hiring Platform for Modern Teams
                </p>

                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-3xl">
                    Hire faster. Track smarter. Build better teams.
                </h1>

                <p className="text-gray-300 mt-4 max-w-xl">
                    Manage jobs, employees, and applications — all in one powerful dashboard.
                </p>


            </motion.div>
        </div>
    );
}