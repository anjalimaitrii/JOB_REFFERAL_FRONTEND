import { motion } from "framer-motion";
import Hero from "./Hero";

const EmployeeDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
    >
      <div className="min-h-screen bg-slate-50 ">
        <Hero />
      </div>
    </motion.div>
  );
};



export default EmployeeDashboard;
