import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Layout, User, Mail, LayoutDashboard } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MobileBottomNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem("role") || "student";
    const isStudentMode = role === "employee" && location.pathname.includes("/student");
    const effectiveRole = isStudentMode ? "student" : role;
    const [value, setValue] = React.useState("home");

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    React.useEffect(() => {
        const path = location.pathname;
        if (path.includes("dashboard")) setValue("home");
        else if (path.includes("posts")) setValue("feed");
        else if (path.includes("requests")) setValue("requests");
        else if (path.includes("wallet")) setValue("options"); // Set options as active if in wallet
        else if (path.includes("profile")) setValue("profile");
    }, [location]);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSwitchMode = () => {
        handleMenuClose();
        navigate(
            window.location.pathname.includes("/student")
                ? "/employee/dashboard"
                : "/student/dashboard"
        );
    };

    const handleWalletNavigate = () => {
        handleMenuClose();
        navigate(effectiveRole === "employee" ? "/employee/wallet" : "/student/wallet");
    };

    const handleLogout = () => {
        handleMenuClose();
        localStorage.clear();
        navigate("/");
    };

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        if (newValue === "options") return; // Let onClick handle the menu

        if (newValue === "home") navigate(effectiveRole === "employee" ? "/employee/dashboard" : "/student/dashboard");
        if (newValue === "feed") navigate(effectiveRole === "employee" ? "/employee/posts" : "/student/posts");
        if (newValue === "profile") navigate(effectiveRole === "employee" ? "/employee/profile" : "/student/profile");
        if (newValue === "requests") navigate(effectiveRole === "employee" ? "/employee/requests" : "/student/requests");
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
                    label="Profile"
                    value="profile"
                    icon={<User size={20} />}
                />
                <BottomNavigationAction
                    label="Options"
                    value="options"
                    icon={<LayoutDashboard size={20} />}
                    onClick={handleMenuClick}
                />
            </BottomNavigation>

            <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                {role === "employee" && (
                    <MenuItem onClick={handleSwitchMode} sx={{ fontSize: '14px', fontWeight: 500 }}>
                        Switch to {effectiveRole === "employee" ? "Student" : "Employee"} Mode
                    </MenuItem>
                )}

                <MenuItem onClick={handleWalletNavigate} sx={{ fontSize: '14px', fontWeight: 500 }}>
                    Wallet
                </MenuItem>

                <MenuItem onClick={handleLogout} sx={{ fontSize: '14px', fontWeight: 500, color: '#dc2626' }}>
                    Logout
                </MenuItem>
            </Menu>
        </Box>
    );
}
