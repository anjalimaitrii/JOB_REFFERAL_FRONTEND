import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import { Layout, User, Mail, Wallet } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MobileBottomNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem("role") || "student";
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
        if (newValue === "home") navigate(role === "employee" ? "/employee/dashboard" : "/student/dashboard");
        if (newValue === "feed") navigate(role === "employee" ? "/employee/posts" : "/student/posts");
        if (newValue === "profile") navigate("/profile");
        if (newValue === "requests") navigate(role === "employee" ? "/employee/requests" : "/student/requests");
        if (newValue === "wallet") navigate("/wallet");
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
                    label={role === "student" ? "Refunds" : "Wallet"}
                    value="wallet"
                    icon={<Wallet size={20} />}
                />
                <BottomNavigationAction
                    label="Profile"
                    value="profile"
                    icon={<User size={20} />}
                />
            </BottomNavigation>
        </Box>
    );
}
