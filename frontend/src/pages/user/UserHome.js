

import React, { useState } from "react";
import '../../styles/UserHome.css';
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { userMenuItems } from "../../Data";
import Header from "../../components/Header";


function UserHome() {

    const { visible, type, value } = useSelector((state) => state.nav)

    return (
        <main className="user-home">
            <Header />

            {visible && <Navbar menuItems={userMenuItems} />}

            <section className="user-pages">
                <Outlet />

            </section>
        </main>
    );
}

export default UserHome;
