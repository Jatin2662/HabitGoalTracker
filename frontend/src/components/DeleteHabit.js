

import React, { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/DeleteHabit.css'
import axios from "axios";
import { useDispatch } from "react-redux";
import { showToast } from "../redux/slice/toastSlice";



function DeleteHabit({ setDeleteDialoge, habitToDelete }) {

    const [habitName, setHabitName] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const drop = habitName !== habitToDelete.habit;

    const handleFormChange = async (e) => {
        e.preventDefault();

        const habitId = habitToDelete._id;
        try {
            const url = `http://localhost:8080/user/user-habits/${habitId}`
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }

            const response = await axios.delete(url, headers)

            const { message, success } = response.data;

            dispatch(showToast({
                message,
                type: success ? "success" : "error"
            }));

            setDeleteDialoge(false);
            navigate('/user/user-habits');
        } catch (err) {
            dispatch(showToast({ message: err.message, type: "error" }));
        }
    }

    return (
        <section className="deleteHabit-overlay">
            <div className="deleteHabit">
                <h1>Drop Habit</h1>
                <p>To delete the habit <strong>{habitToDelete.habit}</strong>, type the name to confirm</p>
                <form onSubmit={handleFormChange} >
                    <input
                        type="text"
                        placeholder="Enter habit name "
                        value={habitName}
                        onChange={(e) => {
                            setHabitName(e.target.value);
                        }}
                        required
                    />
                    <div>
                        <button className="delete-cancel" onClick={() => {
                            setDeleteDialoge(false);
                            navigate('/user/user-habits')
                        }} >Cancel</button>
                        <button type="submit" className="delete-drop" disabled={drop} >Drop</button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default DeleteHabit;