


import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideNav } from "../../redux/slice/navSlice";

function AdminUsers(){

    const dispatch =  useDispatch();

    useEffect(()=>{
        dispatch(hideNav('Users'))
    })

    return(
        <h1>Admin Users</h1>
    );
}

export default AdminUsers;