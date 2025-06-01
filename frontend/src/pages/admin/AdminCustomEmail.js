

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideNav } from "../../redux/slice/navSlice";
import '../../styles/AdminCustomEmail.css';

function AdminCustomEmail(){

    const dispatch = useDispatch();

    const [mailData, setMailData] = useState({
        subject: '',
        body: '',
        end: ''
    })

    const handleFormChange = (e) =>{

        setMailData({ ...mailData, [e.target.name] : e.target.value })
    }

    useEffect(()=>{
        dispatch(hideNav('Custom Email'))
    })

    return(
        <main className="admin-mail">
            <div className="admin-header">
                <h1>Set Email content</h1>
            </div>
            <form>
                <div className="input-fields">
                    <label htmlFor="subject">Subject</label>
                    <input
                    type="text"
                    placeholder="Subject"
                    name="subject"
                    id="subject"
                    value={mailData.subject}
                    onChange={handleFormChange}
                    required
                    />
                </div>
                <div className="input-fields">
                    <label htmlFor="body">Body</label>
                    <textarea
                    type="text"
                    placeholder="Body"
                    name="body"
                    id="body"
                    value={mailData.body}
                    onChange={handleFormChange}
                    required
                    rows={5}
                    />
                </div>
                <div className="input-fields">
                    <label htmlFor="end">End</label>
                    <input
                    type="text"
                    placeholder="End"
                    name="end"
                    id="end"
                    value={mailData.end}
                    onChange={handleFormChange}
                    required
                    />
                </div>
            </form>
        </main>
    );
}

export default AdminCustomEmail;