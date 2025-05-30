


import React from "react";


function DashboardCard({ id, title, data }) {

    return (
        <div className="dashboard-card" key={id} >
            <h1>{title}</h1>
            <p>{data}</p>
        </div>
    );
}

export default DashboardCard