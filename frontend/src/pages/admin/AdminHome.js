

import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { adminMenuItems } from "../../Data";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";

function AdminHome() {

    const { visible, type, value } = useSelector((state) => state.nav)

    return (
        <main className="user-home">
            <Header title="Admin" />

            {visible && <Navbar menuItems={adminMenuItems} />}

            <section className="user-pages">
                <Outlet />
            </section>
        </main>
    );
}

export default AdminHome;