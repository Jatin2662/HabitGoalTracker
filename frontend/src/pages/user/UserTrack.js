import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { IoClose } from "react-icons/io5";
import axios from "axios";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/UserTrack.css';
import { useDispatch } from 'react-redux';
import { hideNav } from '../../redux/slice/navSlice';
import { showToast } from "../../redux/slice/toastSlice";
import { showLoader, hideLoader } from "../../redux/slice/loaderSlice";

const localizer = momentLocalizer(moment);

function UserTrack() {
  const [habitLogs, setHabitLogs] = useState([]);

  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  const events = useMemo(() => {

    if (habitLogs.length === 0) return

    return habitLogs.map((habit) => ({
      id: habit._id,
      title: `${habit.habit}`,
      start: new Date(habit.date),
      end: new Date(habit.date),
      status: habit.status,
      allDay: true
    }));
  }, [habitLogs]);

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

  const [logStatus, setLogStatus] = useState([]);

  const filteredHabits = useMemo(() => {
    if (!selectedDate) return [];
    setLogStatus(habitLogs.filter(log => new Date(log.date).toDateString() === selectedDate.toDateString()))
    return habitLogs.filter(
      log => new Date(log.date).toDateString() === selectedDate.toDateString()
    );
  }, [selectedDate, habitLogs]);

  const getHabitData = async () => {
    dispatch(showLoader("Your habit logs are on the way. Hold tight!"))
    try {
      const url = 'http://localhost:8080/user/user-track'
      const headers = {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }
      const response = await axios.get(url, headers);

      const { message, success, habitLogs } = response.data;

      setHabitLogs(habitLogs)
      dispatch(showToast({ message: message, type: success ? "success" : "error" }))
    } catch (error) {
      dispatch(showToast({ message: error.response?.data?.message, type: "error" }))
    }
    dispatch(hideLoader())
  }

  useEffect(() => {
    getHabitData();
    dispatch(hideNav('Track'))
  }, [])


  const handleChange = (e, id) => {
    const isChecked = e.target.checked ? 'completed' : 'pending';

    const updatedLogs = logStatus.map(item => {
      if (item._id === id) {
        return { ...item, status: isChecked };
      }
      return item;
    });

    setLogStatus(updatedLogs);
  };

  const updateLogCompletion = async (habits) => {
    dispatch(showLoader("Updating log, Relax!"))

    const updatedLogs = habits.map(log => ({
      _id: log._id,
      status: log.status
    }));
    try {
      const url = 'http://localhost:8080/user/user-track'
      const headers = {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }
      const response = await axios.patch(url, updatedLogs, headers);

      const { message, success, logData } = response.data;

      dispatch(showToast({ message: message, type: success ? "success" : "error" }))
    } catch (error) {
      dispatch(showToast({ message: error.response?.data?.message, type: "error" }))
    }
    dispatch(hideLoader())
    closeModal();
  };

  const eventStyle = (event) => {
    let backgroundColor = event.status === 'completed' ? '#065f96' : '#991b3c'

    return {
      style: {
        backgroundColor
      }
    }
  }

  return (
    <div style={{ height: '100%', padding: '1rem' }} className='user-track' >
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
        eventPropGetter={eventStyle}
      />

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="m-c-btn">
              <span className='centered' >
                <IoClose className="close-btn" onClick={closeModal} />
              </span>
            </div>
            <h3>Habits on {selectedDate.toDateString()}</h3>
            {filteredHabits.length === 0 ? (
              <p>No habits logged for this day.</p>
            ) : (
              <ul>
                {filteredHabits.map((log) => {
                  const matchedLog = logStatus.find(item => item._id === log._id);
                  const isChecked = matchedLog?.status === 'completed';

                  return (
                    <li key={log._id} className="habit-li" >
                      <label>{log.habit} - </label>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleChange(e, log._id)}

                      />
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="centered" >
              <button className="save-btn" onClick={() => updateLogCompletion(logStatus)}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserTrack;
