import { motion } from "framer-motion";
import Navbar from "./navbar";
import CreatePost from "./CreatePost";
import MobileBottomNav from "./bottomNavbar";
import Skipper from "@/components/ui/skipper";
import HeroSection from "./heroSection";
import Header from "@/components/headers/index.jsx";
import NotificationBell from "@/components/NotificationBell";

const EmployeeDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
    >
      <div className="min-h-screen bg-slate-50 ">
        {/* <Navbar /> */}
        <Header />
        <HeroSection />
        {/* <Skipper /> */}
        {/* <div className=" z-20 mt-20">
          <CreatePost onPostCreated={() => { }} />
        </div> */}
        <NotificationBell role="employee" />
        <MobileBottomNav />
      </div>
    </motion.div>
  );
};



export default EmployeeDashboard;
