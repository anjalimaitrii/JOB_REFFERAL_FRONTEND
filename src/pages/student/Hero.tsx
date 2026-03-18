import AnimatedText from "./AnimatedText";
import { useNavigate } from "react-router-dom";

export default function Hero() {
    const navigate = useNavigate();
    return (
        <section className="bg-gray-50 py-10 md:min-h-screen flex items-center">
            <div className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-10 items-center">

                {/* LEFT */}
                <div className="text-center md:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                        Get <AnimatedText />
                    </h1>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mt-3 md:mt-4 text-gray-800">
                        From Verified Employees
                    </h2>

                    <p className="mt-3 md:mt-4 text-gray-500 text-sm sm:text-base md:text-lg">
                        Get referrals, mock interviews, and expert guidance from professionals working in top companies.
                    </p>

                    <p className="mt-2 text-gray-500 text-sm sm:text-base">
                        Pay only when you get value. No upfront cost.
                    </p>
                    <button
                        onClick={() => navigate("/student/companies")}
                        className="mt-5 md:mt-6 bg-amber-400 hover:bg-amber-500 text-black font-semibold px-6 py-3 rounded-full shadow-md transition"
                    >
                        🚀 Browse Companies ✨
                    </button>
                </div>

                {/* RIGHT */}
                <div className="relative h-[300px] sm:h-[350px] md:h-[450px] flex items-center justify-center">

                    {/* Center */}
                    <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        className="w-24 h-24 lg:w-48 lg:h-48 rounded-full object-cover shadow-xl"
                    />

                    {/* Floating (Responsive positions) */}
                    <img
                        src="https://randomuser.me/api/portraits/men/79.jpg"
                        className="w-14 h-14 lg:w-32 lg:h-32 absolute top-0 lg:-top-20 left-1/2 -translate-x-1/2 animate-float rounded-full"
                    />

                    <img
                        src="https://randomuser.me/api/portraits/women/44.jpg"
                        className="w-16 h-16 lg:w-32 lg:h-32 absolute top-10 left-4 animate-float rounded-full"
                    />

                    <img
                        src="https://randomuser.me/api/portraits/men/75.jpg"
                        className="w-16 h-16  lg:w-32 lg:h-32 absolute bottom-6 left-6 animate-float rounded-full"
                    />

                    <img
                        src="https://randomuser.me/api/portraits/women/68.jpg"
                        className="w-16 h-16 lg:w-32 lg:h-32 absolute top-10 right-4 animate-float  rounded-full"
                    />

                    <img
                        src="https://randomuser.me/api/portraits/women/17.jpg"
                        className="w-16 h-16 lg:w-32 lg:h-32 absolute bottom-6 right-4 animate-float rounded-full"
                    />

                    <img
                        src="https://randomuser.me/api/portraits/men/45.jpg"
                        className="w-14 h-14 lg:w-32 lg:h-32 absolute bottom-0  lg:-bottom-20 left-1/2 -translate-x-1/2 animate-float  rounded-full"
                    />
                </div>
            </div>
        </section>
    );
}