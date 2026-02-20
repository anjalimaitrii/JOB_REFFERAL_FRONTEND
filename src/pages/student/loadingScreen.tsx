"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [exit, setExit] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed?.name) {
        setUserName(parsed.name);
      }
    }

    // First text duration
    const firstTimer = setTimeout(() => {
      setTextIndex(1);
    }, 1400);

    // Exit after full animation
    const finalTimer = setTimeout(() => {
      setExit(true);
      setTimeout(onComplete, 800);
    }, 3200);

    return () => {
      clearTimeout(firstTimer);
      clearTimeout(finalTimer);
    };
  }, [onComplete]);

  const texts = [
    `Welcome ${userName}`,
    "Connecting you to job referrals…",
  ];

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={exit ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9999] bg-zinc-950 flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Old Default Image */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="relative w-32 h-32 md:w-40 md:h-40 bg-zinc-900 rounded-full shadow-[0_0_40px_-10px_rgba(255,215,0,0.3)] overflow-hidden border-4 border-rudra-gold/20"
        >
          <img
            src="https://images.openai.com/static-rsc-3/vB23nNQ7Ci8GXCe-iMVmIV89FTfPWJsP76GKByoZtjalpQyf5l_w6r_vARgTaQ_TNfVp0enR6gJ9locYheO20Og5sZm87YpSTjUWGCfh0sE?purpose=fullsize&v=1"
            alt="logo"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Animated Text Switch */}
        <div className="h-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="text-white text-lg md:text-xl font-semibold"
            >
              {texts[textIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "120px" }}
          transition={{ delay: 0.8, duration: 1 }}
          className="h-1 bg-rudra-gold rounded-full"
        />
      </div>
    </motion.div>
  );
}