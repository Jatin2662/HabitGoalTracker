


import React, { useState } from "react";
import '../styles/Login.css';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { showToast } from "../redux/slice/toastSlice";


function SignUp() {

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

        try {
            const url = 'http://localhost:8080/auth/signup';
            const response = await axios.post(url, formData);

            const { message, success } = response.data;

            dispatch(showToast({ message: message, type: success ? "success" : "error" }));

            console.log(formData)

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: ""
            })
        } catch (err) {
            console.log(err);
            dispatch(showToast({ message: err.message + ', ' + err.response?.data?.message + ', ' + err.status, type: "error" }));
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

            <button>Sign Up with Google</button>
        </section>
    );
}

export default SignUp;