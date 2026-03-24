'use client';
import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import Button from './button';
import styles from './style.module.scss';
import Nav from './nav';

const menu = {
    open: {
        width: "350px",
        height: "450px",
        bottom: "-10px",
        right: "-25px",
        transition: { duration: 0.75, type: "tween", ease: [0.76, 0, 0.24, 1] }
    },
    closed: {
        width: "100px",
        height: "40px",
        bottom: "0px",
        right: "0px",
        transition: { duration: 0.75, delay: 0.35, type: "tween", ease: [0.76, 0, 0.24, 1] }
    }
}

export default function Index() {
    const [isActive, setIsActive] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current && !menuRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)
            ) {
                setIsActive(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div className={styles.header}>
            <motion.div
                ref={menuRef}
                className={styles.menu}
                variants={menu}
                animate={isActive ? "open" : "closed"}
                initial="closed"
            >
                <AnimatePresence>
                    {isActive && <Nav closeMenu={() => setIsActive(false)} />}
                </AnimatePresence>
            </motion.div>
            <div ref={buttonRef}>
                <Button isActive={isActive} toggleMenu={() => { setIsActive(!isActive) }} />
            </div>
        </div>
    )
}