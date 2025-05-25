


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import '../styles/HabitForm.css';
import { showToast } from "../redux/slice/toastSlice";


// {
//     "message": "Bad request",
//     "error": {
//         "_original": {
//             "habit": "Workout",
//             "habitDescription": "Dumbell",
//             "repeat": "daily",
//             "custom_repeat": "['Mon']",
//             "endDate": "",
//             "state": "active"
//         },
//         "details": [
//             {
//                 "message": "\"custom_repeat\" must be an array",
//                 "path": [
//                     "custom_repeat"
//                 ],
//                 "type": "array.base",
//                 "context": {
//                     "label": "custom_repeat",
//                     "value": "['Mon']",
//                     "key": "custom_repeat"
//                 }
//             }
//         ]
//     },
//     "success": false
// }


function HabitForm({ setShowForm, onSuccess }) {

    const [habitData, setHabitData] = useState({
        habit: '',
        habitDescription: '',
        repeat: 'daily',
        custom_repeat: [],
        startDate: '',
        endDate: '',
        state: ''
    })

    const custom = habitData.repeat === 'custom';
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setHabitData({ ...habitData, [e.target.name]: e.target.value })
    }

    const handleCustomChange = (e) => {
        const checked = e.target.checked;
        const value = e.target.value;
        setHabitData((prev) => ({
            ...prev,
            custom_repeat: checked
                ? [...prev.custom_repeat, value]
                : prev.custom_repeat.filter((d) => d !== value),
        }));
    }

    const handleFormChange = async (e) => {
        e.preventDefault();

        // added latest
        if (custom && habitData.custom_repeat.length === 0) {
            dispatch(showToast({ message: 'Please select at least one day.', type: "error" }))
            return;
        }

        try {
            const { habit, habitDescription, repeat, custom_repeat, startDate, endDate, state } = habitData;

            const finalData = {
                habit,
                habitDescription,
                repeat,
                custom_repeat,
                startDate: startDate || new Date().toISOString(),
                endDate: endDate === "" ? null : endDate,
                state
            };

            const url = 'http://localhost:8080/user/user-habits';
            const token = localStorage.getItem('token');
            const headers = {
                headers: {
                    'Authorization': token
                }
            };

            const response = await axios.post(url, finalData, headers);
            const { message, success, error } = response.data;

            // console.log(response)

            if (success) {
                // onSuccess && onSuccess();
                dispatch(showToast({ message: message, type: "success" }))
            }

            setShowForm(false)
        } catch (error) {
            // console.log("In catch")
            // console.log(error)
            // console.log(error.response.data.error.details?.[0]?.message)

            const detail = error.response.data?.error?.details?.[0]?.message || 'Unknown validation error';

            if (error.response) {
                dispatch(showToast({ message: error.response.status + ', ' + error.response.data.message + ', ' + detail, type: "error" }))
                setShowForm(false)
                // console.error("Status:", error.response.status);
                // console.error("Message:", error.response.data.message);
            }
            else {
                dispatch(showToast({ message: error.message, type: "error" }))
                setShowForm(false)
                // console.error("Error:", error.message);
            }
        }

        // console.log(habitData);

        setHabitData({
            habit: '',
            habitDescription: '',
            repeat: '',
            custom_repeat: [],
            startDate: '',
            endDate: '',
            state: ''
        })
    }

    return (
        <div className="habitForm-overlay centered">
            <section className="habitForm">

                <div className="habitForm-header">
                    <h1>Add Habit</h1>
                    <button onClick={() => setShowForm(false)}>Close</button>
                </div>

                <form onSubmit={handleFormChange}>
                    <div className="habitForm-input">
                        <label htmlFor="habit">Habit</label>
                        <input
                            type="text"
                            placeholder="Habit name"
                            id="habit"
                            name="habit"
                            value={habitData.habit}
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
                            value={habitData.habitDescription}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="habitForm-input">
                        <label htmlFor="repeat">Repeat</label>
                        <select
                            name="repeat"
                            id="repeat"
                            value={habitData.repeat}
                            onChange={handleChange}
                            required
                        >
                            {/* <option value="" disabled>Select frequency</option> */}
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="weekdays">Weekdays (Mon-Fri)</option>
                            <option value="weekends">Weekends (Sat-Sun)</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>

                    {/* {custom && <div className="habitForm-input">
                        <label htmlFor="custom_repeat">Custom</label>
                        <input
                            type="text"
                            id="custom_repeat"
                            name="custom_repeat"
                            value={habitData.custom_repeat}
                            onChange={handleChange}
                        />
                    </div>} */}

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
                                            checked={habitData.custom_repeat.includes(day)}
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
                            value={habitData.startDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="habitForm-input">
                        <label htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={habitData.endDate}
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
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="archived">Archived</label>
                        </div>
                    </div>

                    <button type="submit">Save</button>
                </form>
            </section>
        </div>
    );
}

export default HabitForm;