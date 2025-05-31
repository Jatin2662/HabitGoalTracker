



import React, { useState } from "react";
import '../styles/UserHome.css';
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { GiMeditation } from "react-icons/gi";
import { MdOutlineGpsFixed } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { FaUserSecret } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";


function MainHome() {

    const [title, setTitle] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    
    const userMenuItems = [
        {
            title: 'USER',
            items: [
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
        }
    
    ]
    
    const adminMenuItems = [
        {
            title: 'ADMIN',
            items: [
                {
                    id: 5,
                    title: 'Admin Dashboard',
                    path: '/admin/admin-dashboard',
                    icon: <FaUserSecret />
                },
                {
                    id: 6,
                    title: 'Users',
                    path: '/admin/admin-users',
                    icon: <FaUsers />
                },
                {
                    id: 7,
                    title: 'Custom Email',
                    path: '/admin/admin-setCustomEmail',
                    icon: <MdEmail />
                },
            ]
        }
    
    ]


    const { visible, type, value } = useSelector((state) => state.nav)

    useEffect(()=>{

        const token = localStorage.getItem('token')
        const decoded = jwtDecode(token)

        const userRole = decoded.role;

        if(userRole === 'admin'){
            setMenuItems([...userMenuItems, ...adminMenuItems])
            setTitle('Admin')
        }
        else if(userRole === 'user'){
            setMenuItems(userMenuItems)
            setTitle('')
        }else{
            menuItems = [];
        }
    },[])

    return (
        <main className="user-home">
            <Header title={title} />

            {visible && <Navbar menuItems={menuItems} />}

            <section className="user-pages">
                <Outlet />
            </section>
        </main>
    );
}

export default MainHome;
