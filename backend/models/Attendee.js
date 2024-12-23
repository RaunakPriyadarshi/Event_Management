const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendeeSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ }, // Regex for email format validation
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true }, // Reference to Event and required
});

module.exports = mongoose.model('Attendee', AttendeeSchema);
