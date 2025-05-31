

import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showToast } from '../../redux/slice/toastSlice';
import { hideNav } from "../../redux/slice/navSlice";
import DashboardCard from "../../components/DashboardCard";
import { useState } from "react";

function AdminDashboard() {
    const dispatch = useDispatch();
    const [totalUsers, setTotalUsers] = useState(0)

    const cardData = [
        {
            id: 1,
            title: 'Total users',
            data: totalUsers
        },
        {
            id: 2,
            title: 'Active users',
            data: 'Static'
        },
        {
            id: 3,
            title: 'Inactive users',
            data: 'Static'
        },
        {
            id: 4,
            title: 'New users (past 7 days)',
            data: 'Static'
        },
    ]

    const getAdminDashboardData = async () => {
        try {

            const url = 'http://localhost:8080/admin/admin-dashboard';
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
            const response = await axios.get(url, headers)

            const { message, success, totalUsers } = response.data;

            setTotalUsers(totalUsers);
            dispatch(showToast({ message: message, type: success ? "success" : "error" }))
        } catch (error) {
            dispatch(showToast({ message: error.response?.data?.message, type: "error" }))
        }
    }

    useEffect(() => {
        getAdminDashboardData();
        dispatch(hideNav('Dashboard'));
    }, [])

    return (
        <main className="dashboard-content">
            <section className="dashboard-cards" >
                {cardData.map((cd) => (
                    <DashboardCard id={cd.id} title={cd.title} data={cd.data} />
                ))}
            </section>
        </main>
    );
}

export default AdminDashboard;