

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { hideNav } from "../../redux/slice/navSlice";
import { showLoader, hideLoader } from "../../redux/slice/loaderSlice";
import { showToast } from "../../redux/slice/toastSlice";
import { useDispatch } from "react-redux";
import axios from 'axios';
import useSound from 'use-sound';
import '../../styles/UserToday.css'
import drum2 from '../../assets/sound/drum2.mp3'
import happy from '../../assets/image/happy.webp'


function UserToday() {

    const dispatch = useDispatch()
    const todayDate = useMemo(() => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }))

    const [playBell, { stop: stopBell, sound: bellSound }] = useSound(drum2, { volume: 0.5 });
    const [isPlaying, setIsPlaying] = useState(false);

    // const [play] = useSound(drum, {
    //     sprite: {
    //         kick: [0, 500],
    //         hihat: [374, 180],
    //         snare: [666, 290],
    //         cowbell: [968, 200],
    //     }
    // });

    const handleMoodToggle = () => {
        if (!bellSound) return;

        if (!isPlaying) {
            playBell();
            setIsPlaying(true);
            bellSound.on('end', () => setIsPlaying(false));
        } else {
            stopBell();
            setIsPlaying(false);
        }
    };

    // const useKeyboardBindings = (map) => {
    //     useEffect(() => {
    //         const handlePress = (ev) => {
    //             const handler = map[ev.key];

    //             if (typeof handler === 'function') {
    //                 handler();
    //             }
    //         };

    //         window.addEventListener('keydown', handlePress);

    //         return () => {
    //             window.removeEventListener('keydown', handlePress);
    //         };
    //     }, [map]);
    // };

    // useKeyboardBindings({
    //     1: () => play({ id: 'kick' }),
    //     2: () => play({ id: 'hihat' }),
    //     3: () => play({ id: 'snare' }),
    //     4: () => play({ id: 'cowbell' }),
    // })

    const [data, setData] = useState([])

    const handleChange = useCallback((e, id) => {
        const checked = e.target.checked ? 'completed' : 'pending';

        const updatedHabit = data.map((dt) => {
            if (dt._id === id) {
                return { ...dt, status: checked }
            }
            return dt;
        })

        setData(updatedHabit)
    }, [data])

    const getHabits = async () => {
        dispatch(showLoader("Getting today's logs."))
        try {
            const date = new Date();
            const formattedDate = date.toISOString().split("T")[0];
            const url = `http://localhost:8080/user/user-today?date=${formattedDate}`
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
            const response = await axios.get(url, headers);

            const { message, success, habitLogs } = response.data;

            setData(habitLogs);

            dispatch(showToast({ message: message, type: success ? "success" : "error" }))
        } catch (error) {
            dispatch(showToast({ message: error.response?.data?.message, type: "error" }))
        }
        dispatch(hideLoader())
    }

    const updateCompletionStatus = async () => {
        dispatch(showLoader("Updating status!"))
        try {

            const updatedLogs = data.map((dt) => {
                return {
                    _id: dt._id,
                    status: dt.status
                }
            })
            const url = 'http://localhost:8080/user/user-today';
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
            const response = await axios.patch(url, updatedLogs, headers)

            const { message, success, logData } = response.data;

            dispatch(showToast({ message: message, type: success ? "success" : "error" }))
        } catch (error) {
            dispatch(showToast({ message: error.response?.data?.message, type: "error" }))
        }
        dispatch(hideLoader())
    }

    const [show, setShow] = useState(false)

    useEffect(() => {
        getHabits();
        dispatch(hideNav("Today's Log"))
    }, [])

    useEffect(() => {
    if (data.some(dt => dt.status === 'pending')) {
        const interval = setInterval(() => {
            setShow(prev => !prev);
        }, 3000);

        return () => clearInterval(interval);
    }
}, [data]);


    return (
        <main className="user-today">
            <div className="sound" onClick={handleMoodToggle}>
                {isPlaying ? 'Pause Mood' : 'Set Mood'}
            </div>
            <div className={`surprise ${show ? "show" : "hide"}`}>
                <img src={happy} />
            </div>
            <h1>{todayDate}</h1>

            <section className="todaysLog">
                {data.length === 0 ?
                    <h1>No habits logged for today.</h1>
                    :
                    data.map((dt) => {
                        return (
                            <section className={`singleLog ${dt.status}`} key={dt._id}>
                                <div className="centered" >
                                    {dt.habit}
                                </div>
                                <p>{dt.habitDescription}</p>
                                <div className="centered" >
                                    <span>
                                        <input
                                            type="checkbox"
                                            checked={dt.status === 'completed'}
                                            onChange={(e) => handleChange(e, dt._id)}
                                        />
                                        <label>{dt.status === 'completed' ? 'Completed' : 'Pending'}</label>
                                    </span>
                                </div>
                            </section>
                        )
                    })
                }
            </section>
            <div className="centered" >
                <button className="save-btn extra" onClick={updateCompletionStatus} disabled={data.length === 0}>Save</button>
            </div>
        </main>
    );
}

export default UserToday;