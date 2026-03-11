import { motion } from "framer-motion";
import Navbar from "./navbar";
import CreatePost from "./CreatePost";
import MobileBottomNav from "./bottomNavbar";

const EmployeeDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
    >
      <div className="min-h-screen bg-slate-50 pb-20">
        <Navbar />
        <div className=" z-20 mt-20">
          <CreatePost onPostCreated={() => { }} />
        </div>
        <MobileBottomNav />
      </div>
    </motion.div>
  );
};



export default EmployeeDashboard;
