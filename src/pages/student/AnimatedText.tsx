import { useEffect, useState } from "react";

const words = [
    "Referrals",
    "Mock Interviews",
    "Resume Reviews",
    "Career Mentorship",
];

export default function AnimatedText() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 2200);

        return () => clearInterval(interval);
    }, []);

    return (
        <span className="inline-block  h-[50px] overflow-hidden align-bottom">
            <span
                key={index}
                className="block text-teal-500 animate-slide"
            >
                {words[index]}
            </span>
        </span>

    );
}