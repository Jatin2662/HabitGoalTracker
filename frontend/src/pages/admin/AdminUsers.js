


import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideNav } from "../../redux/slice/navSlice";

function AdminUsers(){

    const dispatch =  useDispatch();

    useEffect(()=>{
        dispatch(hideNav('Users'))
    })

    return(
        <h1>Admin Users, add all users, filter active and inactive and add notify button to inactive users</h1>
    );
}

export default AdminUsers;