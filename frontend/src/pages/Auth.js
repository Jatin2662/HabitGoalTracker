

import React from "react";
import { Outlet } from 'react-router-dom';
import '../styles/Auth.css';

function Auth() {

    const features = [
        {
            id: 1,
            title: "Intuitive Dashboard",
            description: "Visualize your daily, weekly, and monthly progress with ease."
        },
        {
            id: 2,
            title: "Custom Habit Creation",
            description: "Set, edit, and manage habits that matter most to you."
        },
        {
            id: 3,
            title: "Streak Tracking",
            description: "Stay motivated by watching your streaks grow."
        }
    ]

    return (
        <>
            <nav className="auth-nav centered">
                <span>Tracker</span>
            </nav>
            <main className="auth-main">
                <section className="auth-main-content">
                    <h1>Tracker</h1>
                    <p>New journey begins! Track your daily habits and stay fit.</p>
                </section>

                <section className="auth-main-components centered">
                    <Outlet />
                </section>
            </main>
            <section className="auth-features">
                <div className='auth-features-box'>
                    {features.map((fea) => (
                        <div key={fea.id} className='auth-feature centered'>
                            <h1>{fea.title}</h1>
                            <p>{fea.description}</p>
                        </div>
                    ))}
                </div>
            </section>
            <nav className="auth-btm-nav centered">
                <span>© 2025 Tracker. All rights reserved.</span>
            </nav>
        </>
    );
}


export default Auth;