import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "./navbar";
import HeroSection from "./heroSection";
import CreatePost from "./CreatePost";
import EmployeeFeed from "./EmployeeFeed";
import Skipper from "@/components/ui/skipper";

const EmployeeDashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setRefreshKey((prev: number) => prev + 1);
  };


  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
    >
      <div className="min-h-screen bg-slate-50 pb-20">
        <Navbar />
        {/* <HeroSection /> */}
        {/* <Skipper/> */}
        <div className=" z-20 mt-20">
          <CreatePost onPostCreated={handlePostCreated} />
          <EmployeeFeed refreshKey={refreshKey}  limit={2} />
        </div>
      </div>
    </motion.div>
  );
};



export default EmployeeDashboard;
