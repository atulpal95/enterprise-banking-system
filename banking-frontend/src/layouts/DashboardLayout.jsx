import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import "../assets/styles/navbar.css";
import "../assets/styles/sidebar.css";
import "../assets/styles/dashboard.css";

function DashboardLayout() {

    const [mobileOpen, setMobileOpen] = useState(false);

    const openMobileSidebar = () => {
        setMobileOpen(true);
    };

    const closeMobileSidebar = () => {
        setMobileOpen(false);
    };

    return (

        <div className="dashboard-layout">

            <Sidebar
                mobileOpen={mobileOpen}
                onClose={closeMobileSidebar}
            />

            <div className="dashboard-main">

                <Navbar
                    onMenuClick={openMobileSidebar}
                />

                <main className="dashboard-content">

                    <Outlet />

                </main>

            </div>

        </div>

    );
}

export default DashboardLayout;