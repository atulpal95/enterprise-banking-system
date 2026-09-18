import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import SidebarSection from "./SidebarSection";

import sidebarMenu from "../../constants/sidebarMenu";

function Sidebar({ mobileOpen, onClose }) {

    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleItemClick = (item) => {

        if (item.logout) {
            handleLogout();
            return;
        }

        if (onClose) {
            onClose();
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                />
            )}

            <aside
                className={`sidebar ${
                    mobileOpen ? "sidebar-mobile-open" : ""
                }`}
            >

                {/* =========================
                    SIDEBAR BRAND
                ========================= */}
                <div className="sidebar-brand">

                    <Logo />

                </div>


                {/* =========================
                    MOBILE CLOSE BUTTON
                ========================= */}
                <div className="sidebar-mobile-header">

                    <span>PAL Bank</span>

                    <button
                        type="button"
                        className="sidebar-close-btn"
                        onClick={onClose}
                        aria-label="Close sidebar"
                    >
                        ×
                    </button>

                </div>


                {/* =========================
                    MENU
                ========================= */}
                <nav className="sidebar-menu">

                    {sidebarMenu.map((item, index) => {

                        if (item.section) {

                            return (
                                <SidebarSection
                                    key={index}
                                    title={item.section}
                                />
                            );
                        }

                        return (
                            <SidebarItem
                                key={index}
                                to={item.path}
                                title={item.title}
                                icon={item.icon}
                                onClick={() =>
                                    handleItemClick(item)
                                }
                            />
                        );

                    })}

                </nav>

            </aside>
        </>
    );
}

export default Sidebar;