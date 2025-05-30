

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { showNav } from "../redux/slice/navSlice";
import { FaHamburger } from "react-icons/fa";
// import { SiPivotaltracker } from "react-icons/si";
import { FaAnchor } from "react-icons/fa";



function Header({ title }) {

    const { visible, type, value } = useSelector((state) => state.nav)
    const dispatch = useDispatch();

    return (
        <nav className="user-home-nav">
            <div>
                <button className="nav-btn centered" onClick={() => dispatch(showNav())}>
                    <FaHamburger />
                </button>
                <div className="nav-logo centered" >
                    {/* <SiPivotaltracker /> */}
                    <FaAnchor />
                </div>

                <div>{value}</div>
            </div>

            <span>{title}</span>
        </nav>
    );
}

export default Header;