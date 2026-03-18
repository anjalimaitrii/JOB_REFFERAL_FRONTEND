import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import { Layout, User, Mail, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MobileBottomNav() {
    const [value, setValue] = React.useState("home");
    const navigate = useNavigate();
    const role = localStorage.getItem("role") || "student";

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        if (newValue === "home") navigate(role === "employee" ? "/employee/dashboard" : "/student/dashboard");
        if (newValue === "feed") navigate(role === "employee" ? "/employee/posts" : "/student/posts");
        if (newValue === "profile") navigate("/profile");
        if (newValue === "requests") navigate(role === "employee" ? "/employee/requests" : "/student/requests");
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
                zIndex: 1000,
                display: { xs: "block", md: "none" }
            }}
        >
            <BottomNavigation value={value} onChange={handleChange}>
                <BottomNavigationAction
                    label="Home"
                    value="home"
                    icon={<Layout size={22} />}
                />
                <BottomNavigationAction
                    label="Feed"
                    value="feed"
                    icon={<Layout size={22} />}
                />

                <BottomNavigationAction
                    label="Requests"
                    value="requests"
                    icon={<Mail size={22} />}
                />

                <BottomNavigationAction
                    label="Profile"
                    value="profile"
                    icon={<User size={22} />}
                />

                <BottomNavigationAction
                    label="Logout"
                    value="logout"
                    icon={<LogOut size={22} />}
                />
            </BottomNavigation>
        </Box>
    );
}