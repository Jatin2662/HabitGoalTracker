

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hideNav } from "../../redux/slice/navSlice";
import DashboardCard from "../../components/DashboardCard";

function AdminDashboard(){
    const dispatch = useDispatch();

    const cardData = [
        {
            id: 1,
            title: 'Total users',
            data: 'Static'
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

    useEffect(()=>{
        dispatch(hideNav('Dashboard'));
    })

    return(
        <main className="dashboard-content">
            <section className="dashboard-cards" >
                {cardData.map((cd)=>(
                    <DashboardCard id={cd.id} title={cd.title} data={cd.data} />
                ))}
            </section>
        </main>
    );
}

export default AdminDashboard;