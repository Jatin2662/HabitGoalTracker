

import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { hideNav } from "../redux/slice/navSlice";
import { MdLogout } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaAnchor } from "react-icons/fa";

function Navbar({ menuItems }) {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { visibile, type, value } = useSelector((state) => state.nav)

    return (
        <section className={`user-menu-bar ${type}`} >
            <header>
                <div>
                    <FaAnchor />
                </div>
                <div onClick={() => dispatch(hideNav(value))}>
                    <IoClose />
                </div>
            </header>
            <div className="user-menu">
                {menuItems.map((mt) => (
                    //    <div key={mt.id} className="user-menu-items"><span>{mt.logo}</span> <Link to={mt.path}>{mt.title}</Link></div>
                    <div>
                        <h3>{mt.title}</h3>
                        {mt.items.map((mti) => (
                            <NavLink
                                to={mti.path}
                                key={mti.id}
                                className={({ isActive }) => `user-menu-items ${(isActive ? 'active' : '')}`}>
                                <span className="centered" >{mti.icon}</span>
                                <span>{mti.title}</span>
                            </NavLink>
                        ))}
                    </div>
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