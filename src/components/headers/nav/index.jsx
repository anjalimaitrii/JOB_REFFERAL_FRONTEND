import styles from './style.module.scss';
import { motion } from 'framer-motion';
import { links } from './data';
import { perspective } from "./anim";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";



export default function index({ closeMenu }) {

    const navigate = useNavigate();
    const role = localStorage.getItem("role") || "student";
    const isStudentMode = role === "employee" && window.location.pathname.includes("/student");
    const effectiveRole = isStudentMode ? "student" : role;
    const currentLinks = links[effectiveRole] || links.student;

    const logout = () => {
        localStorage.clear();
        navigate("/");
        closeMenu();
    };

    return (
        <div className={styles.nav}>

            {/* Links */}
            <div className={styles.body}>
                {
                    currentLinks.map((link, i) => {
                        const { title, href } = link;
                        return (
                            <div key={`b_${i}`} className={styles.linkContainer}>
                                <motion.div
                                    custom={i}
                                    variants={perspective}
                                    initial="initial"
                                    animate="enter"
                                    exit="exit"
                                >
                                    <Link to={href} onClick={closeMenu}>
                                        {title}
                                    </Link>
                                </motion.div>
                            </div>
                        )
                    })
                }
            </div>

            {/* Bottom Section */}
            <div className={styles.footer}>

                {/* Toggle - Only for employees who can switch modes */}
                {role === "employee" && (
                    <div className="flex flex-col items-center">

                        <span className="text-[10px] text-gray-500 mb-1">
                            {window.location.pathname.includes("/student")
                                ? "Switch to Employee Mode"
                                : "Switch to Aspirant Mode"}
                        </span>

                        <button
                            onClick={() => { navigate(window.location.pathname.includes("/student") ? "/employee/dashboard" : "/student/dashboard"); closeMenu(); }}

                            className={styles.toggle}
                            title={window.location.pathname.includes("/student") ? "Switch to Employee Mode" : "Switch to Student Mode"}
                        >
                            <span className={styles.circle} style={{ transform: window.location.pathname.includes("/student") ? "translateX(24px)" : "translateX(0)" }}></span>
                        </button> </div>
                )}

                {/* Logout */}
                <button
                    onClick={logout}
                    className={styles.logout}
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>

        </div>
    )
}