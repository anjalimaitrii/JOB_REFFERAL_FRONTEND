import { motion } from "framer-motion";
import Navbar from "./navbar.js";
import HeroSection from "./heroSection.js";
import  ReferralGallery  from "../../components/ui/skipper.js";

const EmployeeDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
    >
      <div className="min-h-screen bg-slate-100">
        <Navbar />
        <HeroSection />
        <ReferralGallery/>
      </div>
    </motion.div>
  );
};

export default EmployeeDashboard;
