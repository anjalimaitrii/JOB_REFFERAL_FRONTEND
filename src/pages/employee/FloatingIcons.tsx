import { motion } from "framer-motion";

const icons = [1, 2, 3, 4, 5, 6];

export default function FloatingIcons() {
    return (
        <div className="absolute inset-0 z-5 pointer-events-none">
            {icons.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-10 h-10 border border-white/20 rounded-full backdrop-blur-sm"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                    }}
                    animate={{
                        y: [0, -40, 0],
                        x: [0, 20, 0],
                    }}
                    transition={{
                        duration: 6 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}