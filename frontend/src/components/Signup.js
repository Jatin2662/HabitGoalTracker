


import React, { useState } from "react";
import '../styles/Login.css';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { showToast } from "../redux/slice/toastSlice";
import { hideLoader, showLoader } from "../redux/slice/loaderSlice";


function SignUp() {

    const baseURL = process.env.REACT_APP_BACKEND_URL;

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {

        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(showLoader('Please wait while we process'))

        try {
            const url = `${baseURL}/auth/signup`;
            const response = await axios.post(url, formData);

            const { message, success } = response.data;

            dispatch(showToast({ message: message, type: success ? "success" : "error" }));

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: ""
            })

            dispatch(hideLoader())
            navigate('/auth/login')
        } catch (err) {
            dispatch(hideLoader());

            if (err.response?.status === 409) {
                dispatch(showToast({
                    message: "User already exists. Redirecting to login...",
                    type: "success"
                }));
                navigate('/auth/login');
            } else {
                const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";
                dispatch(showToast({ message: errorMessage, type: "error" }));
            }
        }
    }

    return (
        <section className="login centered">
            <h1>Get Started</h1>
            <div className="login-switch">
                <span>Already have an account?</span>
                <Link to="/auth/login" >LogIn</Link>
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Submit</button>
            </form>

            <button onClick={() => dispatch(showToast({ message: "Currently Unavailable, Work in Progress!", type: "success" }))} >Sign Up with Google</button>
        </section>
    );
}

export default SignUp;