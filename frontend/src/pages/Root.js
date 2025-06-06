

import React, { useState } from 'react';
import '../styles/Root.css';
import Contact from '../components/Contact';
import { useNavigate } from 'react-router-dom';
import { FaGithub } from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";

function Root() {

    const [showContact, setShowContact] = useState(false);
    
    const navigate = useNavigate();

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
        },
        {
            id: 4,
            title: "Responsive Design",
            description: "Smooth sailing on desktop, tablet, or mobile."
        }
    ]

    return (
        <>
            <nav className='root-nav flex-row-spe'>
                <span>Tracker</span>
                <button onClick={()=> navigate('/auth')}>Login/Signup</button>
            </nav>
            <main>
                <section className='root-content'>
                    <h1>Welcome to Tracker Your Daily Discipline Tracker</h1>

                    <p>Tracker is a powerful habit tracker built with the latest technology, designed to help you stay on course with your daily routines and long-term goals. Whether you're looking to build better habits, break bad ones, or simply keep your daily routine in check, our app keeps your progress shipshape.</p>
                </section>

                <section className='root-features'>
                    <h2>Key Features</h2>
                    <div className='root-features-box'>
                        {features.map((fea) => (
                            <div key={fea.id} className='root-feature'>
                                <h1>{fea.title}</h1>
                                <p>{fea.description}</p>
                            </div>
                        ))}
                    </div>
                    <p>Set your sails toward a more productive life—track, analyze, and conquer your habits with Tracker!</p>
                </section>
            </main>
            <footer className='root-footer'>
                <section className='root-footer-content'>
                    <div className="footer-brand">Tracker</div>
                    <div className="footer-links">
                        <a href="/">About</a>
                        <a href="/privacy" target='_blank'>Privacy</a>
                        <a href="/terms&conditions" target='_blank'>Terms&Conditions</a>
                        <span onClick={()=> setShowContact(true)}>Contact</span>
                    </div>
                    <div className="footer-socials">
                        <a href="https://github.com/Jatin2662" target="_blank"><span className='centered' ><FaGithub /></span><span>GitHub</span></a>
                        <a href="https://facebook.com" target='_blank'><span className='centered' ><FaSquareFacebook /></span><span>Facebook</span></a>
                    </div>
                </section>
                <p>© 2025 Tracker. All rights reserved.</p>
            </footer>
            {showContact && <Contact setShowContact={setShowContact} />}
        </>
    );
}


export default Root;