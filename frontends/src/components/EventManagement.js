import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/EventManagement.css';

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ name: '', description: '', location: '', date: '' });
    const [editEvent, setEditEvent] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/events');
            setEvents(response.data.events || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const addEvent = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/events', newEvent);
            setEvents([...events, response.data]);
            setNewEvent({ name: '', description: '', location: '', date: '' });
        } catch (error) {
            console.error('Error adding event:', error);
        }
    };

    const deleteEvent = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/events/${id}`);
            setEvents(events.filter(event => event._id !== id));
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const startEditEvent = (event) => {
        setEditEvent(event);
    };

    const updateEvent = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/events/${editEvent._id}`, editEvent);
            setEvents(events.map(event => (event._id === editEvent._id ? response.data : event)));
            setEditEvent(null);
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    return (
        <div className="event-management">
            <h1>Event Management</h1>

            {editEvent ? (
                <form className="form" onSubmit={updateEvent}>
                    <h3>Edit Event</h3>
                    <input
                        type="text"
                        placeholder="Event Name"
                        value={editEvent.name}
                        onChange={(e) => setEditEvent({ ...editEvent, name: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={editEvent.description}
                        onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={editEvent.location}
                        onChange={(e) => setEditEvent({ ...editEvent, location: e.target.value })}
                        required
                    />
                    <input
                        type="date"
                        value={editEvent.date}
                        onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })}
                        required
                    />
                    <div className="button-group">
                        <button type="submit" className="primary-btn">Update Event</button>
                        <button type="button" className="secondary-btn" onClick={() => setEditEvent(null)}>Cancel</button>
                    </div>
                </form>
            ) : (
                <form className="form" onSubmit={addEvent}>
                    <h3>Add Event</h3>
                    <input
                        type="text"
                        placeholder="Event Name"
                        value={newEvent.name}
                        onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        required
                    />
                    <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        required
                    />
                    <button type="submit" className="primary-btn">Add Event</button>
                </form>
            )}

            {events.length > 0 ? (
                <ul className="event-list">
                    {events.map(event => (
                        <li key={event._id} className="event-item">
                            <div>
                                <h3>{event.name}</h3>
                                <p>{event.description}</p>
                                <p><strong>Location:</strong> {event.location}</p>
                                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                            </div>
                            <div className="button-group">
                                <button className="secondary-btn" onClick={() => startEditEvent(event)}>Edit</button>
                                <button className="danger-btn" onClick={() => deleteEvent(event._id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No events available.</p>
            )}
        </div>
    );
};

export default EventManagement;
