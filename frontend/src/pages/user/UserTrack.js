

import React, { useState, useMemo, useEffect } from 'react';
import axios from "axios";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useDispatch } from "react-redux";
import { showToast } from "../../redux/slice/toastSlice";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/UserTrack.css';

const localizer = momentLocalizer(moment);

function UserTrack() {

  const dispatch = useDispatch();

  const getData = async () => {

    try {

      const url = 'http://localhost:8080/user/user-track'
      const headers = {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }
      const response = await axios.get(url, headers)

      const { message, habits, success } = response.data;

      dispatch(showToast({ message: message, type: success ? "success" : "error" }))

      setHabitLogs(habits)

      console.log(habits);

    } catch (err) {
      dispatch(showToast({ message: err.response?.data?.message || "An unexpected error occurred", type: "error" }))
    }
  }
  const [habitLogs, setHabitLogs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  const events = useMemo(() => {

    const allEvents = [];

    habitLogs.forEach((log) => {

      if (log.state == 'suspended') return

      const start = new Date(log.startDate);
      const end = log.endDate ? new Date(log.endDate) : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);

      const repeatType = log.repeat.toLowerCase();
      const repeatDays = (log.custom_repeat || []).map(day => dayMap[day]);

      for (let current = new Date(start); current <= end; current.setDate(current.getDate() + 1)) {
        const currentDay = current.getDay();
        let addEvent = false;

        switch (repeatType) {
          case 'daily':
            addEvent = true;
            break;

          case 'weekly':
            addEvent = currentDay === start.getDay();
            break;

          case 'monthly':
            addEvent = current.getDate() === start.getDate();
            break;

          case 'weekdays':
            addEvent = currentDay >= 1 && currentDay <= 5;
            break;

          case 'weekends':
            addEvent = currentDay === 0 || currentDay === 6;
            break;

          case 'custom':
            addEvent = repeatDays.includes(currentDay);
            break;

          default:
            addEvent = current.toDateString() === start.toDateString();
            break;
        }

        if (addEvent) {
          allEvents.push({
            id: `${log._id}-${current.toISOString()}`,
            title: log.habit,
            start: new Date(current),
            end: new Date(current),
            allDay: true
          });
        }
      }
    });

    return allEvents;
  }, [habitLogs]);

  // console.log("events:", events);
  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDate(null);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const filteredHabits = useMemo(() => {
    if (!selectedDate) return [];

    const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

    return habitLogs.filter(log => {
      if (log.state === 'suspended') return false;

      const start = new Date(log.startDate);
      const end = log.endDate
        ? new Date(log.endDate)
        : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);

      if (selectedDate < start || selectedDate > end) return false;

      const repeatType = log.repeat.toLowerCase();
      const repeatDays = (log.custom_repeat || []).map(day => dayMap[day]);
      const currentDay = selectedDate.getDay();

      switch (repeatType) {
        case 'daily':
          return true;

        case 'weekly':
          return currentDay === start.getDay();

        case 'monthly':
          return selectedDate.getDate() === start.getDate();

        case 'weekdays':
          return currentDay >= 1 && currentDay <= 5;

        case 'weekends':
          return currentDay === 0 || currentDay === 6;

        case 'custom':
          return repeatDays.includes(currentDay);

        default:
          return selectedDate.toDateString() === start.toDateString();
      }
    });
  }, [selectedDate, habitLogs]);


  useEffect(() => {
    getData();
  }, [])

  return (
    <div style={{ height: '100%', padding: '1rem' }}>
      <h2>Habit Tracker Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        date={date}
        view={view}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        defaultView="month"
        views={['month', 'week', 'day']}
        selectable
        onSelectSlot={handleSelectSlot}
      />

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Habits on {selectedDate.toDateString()}</h3>
            {filteredHabits.length === 0 ? (
              <p>No habits logged for this day.</p>
            ) : (
              <ul>
                {filteredHabits.map((log, index) => (
                  <li key={index}>
                    {log.habit} - {log.done ? "Done" : "Missed"}
                  </li>
                ))}
              </ul>
            )}
            <button className="close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserTrack;
