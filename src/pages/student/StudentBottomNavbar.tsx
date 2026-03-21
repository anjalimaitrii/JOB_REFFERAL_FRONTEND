import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import { Layout, User, Mail, Home, Building2, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentBottomNav() {
    const [value, setValue] = React.useState("home");
    const navigate = useNavigate();

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        if (newValue === "home") navigate("/student/dashboard");
        if (newValue === "feed") navigate("/student/posts");
        if (newValue === "companies") navigate("/student/companies");
        if (newValue === "requests") navigate("/student/requests");
        if (newValue === "refunds") navigate("/wallet");
        if (newValue === "profile") navigate("/profile");
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
                display: { xs: "block", lg: "none" }
            }}
        >
            <BottomNavigation value={value} onChange={handleChange} showLabels>
                <BottomNavigationAction
                    label="Home"
                    value="home"
                    icon={<Home size={20} />}
                />
                <BottomNavigationAction
                    label="Explore"
                    value="companies"
                    icon={<Building2 size={20} />}
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
                    label="Refunds"
                    value="refunds"
                    icon={<Coins size={20} />}
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
