


import React, { useState, useEffect } from "react";
import axios from "axios";
import '../../styles/UserHabits.css';
import HabitForm from "../../components/HabitForm";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { showToast } from "../../redux/slice/toastSlice";
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import UpdateHabitForm from "../../components/UpdateHabitForm";
import DeleteHabit from "../../components/DeleteHabit";
import { hideNav } from "../../redux/slice/navSlice";


function HabitCardItem({ title, content }) {

    return (
        <div>
            <span className="c-t" >{title}</span>
            <span>{content}</span>
        </div>
    )
}


function UserHabits() {

    const userName = localStorage.getItem('loggedInUser') || 'Logger';
    const dispatch = useDispatch();
    const [showForm, setShowForm] = useState(false);
    const [updateHabit, setUpdateHabit] = useState(false);
    const [habitsData, setHabitsData] = useState([]);
    const [serverMessage, setServerMessage] = useState('');
    const [habitToUpdate, setHabitToUpdate] = useState();
    const [deleteDialoge, setDeleteDialoge] = useState(false);
    const [habitToDelete, setHabitToDelete] = useState();
    const navigate = useNavigate();

    const getHabits = async () => {

        try {
            const url = 'http://localhost:8080/user/user-habits'

            const response = await axios.get(url, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });

            const { message, habits, success } = response.data;

            if (success) {
                dispatch(showToast({ message: message, type: "success" }))
                setServerMessage(message);
                setHabitsData(habits)
            } else if (!success) {
                dispatch(showToast({ message: message, type: "error" }))
            }

        } catch (err) {
            dispatch(showToast({ message: err.response?.data?.message || "An unexpected error occurred", type: "error" }))
        }
    }

    // const handleHabitAdded = (message) => {
    //     setShowForm(false);
    //     dispatch(showToast({ message: message, type: "success" }));
    // };

    useEffect(() => {
        getHabits();
        dispatch(hideNav('Habits'))
    }, [])

    return (
        <>
            {/* {showToast && (
                <Toast message="Ahoy! Habit added successfully!" onClose={() => setShowToast(false)} />
            )} */}
            <nav className="dashboard-nav centered">{userName + `'s`} Habits</nav>
            <main className="habits-content">
                <div className="habits-content-head">
                    <h1>Manage Habits</h1>
                    <button className="" onClick={() => setShowForm(true)}>Add new habit</button>
                </div>

                <section className="habits-data">

                    {habitsData.length === 0 ? (
                        <h1>{serverMessage}</h1>
                    ) : (
                        <div className="habits-cards">
                            {habitsData.map((hd) => (
                                <div className="habit-card" key={hd._id}>
                                    <h3>{hd.habit}</h3>

                                    <HabitCardItem title="Description: " content={hd.habitDescription} />
                                    <HabitCardItem title="Repeat: " content={hd.repeat} />
                                    <HabitCardItem title="Custom Repeat: " content={hd.custom_repeat.join(', ') || 'None'} />
                                    <HabitCardItem title="Start Date: " content={new Date(hd.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} />
                                    <HabitCardItem title="End Date: " content={hd.endDate ? new Date(hd.endDate).toLocaleDateString() : 'Ongoing'} />
                                    <HabitCardItem title="Status: " content={hd.state} />
                                    <div className="habit-actions">
                                        <MdOutlineEdit className="edit-icon" onClick={() => {
                                            setHabitToUpdate(hd);
                                            setUpdateHabit(true);
                                            navigate(`/user/user-habits/${hd._id}`);
                                        }} />
                                        <MdDeleteOutline className="delete-icon" onClick={() => {
                                            setHabitToDelete(hd);
                                            setDeleteDialoge(true);
                                            navigate(`/user/user-habits/${hd._id}`);
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
            {/* {showForm && <HabitForm setShowForm={setShowForm} onSuccess={handleHabitAdded} />} */}
            {showForm && <HabitForm setShowForm={setShowForm} />}
            {updateHabit && <UpdateHabitForm setUpdateHabit={setUpdateHabit} habitToUpdate={habitToUpdate} />}
            {deleteDialoge && <DeleteHabit setDeleteDialoge={setDeleteDialoge} habitToDelete={habitToDelete} />}
        </>
    );
}

export default UserHabits;