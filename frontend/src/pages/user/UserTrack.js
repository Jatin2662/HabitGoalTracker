import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/UserTrack.css';

const localizer = momentLocalizer(moment);

function UserTrack() {
  const [habitLogs, setHabitLogs] = useState([
    { habit: "Workout", date: "2025-05-23", done: true },
    { habit: "Meditate", date: "2025-05-23", done: false },
    { habit: "Read", date: "2025-05-24", done: true },
    { habit: "Work", date: "2025-05-24", done: true },
    { habit: "Workout", date: "2025-05-25", done: false },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  const events = useMemo(() => {
    return habitLogs.map((log, index) => ({
      id: index,
      title: `${log.habit} - ${log.done ? "Done" : "Missed"}`,
      start: new Date(log.date),
      end: new Date(log.date),
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

  const filteredHabits = useMemo(() => {
    if (!selectedDate) return [];
    return habitLogs.filter(
      log => new Date(log.date).toDateString() === selectedDate.toDateString()
    );
  }, [selectedDate, habitLogs]);

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
