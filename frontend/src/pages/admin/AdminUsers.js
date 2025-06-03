


import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideNav } from "../../redux/slice/navSlice";
import { showToast } from "../../redux/slice/toastSlice";
import axios from "axios";
import '../../styles/AdminUsers.css'
import { showLoader, hideLoader } from "../../redux/slice/loaderSlice";


function AdminUsers() {

    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        dispatch(showLoader('Fetching all users.'))

        try {
            const url = 'http://localhost:8080/admin/admin-users'
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
            const response = await axios.get(url, headers);

            const { message, success, users } = response.data;

            setUsers(users);
            dispatch(showToast({ message: message, type: success ? "success" : "error" }))
        } catch (err) {
            dispatch(showToast({ message: err.response?.data?.message, type: "error" }))
        }
        dispatch(hideLoader())
    }

    const notify = async (id) => {
        dispatch(showLoader('Sending email.'))
        try {
            const url = 'http://localhost:8080/admin/admin-users'
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
            const response = await axios.post(url, { id }, headers);

            const { message, success } = response.data;

            dispatch(showToast({ message: message, type: success ? "success" : "error" }))
        } catch (err) {
            dispatch(showToast({ message: err.response?.data?.message, type: "error" }))
        }
        dispatch(hideLoader())
    }

    useEffect(() => {
        getUsers();
        dispatch(hideNav('Users'))
    }, [])

    return (
        // <h1>Admin Users, add all users, filter active and inactive and add notify button to inactive users</h1>
        <main className="admin-users-container">
            <div className="admin-header">
                <h1>Admin - Users Panel</h1>
                <button className="inactive-user-btn">Notify Inactive Users</button>
            </div>

            <div className="user-table">
                <div className="user-table-header">
                    <span>Name</span>
                    <span>Email</span>
                    <span>Joined</span>
                    <span>Last Active</span>
                    <span>Action</span>
                </div>

                {users.map((user) => (
                    <div key={user._id} className="user-table-row">
                        <span>{user.firstName} {user.lastName}</span>
                        <span>{user.email}</span>
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                        <span>{new Date(user.lastActive).toLocaleDateString()}</span>
                        <button className="notify-btn" onClick={() => notify(user._id)}>
                            Notify
                        </button>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default AdminUsers;