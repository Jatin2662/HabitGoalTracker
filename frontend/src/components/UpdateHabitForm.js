



import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import '../styles/HabitForm.css';
import { showToast } from "../redux/slice/toastSlice";
import { useNavigate } from "react-router-dom";


// try {
//             const { habit, habitDescription, repeat, custom_repeat, startDate, endDate, state } = habitToEdit;

//             const finalData = {
//                 habit,
//                 habitDescription,
//                 repeat,
//                 custom_repeat,
//                 startDate: startDate || new Date().toISOString(),
//                 endDate: endDate === "" ? null : endDate,
//                 state
//             };

//             const url = 'http://localhost:8080/user/user-habits';
//             const token = localStorage.getItem('token');
//             const headers = {
//                 headers: {
//                     'Authorization': token
//                 }
//             };

//             const response = await axios.post(url, finalData, headers);
//             const { message, success, error } = response.data;

//             if (success) {
//                 dispatch(showToast({ message: message, type: "success" }))
//             }

//             setShowForm(false)
//         } catch (error) {
//             const detail = error.response.data?.error?.details?.[0]?.message || 'Unknown validation error';

//             if (error.response) {
//                 dispatch(showToast({ message: error.response.status + ', ' + error.response.data.message + ', ' + detail, type: "error" }))
//                 setShowForm(false)
//             }
//             else {
//                 dispatch(showToast({ message: error.message, type: "error" }))
//                 setShowForm(false)
//             }
//         }



function UpdateHabitForm({ habitToUpdate, setUpdateHabit }) {

    const baseURL = process.env.REACT_APP_BACKEND_URL;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [habitToEdit, setHabitToEdit] = useState({
        habit: '',
        habitDescription: '',
        repeat: 'daily',
        custom_repeat: [],
        startDate: '',
        endDate: '',
        state: ''
    })

    const custom = habitToEdit.repeat === 'custom';

    const handleChange = (e) => {
        setHabitToEdit({ ...habitToEdit, [e.target.name]: e.target.value })
    }

    const handleCustomChange = (e) => {
        const checked = e.target.checked;
        const value = e.target.value;
        setHabitToEdit((prev) => ({
            ...prev,
            custom_repeat: checked
                ? [...prev.custom_repeat, value]
                : prev.custom_repeat.filter((d) => d !== value),
        }));
    }

    // const getUpdatedFields = ({ habitToUpdate, habitToEdit }) => {

    //     const modifiedFields = {};

    //     for (const key in habitToEdit) {
    //         if (JSON.stringify(habitToUpdate[key]) !== JSON.stringify(habitToEdit[key])) {
    //             modifiedFields[key] = habitToEdit[key]
    //         }
    //     }
    //     return modifiedFields;
    // }

    const getUpdatedFields = ({ habitToUpdate, habitToEdit }) => {
        const stripTime = (dateStr) => {
            if (!dateStr) return '';
            return new Date(dateStr).toISOString().split('T')[0];
        };

        const modifiedFields = {};

        for (const key in habitToEdit) {
            let currentValue = habitToEdit[key];
            let originalValue = habitToUpdate[key];

            if (key === 'startDate' || key === 'endDate') {
                currentValue = stripTime(currentValue);
                originalValue = stripTime(originalValue);
            }

            if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
                modifiedFields[key] = habitToEdit[key];
            }
        }

        return modifiedFields;
    };


    const handleFormChange = async (e) => {
        e.preventDefault();

        if (custom && habitToEdit.custom_repeat.length === 0) {
            dispatch(showToast({ message: 'Please select at least one day.', type: "error" }))
            return;
        }

        const finalData = getUpdatedFields({ habitToUpdate, habitToEdit });

        try {
            const url = `${baseURL}/user/user-habits/${habitToEdit._id}`

            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
            const response = await axios.patch(url, finalData, headers)

            const { message, success, data } = response.data;
            if (success) {
                dispatch(showToast({ message: message, type: "success" }))
            } else if (!success) {
                dispatch(showToast({ message: message, type: "error" }))
            }
            setUpdateHabit(false)
            navigate('/user/user-habits')
        } catch (err) {
            console.log("In Catch")
            dispatch(showToast({ message: err.message, type: "error" }))
            setUpdateHabit(false)
        }
    }

    useEffect(() => {
        const formatToInputDate = (dateStr) => {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toISOString().split('T')[0];
        };

        setHabitToEdit({
            ...habitToUpdate,
            startDate: formatToInputDate(habitToUpdate.startDate),
            endDate: formatToInputDate(habitToUpdate.endDate),
        });
    }, []);


    return (
        <div className="habitForm-overlay centered">
            <section className="habitForm">

                <div className="habitForm-header">
                    <h1>Add Habit</h1>
                    <button onClick={() => {
                        setUpdateHabit(false);
                        navigate('/user/user-habits');
                    }}>Close</button>
                </div>

                <form onSubmit={handleFormChange}>
                    <div className="habitForm-input">
                        <label htmlFor="habit">Habit</label>
                        <input
                            type="text"
                            placeholder="Habit name"
                            id="habit"
                            name="habit"
                            value={habitToEdit.habit}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="habitForm-input">
                        <label htmlFor="habitDescription" >Description</label>
                        <input
                            type="text"
                            placeholder="Description"
                            id="habitDescription"
                            name="habitDescription"
                            value={habitToEdit.habitDescription}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="habitForm-input">
                        <label htmlFor="repeat">Repeat</label>
                        <select
                            name="repeat"
                            id="repeat"
                            value={habitToEdit.repeat}
                            onChange={handleChange}
                            required
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="weekdays">Weekdays (Mon-Fri)</option>
                            <option value="weekends">Weekends (Sat-Sun)</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>

                    {custom && (
                        <div className="habitForm-input">
                            <label>Select Days</label>
                            <div className="day-selector">
                                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                    <label key={day}>
                                        <input
                                            type="checkbox"
                                            name="custom_repeat"
                                            value={day}
                                            checked={habitToEdit.custom_repeat.includes(day)}
                                            onChange={handleCustomChange}

                                        />
                                        {day}</label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="habitForm-input">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"

                            value={habitToEdit.startDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="habitForm-input">
                        <label htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={habitToEdit.endDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="habitForm-radio">
                        <div>
                            <input
                                type="radio"
                                id="active"
                                name="state"
                                value="active"
                                checked={habitToEdit.state === 'active'}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="active">Active</label>
                        </div>

                        <div>
                            <input
                                type="radio"
                                id="suspended"
                                name="state"
                                value="suspended"
                                checked={habitToEdit.state === 'suspended'}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="suspended">Suspended</label>
                        </div>

                        <div>
                            <input
                                type="radio"
                                id="archived"
                                name="state"
                                value="archived"
                                checked={habitToEdit.state === 'archived'}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="archived">Archived</label>
                        </div>
                    </div>

                    <button type="submit">Update</button>
                </form>
            </section>
        </div>
    );
}

export default UpdateHabitForm;