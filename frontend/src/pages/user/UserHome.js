

import React from "react";
import '../../styles/UserHome.css';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { GiMeditation } from "react-icons/gi";
import { MdOutlineGpsFixed } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { MdLogout } from "react-icons/md";

function UserHome() {

    const menuItems = [
        {
            id: 1,
            title: 'Dashboard',
            path: '/user/user-dashboard',
            icon: <MdSpaceDashboard />
        },
        {
            id: 2,
            title: 'Habits',
            path: '/user/user-habits',
            icon: <GiMeditation />
        },
        {
            id: 3,
            title: 'Track',
            path: '/user/user-track',
            icon: <MdOutlineGpsFixed />
        },
        {
            id: 4,
            title: 'Settings',
            path: '/user/user-settings',
            icon: <IoSettings />
        }
    ]

    const navigate = useNavigate();

    return (
        <main className="user-home">
            <section className="user-menu-bar" >
                <h1>Tracker</h1>
                <div className="user-menu">
                    {menuItems.map((mt) => (
                        //    <div key={mt.id} className="user-menu-items"><span>{mt.logo}</span> <Link to={mt.path}>{mt.title}</Link></div>
                        <NavLink
                            to={mt.path}
                            key={mt.id}
                            className={({ isActive }) => `user-menu-items ${(isActive ? 'active' : '')}`}>
                            <span className="centered" >{mt.icon}</span>
                            <span>{mt.title}</span>
                        </NavLink>
                    ))}
                    <div className="user-menu-items" onClick={() => {
                        localStorage.clear();
                        navigate('/', { replace: true })
                    }}>
                        <span className="centered" ><MdLogout /></span>
                        <span>Log Out</span>
                    </div>
                </div>
            </section>
            <section className="user-pages">
                <Outlet />

            </section>
        </main>
    );
}

export default UserHome;
