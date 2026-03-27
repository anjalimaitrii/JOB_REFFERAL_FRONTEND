import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingScreen from "./loadingScreen";
import Hero from "./Hero";

const StudentDashboard = () => {
  const [isLoading, setIsLoading] = useState(
    localStorage.getItem("justLoggedIn") === "true",
  );

  const handleLoadingComplete = () => {
    setIsLoading(false);
    localStorage.removeItem("justLoggedIn");
    window.dispatchEvent(new CustomEvent("dashboardLoaded"));
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
        </AnimatePresence>
        <main className="bg-rudra-black min-h-screen">
          <Hero />
        </main>
      </motion.div>
    </>
  );
};

export default StudentDashboard;
