const express = require('express');
const Attendee = require('../models/Attendee'); // Ensure this path matches your project structure
const router = express.Router();

// Add an attendee
router.post('/', async (req, res) => {
    try {
        const { name, email, event } = req.body;

        // Validate required fields
        if (!name || !email || !event) {
            return res.status(400).send({ error: 'Name, email, and event are required.' });
        }

        // Create and save attendee
        const attendee = new Attendee(req.body);
        await attendee.save();
        res.status(201).send(attendee);
    } catch (error) {
        console.error('Error adding attendee:', error); // Debugging
        res.status(400).send({ error: 'Error adding attendee.', details: error.message });
    }
});

// Get all attendees
router.get('/', async (req, res) => {
    try {
        const attendees = await Attendee.find().populate('event', 'name date location'); // Populate only necessary fields
        res.send(attendees);
    } catch (error) {
        console.error('Error fetching attendees:', error); // Debugging
        res.status(500).send({ error: 'Error fetching attendees.', details: error.message });
    }
});

// Edit an attendee
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;  // Extract the ID from the URL
        const { name, email, event } = req.body;  // Extract data from the request body

        console.log('Received update data:', { name, email, event }); // Debugging output

        // Validate the input data
        if (!name || !email || !event) {
            return res.status(400).send({ error: 'Name, email, and event are required.' });
        }

        // Find the attendee by ID
        const attendee = await Attendee.findById(id);
        if (!attendee) {
            return res.status(404).send({ error: 'Attendee not found.' });
        }

        // Update the attendee's fields
        attendee.name = name;
        attendee.email = email;
        attendee.event = event;

        // Save the updated attendee
        const updatedAttendee = await attendee.save();
        console.log('Updated attendee:', updatedAttendee); // Debugging output

        res.send(updatedAttendee);  // Send the updated attendee as the response
    } catch (error) {
        console.error('Error updating attendee:', error);  // Debugging output
        res.status(500).send({ error: 'Error updating attendee', details: error.message });
    }
});

// Delete an attendee
router.delete('/:id', async (req, res) => {
    try {
        console.log('Deleting attendee:', req.params.id); // Debugging
        const attendee = await Attendee.findByIdAndDelete(req.params.id);

        if (!attendee) {
            return res.status(404).send({ error: 'Attendee not found.' });
        }

        res.send({ message: 'Attendee deleted successfully' });
    } catch (error) {
        console.error('Error deleting attendee:', error); // Debugging
        res.status(500).send({ error: 'Error deleting attendee.', details: error.message });
    }
});

module.exports = router;
