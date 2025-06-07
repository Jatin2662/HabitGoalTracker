


import React from "react";
import '../styles/Contact.css';
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";

function Contact({ setShowContact }) {

    const close = () => {
        setShowContact(false);
    }

    return (
        <section className="contact">
            <main className="contact-overlay">
                <div className="c-o-h">
                    <span>Contact Us</span>
                    <button onClick={close} className="save-btn" >Close</button>
                </div>

                <div>
                    <span><MdEmail /></span>
                    <a href="mailto:tracker3485@gmail.com">tracker3485@gmail.com</a>
                </div>

                <div>
                    <span><FaPhoneAlt /></span>
                    <span>+91 0984340642</span>
                </div>
            </main>
        </section>
    );
}

export default Contact;