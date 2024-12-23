const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('./db/mongoose');
const eventRoutes = require('./routes/eventRoutes');
const attendeeRoutes = require('./routes/attendeeRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/events', eventRoutes);
app.use('/api/attendees', attendeeRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
