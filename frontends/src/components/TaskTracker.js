import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/TaskTracker.css';

const TaskTracker = () => {
  const [events, setEvents] = useState([]); // List of events
  const [selectedEvent, setSelectedEvent] = useState(''); // Selected event ID
  const [tasks, setTasks] = useState([]); // List of tasks for the selected event
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    attendee: '',
    progress: 0,
    status: 'Incomplete',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) fetchTasks(selectedEvent);
  }, [selectedEvent]);

  // Fetch all events for the dropdown
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Failed to fetch events. Please try again later.');
    }
  };

  // Fetch tasks for the selected event
  const fetchTasks = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks/event/${eventId}`);
      setTasks(response.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to fetch tasks. Please try again later.');
    }
  };

  // Add a new task
  const addTask = async (e) => {
    e.preventDefault();
    const taskData = { ...newTask, event: selectedEvent };

    try {
      const response = await axios.post('http://localhost:5000/api/tasks', taskData);
      setTasks([...tasks, response.data]);
      setNewTask({
        name: '',
        description: '',
        attendee: '',
        progress: 0,
        status: 'Incomplete',
      });
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  // Update task progress
  const updateTaskProgress = async (taskId, progress) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { progress });
      setTasks(tasks.map((task) => (task._id === taskId ? { ...task, progress } : task)));
    } catch (error) {
      console.error('Error updating task progress:', error);
      alert('Failed to update task progress. Please try again.');
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status });
      setTasks(tasks.map((task) => (task._id === taskId ? { ...task, status } : task)));
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status. Please try again.');
    }
  };

  return (
    <div className="task-tracker">
      <h2>Task Tracker</h2>

      {/* Event Dropdown */}
      <div className="event-selection">
        <label htmlFor="event">Select Event:</label>
        <select
          id="event"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          <option value="" disabled>Select an Event</option>
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.name}
            </option>
          ))}
        </select>
      </div>

      {/* Task List */}
      {selectedEvent && (
        <div>
          <table className="task-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Description</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.name}</td>
                  <td>{task.description}</td>
                  <td>
                    <input
                      type="number"
                      value={task.progress}
                      onChange={(e) => updateTaskProgress(task._id, parseInt(e.target.value, 10))}
                      min="0"
                      max="100"
                    />
                    %
                  </td>
                  <td>
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                    >
                      <option value="Incomplete">Incomplete</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Complete">Complete</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => deleteTask(task._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add New Task Form */}
          <form className="add-task-form" onSubmit={addTask}>
            <h3>Add New Task</h3>
            <input
              type="text"
              placeholder="Task Name"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              required
            />
            <button type="submit">Add Task</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskTracker;
