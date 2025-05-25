


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
                    <button onClick={close}>Close</button>
                </div>

                <div>
                    <span><MdEmail /></span>
                    <span>tracker@gmail.com</span>
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