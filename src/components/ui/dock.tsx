import { FloatingDock } from "@/components/ui/floating-dock";
import {
    IconLayoutDashboard,
    IconUsers,
    IconBuilding,
    IconBook,
    IconActivity,
    IconLogout
} from "@tabler/icons-react";

export function FloatingDockDemo() {

    const logout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    const links = [
        {
            title: "Dashboard",
            icon: (
                <IconLayoutDashboard className="h-full w-full text-white" />
            ),
            href: "/admin/dashboard",
        },

        {
            title: "Students",
            icon: (
                <IconUsers className="h-full w-full text-white" />
            ),
            href: "/admin/students",
        },

        {
            title: "Employees",
            icon: (
                <IconUsers className="h-full w-full text-white" />
            ),
            href: "/admin/employees",
        },

        {
            title: "Companies",
            icon: (
                <IconBuilding className="h-full w-full text-white" />
            ),
            href: "/admin/companies",
        },

        {
            title: "Feed Posts",
            icon: (
                <IconActivity className="h-full w-full text-white" />
            ),
            href: "/admin/posts",
        },

        {
            title: "Logout",
            icon: (
                <IconLogout className="h-full w-full text-red-400" />
            ),
            href: "#",
            onClick: logout,
        },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <FloatingDock
                mobileClassName="translate-y-20"
                items={links}
            />
        </div>
    );
}