


import React, { useState } from "react";
import axios from 'axios';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTheme } from "../redux/slice/themeSlice";


function LogIn() {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [message, setMessage] = useState('');

    const handleChange = (e) => {

        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = formData;

        try {
            const url = 'http://localhost:8080/auth/login';
            const response = await axios.post(url, formData);

            const { message, success, jwtToken, email, name, error, theme } = response.data;

            if (success) {
                localStorage.setItem('token', jwtToken)
                localStorage.setItem('loggedInUser', name)
                // localStorage.setItem('role', role)
                localStorage.setItem('email', email)
                console.log("Login -> ",theme)
                // console.log(response);
                dispatch(setTheme(theme))
                // localStorage.setItem('theme', theme)

                navigate('/user/user-dashboard')

            } else if (!success) {
                setMessage(message);
            } else if (error) {
                const details = error?.details?.[0]?.message || "Something went wrong";
                setMessage(details);
            } else {
                setMessage(message || "Login failed");
            }

        } catch (err) {
            const errorMsg = err.response?.data?.message || "Server error";
            setMessage(errorMsg);
        }

        setFormData({
            email: "",
            password: ""
        })
    }

    return (
        <section className="login centered">
            <h1>Get Started</h1>
            <div className="login-msg">{message}</div>
            <div className="login-switch">
                <span>New User?</span>
                <Link to="/auth/signup">SignUp</Link>
            </div>
            <form onSubmit={handleSubmit}>
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

            <button>Sign Up with Google</button>
        </section>
    );
}

export default LogIn;