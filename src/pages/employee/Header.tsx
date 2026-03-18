import { useState } from "react";

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
        <header className="w-full flex items-center justify-between px-6 py-4 bg-[#fefaee]">

            {/* LOGO (replace with your SVG) */}
            <div className="font-bold text-xl">Antigravity</div>

            {/* NAV */}
            <nav className="hidden md:flex gap-6">
                {["Product", "Use Cases", "Pricing", "Blog", "Resources"].map((item) => (
                    <a key={item} href="#" className="hover:opacity-70">
                        {item}
                    </a>
                ))}
            </nav>

            {/* BUTTON */}
            <button className="hidden md:flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg">
                Download
            </button>

            {/* MOBILE MENU */}
            <button
                className="md:hidden text-xl"
                onClick={() => setOpen(!open)}
            >
                {open ? "✖" : "☰"}
            </button>

            {/* MOBILE DROPDOWN */}
            {open && (
                <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-6 md:hidden">
                    {["Product", "Use Cases", "Pricing", "Blog", "Resources"].map(
                        (item) => (
                            <a key={item} href="#">
                                {item}
                            </a>
                        )
                    )}
                </div>
            )}
        </header>
    );
}