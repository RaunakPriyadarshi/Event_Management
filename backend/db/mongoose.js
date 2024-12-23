const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/eventdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Database connection error:', err));

module.exports = mongoose;  mongoose.js