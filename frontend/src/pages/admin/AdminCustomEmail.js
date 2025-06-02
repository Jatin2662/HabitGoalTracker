

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideNav } from "../../redux/slice/navSlice";
import { showToast } from '../../redux/slice/toastSlice';
import axios from 'axios';
import '../../styles/AdminCustomEmail.css';

function AdminCustomEmail() {

    // What I am doing in this?
    // I am  creating a document if there is none.
    // Why doing this?
    // Because I need only one document as it can be memory efficient i.e. change when needed noo extra work.
    // First time on this page I do a get request and in backend I am checking if no document return and if yes return doc.
    // Then if there is doc update input fields, then chencking again if on get there was a document I set mailId and can just update the existing doc.
    // and if no doc then no mailId will be set so it will be empty and if empty then method will be post so we can add a new document(Happy) 

    const dispatch = useDispatch();

    let mailDataCopy = {};
    const [disable, setDisable] = useState(true);
    const [save, setSave] = useState(true);
    const [mailId, setMailId] = useState('')
    const [mailData, setMailData] = useState({
        subject: '',
        body: '',
        end: ''
    })
    // const save = mailData === mailDataCopy;

    const handleChange = (e) => {

        setMailData({ ...mailData, [e.target.name]: e.target.value })
        if(mailData !== mailDataCopy) setSave(false)
            console.log(save);
    }

    const handleFormChange = async (e) => {
        e.preventDefault();

        try {

            const url = 'http://localhost:8080/admin/admin-setCustomEmail'
            // const headers = {
            //     headers: {
            //         'Authorization': localStorage.getItem('token')
            //     }
            // }

            const { subject, body, end } = mailData;

            const finalData = {
                subject,
                body,
                end,
                mailId: mailId || ''
            }

            // we need to decide between put and post as If we use post new will be created but we want to update if there is document so below is used

            const method = mailId ? 'put' : 'post';

            const response = await axios({
                method: method,
                url: url,
                data: finalData,
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });

            const { message, success, mail } = response.data;

            dispatch(showToast({ message: message, type: success ? "success" : "error" }));
            setMailData(mail)
            setDisable(true);
            setSave(true);
        } catch (error) {
            dispatch(showToast({ message: error.response?.data?.message || "catch", type: "error" }))
        }
    }

    const getMailContent = async () => {
        try {
            const url = 'http://localhost:8080/admin/admin-setCustomEmail'
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }

            const response = await axios.get(url, headers);

            const { message, success, mailContent } = response.data;

            if (success) {
                setMailData({
                    subject: mailContent[0].subject,
                    body: mailContent[0].body,
                    end: mailContent[0].end
                })

                setMailId(mailContent[0]._id)
            }
            dispatch(showToast({ message: message, type: success ? "success" : "error" }));

            // console.log(mailContent)
            mailDataCopy = mailContent
            console.log(mailDataCopy)

        } catch (error) {
            dispatch(showToast({ message: error.response?.data?.message, type: "error" }))
        }
    }

    useEffect(() => {
        getMailContent();
        dispatch(hideNav('Custom Email'))
    }, [])

    return (
        <main className="admin-mail">
            <div className="admin-header">
                <h1>Set Email content</h1>
                <button className="inactive-user-btn mail-btn" onClick={() => setDisable(!disable)} >Edit</button>
            </div>
            <form onSubmit={handleFormChange} >
                <div className="input-fields">
                    <label htmlFor="subject">Subject</label>
                    <input
                        type="text"
                        placeholder="Subject"
                        name="subject"
                        id="subject"
                        value={mailData.subject}
                        onChange={handleChange}
                        disabled={disable}
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
                        onChange={handleChange}
                        disabled={disable}
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
                        onChange={handleChange}
                        disabled={disable}
                        required
                    />
                </div>

                <button type="submit" className="inactive-user-btn mail-btn" disabled={save} >Save</button>
            </form>
        </main>
    );
}

export default AdminCustomEmail;


// Your presence matters, Habit tracker waiting for new Streaks!!!

// We have noticed that you have been inactive for a long time, to build a better tomorrow needs consistency