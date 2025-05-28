

import React from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { GiMeditation } from "react-icons/gi";
import { MdOutlineGpsFixed } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaAnchor } from "react-icons/fa";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { hideNav } from "../redux/slice/navSlice";

function Navbar() {

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
    const dispatch = useDispatch();
    const { visibile, type, value } = useSelector((state)=> state.nav)

    return (
        <section className = {`user-menu-bar ${type}`} >
            <header>
                <div>
                    <FaAnchor />
                </div>
                <div onClick={()=> dispatch(hideNav(value))}>
                    <IoClose />
                </div>
            </header>
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
    );
}

export default Navbar;