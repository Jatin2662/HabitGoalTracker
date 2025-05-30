

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hideNav } from "../../redux/slice/navSlice";

function AdminDashboard(){
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(hideNav('Dashboard'));
    })

    return(
        <h1>Admin Dashboard</h1>
    );
}

export default AdminDashboard;