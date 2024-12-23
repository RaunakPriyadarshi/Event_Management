import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AttendeeManagement.css';

const AttendeeManagement = () => {
    const [attendees, setAttendees] = useState([]); // List of attendees
    const [events, setEvents] = useState([]); // List of events
    const [newAttendee, setNewAttendee] = useState({ name: '', email: '', event: '' });
    const [editAttendee, setEditAttendee] = useState(null); // Attendee being edited

    // Fetch attendees and events when the component loads
    useEffect(() => {
        fetchAttendees();
        fetchEvents();
    }, []);

    // Fetch all attendees
    const fetchAttendees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/attendees');
            setAttendees(response.data);
        } catch (error) {
            console.error('Error fetching attendees:', error);
        }
    };

    // Fetch all events for the dropdown
    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/events');
            setEvents(response.data.events || []); // Adjust based on backend response structure
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    // Add a new attendee
    const addAttendee = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/attendees', newAttendee);
            setAttendees([...attendees, response.data]);
            setNewAttendee({ name: '', email: '', event: '' }); // Reset the form
        } catch (error) {
            console.error('Error adding attendee:', error);
        }
    };

    // Delete an attendee
    const deleteAttendee = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/attendees/${id}`);
            setAttendees(attendees.filter(attendee => attendee._id !== id));
        } catch (error) {
            console.error('Error deleting attendee:', error);
        }
    };

    // Start editing an attendee
    const startEdit = (attendee) => {
        setEditAttendee({ ...attendee }); // Create a copy to avoid direct state mutations
    };

    // Save changes for an edited attendee
    const saveEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/attendees/${editAttendee._id}`, editAttendee);
            setAttendees(attendees.map(att => att._id === editAttendee._id ? response.data : att));
            setEditAttendee(null); // Reset edit mode
        } catch (error) {
            console.error('Error editing attendee:', error);
        }
    };

    return (
        <div className="attendee-management">
            <h1>Attendee Management</h1>

            {/* Add New Attendee Form */}
            {!editAttendee && (
                <form className="add-attendee-form" onSubmit={addAttendee}>
                    <h3>Add Attendee</h3>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newAttendee.name}
                        onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newAttendee.email}
                        onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
                        required
                    />
                    <select
                        value={newAttendee.event}
                        onChange={(e) => setNewAttendee({ ...newAttendee, event: e.target.value })}
                        required
                    >
                        <option value="" disabled>Select an Event</option>
                        {events.map(event => (
                            <option key={event._id} value={event._id}>
                                {event.name}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Add Attendee</button>
                </form>
            )}

            {/* Edit Attendee Form */}
            {editAttendee && (
                <form className="edit-attendee-form" onSubmit={saveEdit}>
                    <h3>Edit Attendee</h3>
                    <input
                        type="text"
                        placeholder="Name"
                        value={editAttendee.name}
                        onChange={(e) => setEditAttendee({ ...editAttendee, name: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={editAttendee.email}
                        onChange={(e) => setEditAttendee({ ...editAttendee, email: e.target.value })}
                        required
                    />
                    <select
                        value={editAttendee.event}
                        onChange={(e) => setEditAttendee({ ...editAttendee, event: e.target.value })}
                        required
                    >
                        <option value="" disabled>Select an Event</option>
                        {events.map(event => (
                            <option key={event._id} value={event._id}>
                                {event.name}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setEditAttendee(null)}>Cancel</button>
                </form>
            )}

            {/* List of Attendees */}
            <ul className="attendee-list">
                {attendees.map(attendee => (
                    <li key={attendee._id}>
                        <div>
                            <h3>{attendee.name}</h3>
                            <p>Email: {attendee.email}</p>
                            <p>Event: {attendee.event?.name || attendee.event}</p>
                        </div>
                        <button onClick={() => startEdit(attendee)}>Edit</button>
                        <button onClick={() => deleteAttendee(attendee._id)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AttendeeManagement;
