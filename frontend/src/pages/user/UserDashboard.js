


import React, { useEffect } from "react";
import '../../styles/UserDashboard.css';
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { showToast } from "../../redux/slice/toastSlice";
import { useState } from "react";
import { BsFire } from "react-icons/bs";
import { hideNav } from "../../redux/slice/navSlice";
import DashboardCard from "../../components/DashboardCard";

function UserDashboard() {

    const userName = localStorage.getItem('loggedInUser') || 'Logger';
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme.theme)
    // console.log("Dashboard -> ", theme);
    const [streak, setStreak] = useState(0);
    const [count, setCount] = useState(0);
    const [rate, setRate] = useState(0);
    const [today, setToday] = useState(0);
    const [habitStats, setHabitStats] = useState([])
    // const navigate = useNavigate();

    const cardTitle = [
        {
            id: 1,
            title: 'Streak',
            data: <div className="streak centered">{streak}<span><BsFire className="centered"/></span></div>
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

            const { message, success, count, overallCompletionRate, habitStats, todayProgress, streak } = response.data;

            setCount(count);
            setRate(overallCompletionRate);
            setToday(todayProgress);
            setStreak(streak);

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
                        <DashboardCard id={ct.id} title={ct.title} data={ct.data} />
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