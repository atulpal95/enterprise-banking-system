import { NavLink } from "react-router-dom";

function SidebarItem({
    to,
    title,
    icon: Icon,
    onClick
}) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
            }
        >
            <span className="sidebar-icon">
                <Icon size={18} />
            </span>

            <span className="sidebar-title">
                {title}
            </span>
        </NavLink>
    );
}

export default SidebarItem;