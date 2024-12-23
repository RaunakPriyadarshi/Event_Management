const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    name: String,
    deadline: Date,
    status: { type: String, enum: ['Incomplete', 'In Progress', 'Complete'], default: 'Incomplete' },
    progress: { type: Number, default: 0 }, // Progress percentage
    event: { type: Schema.Types.ObjectId, ref: 'Event' },
});

module.exports = mongoose.model('Task', TaskSchema);