

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "../redux/slice/toastSlice";
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from "axios";


function ResetPassword() {

    const baseURL = process.env.REACT_APP_BACKEND_URL;

    const { token } = useParams()
    const [email, setEmail] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [sendMessage, setSendMessage] = useState('');
    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: ''
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = async (e) => {
        try {
            e.preventDefault();

            const url = `${baseURL}/auth/reset-password`;
            const response = await axios.post(url, { email })

            const { message, success } = response.data;

            dispatch(showToast({ message: message, type: success ? "success" : "error" }))
            setSendMessage(message)

            setEmail('');

        } catch (error) {
            dispatch(showToast({ message: error.response?.data?.message, type: "error" }))
            setEmail('');
        }
    }

    const handlePasswordsChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value })
    }

    const handleResetChange = async (e) => {
        try {
            e.preventDefault();

            if (passwords.password !== passwords.confirmPassword) {
                // dispatch(showToast({ message: "passwords does not match", type: "error" }))
                setSendMessage("passwords does not match");
                return;
            }

            const { password, confirmPassword } = passwords;

            const url = `${baseURL}/auth/reset-password/${token}`
            const response = await axios.post(url, { password, confirmPassword });

            const { message, success } = response.data;

            dispatch(showToast({ message: message, type: success ? "success" : "error" }))
            setPasswords({
                password: '',
                confirmPassword: ''
            })
            if (success) {
                navigate("/auth", { replace: true })
            }
        } catch (err) {
            dispatch(showToast({ message: err.response?.data?.message, type: "error" }))
        }
    }

    useEffect(() => {
        if (!token) return;

        const getUser = async () => {
            try {
                const url = `${baseURL}/auth/reset-password/${token}`;
                const response = await axios.get(url);

                const { message, success, user } = response.data;

                dispatch(showToast({ message: message, type: success ? "success" : "error" }))
                setUserEmail(user.email)

            } catch (err) {
                dispatch(showToast({ message: err.response?.data?.message, type: "error" }))
            }
        }

        getUser();
    }, [token])

    return (
        <section className="login centered">
            <h1> <span>Reset Password</span> <span className="back-to-login" onClick={() => navigate("/auth", { replace: true })} >Log In</span> </h1>
            <div className="login-msg">{sendMessage}</div>
            <div><a href="https://mail.google.com/" target="_blank" rel="noopener noreferrer" >Open inbox</a></div>
            {!token ?
                <form onSubmit={handleChange} >
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" >Send Link</button>
                </form>
                :
                <>
                    <p className="myEmail" >{userEmail}</p>
                    <form onSubmit={handleResetChange} >
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={passwords.password}
                            onChange={handlePasswordsChange}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handlePasswordsChange}
                            required
                        />
                        <button type="submit" >Reset Password</button>
                    </form>
                </>
            }
        </section>
    );
}

export default ResetPassword;