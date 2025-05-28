


import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showToast } from "../../redux/slice/toastSlice";
import { setTheme } from "../../redux/slice/themeSlice";
import '../../styles/UserSettings.css';
import { hideNav } from "../../redux/slice/navSlice";


function UserSettings() {

    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        theme: ''
    });
    const originalData = useRef({});
    const dispatch = useDispatch();
    const [isModified, setIsModified] = useState(true);
    // const [label, setLabel] = useState('light')
    const [disable, setDisable] = useState(true);


    const handleChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }

    const saveChanges = () => {
        updateData();
    }

    const toggleTheme = () => {
        const newTheme = userDetails.theme === 'light' ? 'dark' : 'light';
        setUserDetails({ ...userDetails, theme: newTheme });
        // setLabel(newTheme === 'light' ? 'dark' : 'light');

        // localStorage.setItem('theme', newTheme);
        dispatch(setTheme(newTheme))
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const getUserData = async () => {

        try {
            const url = 'http://localhost:8080/user/user-settings'
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
            const response = await axios.get(url, headers);

            const { message, success, data } = response.data;

            setUserDetails({
                firstName: data.firstName,
                lastName: data.lastName,
                theme: data.theme
            })

            // setLabel(data.theme === 'light' ? 'dark' : 'light');

            // New Changes start
            dispatch(setTheme(data.theme))
            document.documentElement.setAttribute('data-theme', data.theme);
            // New Chnages Ended

            originalData.current = {
                firstName: data.firstName,
                lastName: data.lastName,
                theme: data.theme
            };

            dispatch(showToast({ message: message, type: success ? "success" : "error" }))
        } catch (err) {
            dispatch(showToast({ message: err.response?.data?.message || "An unexpected error occurred", type: "error" }))
        }
    }

    const getModifiedFields = (originalData, userDetails) => {
        const isObjectEmpty = (obj) => Object.keys(obj).length === 0;
        const modifiedFields = {};

        for (const key in originalData) {

            if (JSON.stringify(originalData[key]) !== JSON.stringify(userDetails[key])) {
                modifiedFields[key] = userDetails[key]
            }
        }

        setIsModified(isObjectEmpty(modifiedFields));
        return modifiedFields;
    }

    const updateData = async () => {

        try {
            const finalData = getModifiedFields(originalData.current, userDetails);
            const url = 'http://localhost:8080/user/user-settings'
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
            const response = await axios.post(url, finalData, headers);;

            const { message, success, data } = response.data;

            originalData.current = { ...userDetails };

            dispatch(showToast({ message: message, success: success ? "success" : "error" }))
            setIsModified(true);
            setDisable(true);
        } catch (err) {
            dispatch(showToast({ message: err.response?.data?.message || "An unexpected error occurred", type: "error" }))
        }
    }

    useEffect(() => {
        const modified = getModifiedFields(originalData.current, userDetails);
        setIsModified(Object.keys(modified).length === 0);
    }, [userDetails]);


    useEffect(() => {
        getUserData();
        dispatch(hideNav('Settings'))
    }, [])

    return (
        <>
            {/* <h1>User Settings</h1> */}
            {/* <ul>
                <li>Theme</li>
                <li>Reset Password</li>
                <li></li>
            </ul> */}
            <main className="user-settings flex-col">
                <section className="personal-details flex-col" >
                    <div>
                        <h1>Personal Details</h1>
                        <button className="us-btn" onClick={() => setDisable(!disable)}>Edit</button>
                    </div>
                    <form className="flex-col">
                        <input
                            type="text"
                            placeholder="First Name"
                            name="firstName"
                            value={userDetails.firstName}
                            onChange={handleChange}
                            disabled={disable}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            name="lastName"
                            value={userDetails.lastName}
                            onChange={handleChange}
                            disabled={disable}
                        />
                    </form>
                </section>

                <section className="myTheme" >
                    <h1>Current Theme: {userDetails.theme}</h1>
                    <button className="us-btn" onClick={toggleTheme} >{userDetails.theme === 'light' ? 'dark' : 'light'}</button>
                </section>

                <div className="save-button-container">
                    <button className="us-btn" onClick={saveChanges} disabled={isModified} >Save</button>
                </div>
            </main>
        </>
    );
}

export default UserSettings;