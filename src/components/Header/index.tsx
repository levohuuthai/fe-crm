import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Badge,
    Box,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    SmartToy as AssistantIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface HeaderProps {
    onMenuClick: () => void;
    onAiAssistantClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onAiAssistantClick }) => {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleAssistantClick = () => {
        onAiAssistantClick();
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        // Handle logout logic here
        handleMenuClose();
    };

    const handleSettings = () => {
        // Navigate to settings
        handleMenuClose();
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onMenuClick}
                    sx={{ mr: 2, display: { sm: "none" } }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ flexGrow: 1, fontWeight: 600 }}
                >
                    {t("app.title")}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                        size="large"
                        color="inherit"
                        onClick={handleAssistantClick}
                        title={t("tooltips.aiAssistant")}
                        sx={{ mr: 1 }}
                    >
                        <AssistantIcon />
                    </IconButton>

                    <IconButton size="large" color="inherit">
                        <Badge badgeContent={4} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <IconButton
                        onClick={handleProfileMenuOpen}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls="account-menu"
                        aria-haspopup="true"
                    >
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: "primary.main",
                            }}
                            src="/path-to-avatar.jpg"
                        >
                            U
                        </Avatar>
                    </IconButton>
                </Box>
            </Toolbar>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={handleMenuClose}>
                    <Avatar /> {t("header.profile")}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleSettings}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    {t("header.settings")}
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    {t("header.logout")}
                </MenuItem>
            </Menu>
        </AppBar>
    );
};

export default Header;
