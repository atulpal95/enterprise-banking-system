import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";

import "../assets/styles/admin-layout.css";

function AdminLayout() {

    const [mobileOpen, setMobileOpen] = useState(false);

    const openMobileSidebar = () => {
        setMobileOpen(true);
    };

    const closeMobileSidebar = () => {
        setMobileOpen(false);
    };

    return (
        <div className="admin-layout">

            <AdminSidebar
                mobileOpen={mobileOpen}
                onClose={closeMobileSidebar}
            />

            <div className="admin-main">

                <AdminNavbar
                    onMenuClick={openMobileSidebar}
                />

                <main className="admin-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default AdminLayout;