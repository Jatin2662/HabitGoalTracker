


import React, { useEffect } from "react";
import '../../styles/UserDashboard.css';
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { showToast } from "../../redux/slice/toastSlice";
import { useState } from "react";
import { hideNav } from "../../redux/slice/navSlice";

function UserDashboard() {

    const userName = localStorage.getItem('loggedInUser') || 'Logger';
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme.theme)
    // console.log("Dashboard -> ", theme);
    const [count, setCount] = useState(0);
    const [rate, setRate] = useState(0);
    const [today, setToday] = useState(0);
    const [habitStats, setHabitStats] = useState([])
    // const navigate = useNavigate();

    const cardTitle = [
        {
            id: 1,
            title: 'Streak',
            data: 'Static'
        },
        {
            id: 2,
            title: 'Total habits',
            data: count
        },
        {
            id: 3,
            title: 'Overall completion Rate',
            data: `${rate}%`
        },
        {
            id: 4,
            title: "Today's Progress",
            data: `${today} Completed`
        },
        {
            id: 5,
            title: 'Weekly summary',
            data: 'Static'
        }
    ]

    // const logout = ()=>{
    //     localStorage.clear();

    //     navigate('/', {replace: true})
    // }

    const getData = async () => {

        try {
            const url = 'http://localhost:8080/user/user-dashboard'
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
            const response = await axios.get(url, headers);

            const { message, success, count, overallCompletionRate, habitStats, todayProgress } = response.data;

            setCount(count);
            setRate(overallCompletionRate);
            setToday(todayProgress);

            setHabitStats(habitStats);
            dispatch(showToast({ message: message, type: success ? "success" : "error" }))

        } catch (err) {
            dispatch(showToast({ message: err.response?.data?.message, type: "error" }))
        }
    }

    useEffect(()=>{
        dispatch(hideNav('Dashboard'))
    },[])

    useEffect(() => {
        getData();
        // const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    return (
        <>
            <nav className="dashboard-nav centered">{userName + `'s`} Dashboard</nav>
            <main className="dashboard-content">
                <section className="dashboard-cards">
                    {cardTitle.map((ct) => (
                        <div className="dashboard-card" key={ct.id} >
                            <h1>{ct.title}</h1>
                            <p>{ct.data}</p>
                        </div>
                    ))}
                </section>

                <section className="dashboard-overview">
                    <h1>Habit's Overview</h1>
                    <div className="ds-cards">
                        {habitStats.length === 0 ?
                        <h1>Nothing</h1> :
                        habitStats.map((hs) => (
                            <div className="ds-card" key={hs.habitId}>
                                <h1>{hs.habit}</h1>
                                <p>{hs.habitDescription}</p>
                                <p><span>Total entries: </span>{hs.totalLogs}</p>
                                <p><span>Completed: </span>{hs.completedLogs}</p>
                                <p><span>Completion Rate: </span>{hs.completionRate} %</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}

export default UserDashboard;