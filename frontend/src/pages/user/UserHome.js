

import React, { useState } from "react";
import '../../styles/UserHome.css';
import { FaHamburger } from "react-icons/fa";
// import { SiPivotaltracker } from "react-icons/si";
import { FaAnchor } from "react-icons/fa";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { showNav } from "../../redux/slice/navSlice";


function UserHome() {

    const { visible, type, value } = useSelector((state)=> state.nav)
    const dispatch = useDispatch();

    return (
        <main className="user-home">
            <nav className="user-home-nav">
                <div>
                    <button className="nav-btn centered" onClick={()=> dispatch(showNav())}>
                        <FaHamburger />
                    </button>
                    <div className="nav-logo centered" >
                        {/* <SiPivotaltracker /> */}
                        <FaAnchor />
                        </div>

                    <div>{value}</div>
                </div>
            </nav>

            {visible && <Navbar/>}

            <section className="user-pages">
                <Outlet />

            </section>
        </main>
    );
}

export default UserHome;
