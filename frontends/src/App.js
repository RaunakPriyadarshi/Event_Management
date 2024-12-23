import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import EventManagement from './components/EventManagement';
import AttendeeManagement from './components/AttendeeManagement';
import TaskTracker from './components/TaskTracker';
import './App.css'
const App = () => {
    return (
        <Router>
            <div className="app">
                <header className="navbar">
                    <ul>
                        <li><Link to="/">Event Management</Link></li>
                        <li><Link to="/attendees">Attendee Management</Link></li>
                        <li><Link to="/tasks">Task Tracker</Link></li>
                    </ul>
                </header>

                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<EventManagement />} />
                        <Route path="/attendees" element={<AttendeeManagement />} />
                        <Route path="/tasks" element={<TaskTracker />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;