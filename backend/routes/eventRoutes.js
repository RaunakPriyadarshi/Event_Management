const express = require('express');
const Event = require('../models/Event');
const Attendee = require('../models/Attendee');
const router = express.Router();

// Create an event
router.post('/', async (req, res) => {
    const { name, description, location, date } = req.body;

    if (!name || !description || !location || !date) {
        return res.status(400).send({ error: 'All fields (name, description, location, date) are required.' });
    }

    try {
        const event = new Event({ name, description, location, date });
        await event.save();
        res.status(201).send({ success: true, event });
    } catch (error) {
        res.status(500).send({ success: false, error: 'Error creating event.', details: error.message });
    }
});

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).send({ success: true, events });
    } catch (error) {
        res.status(500).send({ success: false, error: 'Error fetching events.', details: error.message });
    }
});

// Get a single event with optional attendees
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { includeAttendees } = req.query;

    try {
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).send({ success: false, error: 'Event not found.' });
        }

        let response = { success: true, event };

        if (includeAttendees === 'true') {
            const attendees = await Attendee.find({ event: id }, 'name email');
            response.attendees = attendees;
        }

        res.status(200).send(response);
    } catch (error) {
        res.status(500).send({ success: false, error: 'Error fetching event.', details: error.message });
    }
});

// Update an event
router.put('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!event) {
            return res.status(404).send({ success: false, error: 'Event not found.' });
        }

        res.status(200).send({ success: true, event });
    } catch (error) {
        res.status(500).send({ success: false, error: 'Error updating event.', details: error.message });
    }
});

// Delete an event
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findByIdAndDelete(id);

        if (!event) {
            return res.status(404).send({ success: false, error: 'Event not found.' });
        }

        // Optionally remove event reference from attendees
        await Attendee.updateMany({ event: id }, { $unset: { event: '' } });

        res.status(200).send({ success: true, message: 'Event deleted successfully', event });
    } catch (error) {
        res.status(500).send({ success: false, error: 'Error deleting event.', details: error.message });
    }
});

// Add attendees to an event
router.post('/:id/attendees', async (req, res) => {
    const { id } = req.params;
    const { attendees } = req.body;

    if (!attendees || !Array.isArray(attendees) || attendees.length === 0) {
        return res.status(400).send({ success: false, error: 'Attendees array is required.' });
    }

    try {
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).send({ success: false, error: 'Event not found.' });
        }

        const validAttendees = await Attendee.find({ _id: { $in: attendees } });
        if (validAttendees.length !== attendees.length) {
            return res.status(400).send({ success: false, error: 'Some attendee IDs are invalid.' });
        }

        await Attendee.updateMany(
            { _id: { $in: attendees } },
            { $set: { event: id } }
        );

        res.status(200).send({ success: true, message: 'Attendees added successfully.' });
    } catch (error) {
        res.status(500).send({ success: false, error: 'Error adding attendees.', details: error.message });
    }
});

// Get attendees for an event
router.get('/:id/attendees', async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).send({ success: false, error: 'Event not found.' });
        }

        const attendees = await Attendee.find({ event: id }, 'name email');
        res.status(200).send({ success: true, attendees });
    } catch (error) {
        res.status(500).send({ success: false, error: 'Error fetching attendees.', details: error.message });
    }
});

module.exports = router;
