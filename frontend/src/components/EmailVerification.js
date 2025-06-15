


import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "../redux/slice/toastSlice";
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from "axios";



function EmailVerification() {

    const baseURL = process.env.REACT_APP_BACKEND_URL;

    const { token } = useParams()
    const [email, setEmail] = useState();
    const [message, setMessage] = useState('Verifying...');
    const [sendMessage, setSendMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = async (e) => {
        try {
            e.preventDefault();

            const url = `${baseURL}/auth/verify`;
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

    useEffect(() => {

        if(!token) return;

        const emailVerify = async () => {
            try {

                const url = `${baseURL}/auth/verify/${token}`;
                const response = await axios.get(url);

                const { message, success } = response.data;

                setMessage(message);
            } catch (error) {
                dispatch(showToast({ message: error.response?.data?.message, type: "error" }))
            }
        }

        emailVerify();
    }, [token])

    return (
        <section className="login centered">
            {!token ? (
                <>
                    <h1><span>Email Verification</span> <span className="back-to-login" onClick={() => navigate(-1)} >Go back</span> </h1>
                    {/* <Link to="/auth">Go Back</Link> */}
                    
                    <div className="login-msg">{sendMessage}</div>

                    <div><a href="https://mail.google.com/" target="_blank" rel="noopener noreferrer" >Open inbox</a></div>

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
                </>
            )
             : 
            <div>
                <h1>{message}</h1>
                <Link to="/auth">LogIn</Link>
            </div>
            }
        </section>
    );
}

export default EmailVerification;