

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hideNav } from "../../redux/slice/navSlice";

function AdminCustomEmail(){

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(hideNav('Custom Email'))
    })

    return(
        <h1>Set custom email message one deafult in backend and other from req.body</h1>
    );
}

export default AdminCustomEmail;