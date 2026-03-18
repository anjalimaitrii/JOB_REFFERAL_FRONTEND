import styles from './style.module.scss';
import { motion } from 'framer-motion';
import { links } from './data';
import { perspective } from "./anim";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function index() {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className={styles.nav}>

            {/* Links */}
            <div className={styles.body}>
                {
                    links.map((link, i) => {
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
                                    <Link to={href}>
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

                {/* Toggle */}
                <button
                    onClick={() => navigate("/student/dashboard")}
                    className={styles.toggle}
                    title="Switch to Student Dashboard"
                >
                    <span className={styles.circle}></span>
                </button>

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