import { motion } from "framer-motion";

const logos = [
  "google",
  "meta",
  "netflix",
  "uber",
  "airbnb",
  "spotify",
  "tesla",
];

export default function TrustedBy() {
  return (
    <section className="relative py-16  overflow-hidden mt-10">
      {/* Heading */}
      <div className="text-center mb-10">
        <p className="text-gray-500 text-xs tracking-[0.3em] uppercase">
          Trusted by
        </p>
      </div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-gray-50 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-gray-50 to-transparent z-10" />

      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex gap-10"
          animate={{ x: ["0px", "-1000px"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {[...logos, ...logos, ...logos].map((company, index) => (
            <div
              key={index}
              className="flex items-center justify-center min-w-[140px]"
            >
              <img
                src={`https://cdn.simpleicons.org/${company}/4B5563`}
                alt={company}
                className="h-16 opacity-70 hover:opacity-100 hover:scale-110 transition duration-300"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
