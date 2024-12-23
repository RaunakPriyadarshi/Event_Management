const express = require('express');
const Task = require('../models/Task');
const Attendee = require('../models/Attendee');
const router = express.Router();

/**
 * Create a new task
 */
router.post('/', async (req, res) => {
    const { name, deadline, attendee, event, status } = req.body;

    // Log incoming data
    console.log('Received task data:', req.body);

    // Validate required fields (attendee is optional)
    if (!name || !deadline || !event) {
        return res.status(400).send({ error: 'Fields "name", "deadline", and "event" are required.' });
    }

    // Validate status if provided
    const validStatuses = ['Incomplete', 'In Progress', 'Complete'];
    if (status && !validStatuses.includes(status)) {
        return res.status(400).send({ error: 'Invalid task status. Valid options are "Incomplete", "In Progress", "Complete".' });
    }

    try {
        const taskData = { name, deadline, event, status: status || 'Incomplete' };

        // Include attendee only if provided
        if (attendee) {
            taskData.attendee = attendee;
        }

        const task = new Task(taskData);
        await task.save();
        console.log('Task saved:', task); // Log saved task
        res.status(201).send(task); // Respond with created task
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).send({ error: 'Error creating task.', details: error.message });
    }
});

/**
 * Get tasks for a specific event, including attendee details
 */
router.get('/event/:eventId', async (req, res) => {
    const { eventId } = req.params;

    try {
        const tasks = await Task.find({ event: eventId })
            .populate('attendee', 'name email'); // Populate attendee details (name, email)
        res.send(tasks);
    } catch (error) {
        console.error('Error fetching tasks for event:', error);
        res.status(500).send({ error: 'Error fetching tasks.', details: error.message });
    }
});

/**
 * Get all attendees
 */
router.get('/attendees', async (req, res) => {
    try {
        const attendees = await Attendee.find();
        res.send(attendees);
    } catch (error) {
        console.error('Error fetching attendees:', error);
        res.status(500).send({ error: 'Error fetching attendees.', details: error.message });
    }
});

/**
 * Get attendees for a specific event
 */
router.get('/attendees/event/:eventId', async (req, res) => {
    const { eventId } = req.params;

    try {
        const attendees = await Attendee.find({ event: eventId })
            .populate('event', 'name'); // Populate event details
        res.send(attendees);
    } catch (error) {
        console.error('Error fetching attendees for event:', error);
        res.status(500).send({ error: 'Error fetching attendees for this event.', details: error.message });
    }
});

/**
 * Update a task
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedData = req.body;

        // Validate status if provided
        if (updatedData.status) {
            const validStatuses = ['Incomplete', 'In Progress', 'Complete'];
            if (!validStatuses.includes(updatedData.status)) {
                return res.status(400).send({ error: 'Invalid task status.' });
            }
        }

        const task = await Task.findByIdAndUpdate(id, updatedData, {
            new: true, // Return the updated task
            runValidators: true, // Validate data before updating
        });

        if (!task) {
            return res.status(404).send({ error: 'Task not found.' });
        }

        res.send(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(400).send({ error: 'Error updating task.', details: error.message });
    }
});

/**
 * Delete a task
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).send({ error: 'Task not found.' });
        }

        res.send({ message: 'Task deleted successfully.', task });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send({ error: 'Error deleting task.', details: error.message });
    }
});

module.exports = router;
