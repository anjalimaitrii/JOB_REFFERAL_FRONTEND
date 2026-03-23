import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import { Layout, User, Mail, Wallet, LogOut, ToggleLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import PositionedMenu from "@/components/ui/PositionedMenu";

export default function MobileBottomNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem("role") || "student";
    const isStudentMode = role === "employee" && location.pathname.includes("/student");
    const effectiveRole = isStudentMode ? "student" : role;
    const [value, setValue] = React.useState("home");

    React.useEffect(() => {
        const path = location.pathname;
        if (path.includes("dashboard")) setValue("home");
        else if (path.includes("posts")) setValue("feed");
        else if (path.includes("requests")) setValue("requests");
        else if (path.includes("wallet")) setValue("wallet");
        else if (path.includes("profile")) setValue("profile");
    }, [location]);

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        if (newValue === "home") navigate(effectiveRole === "employee" ? "/employee/dashboard" : "/student/dashboard");
        if (newValue === "feed") navigate(effectiveRole === "employee" ? "/employee/posts" : "/student/posts");
        if (newValue === "profile") navigate(effectiveRole === "employee" ? "/employee/profile" : "/student/profile");
        if (newValue === "requests") navigate(effectiveRole === "employee" ? "/employee/requests" : "/student/requests");
        if (newValue === "wallet") navigate(effectiveRole === "employee" ? "/employee/wallet" : "/student/wallet");
        if (newValue === "switch") {
            navigate(
                window.location.pathname.includes("/student")
                    ? "/employee/dashboard"
                    : "/student/dashboard"
            );
        }
        if (newValue === "logout") {
            localStorage.clear();
            navigate("/");
        }
    };

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 5000,
                display: { xs: "block", md: "none" },
                borderTop: '1px solid rgba(0,0,0,0.08)'
            }}
        >
            <BottomNavigation value={value} onChange={handleChange} showLabels>
                <BottomNavigationAction
                    label="Home"
                    value="home"
                    icon={<Layout size={20} />}
                />
                <BottomNavigationAction
                    label="Feed"
                    value="feed"
                    icon={<Layout size={20} />}
                />
                <BottomNavigationAction
                    label="Requests"
                    value="requests"
                    icon={<Mail size={20} />}
                />
                <BottomNavigationAction
                    label={effectiveRole === "student" ? "Refunds" : "Wallet"}
                    value="wallet"
                    icon={<Wallet size={20} />}
                />
                <BottomNavigationAction
                    label="Profile"
                    value="profile"
                    icon={<User size={20} />}
                />

                <BottomNavigationAction

                />
                <PositionedMenu />
            </BottomNavigation>
        </Box>
    );
}
