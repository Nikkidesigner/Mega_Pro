const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');

const PORT = 3000;

const studentRoutes = require('./routes/student');
const staffRoutes = require('./routes/staff');
const coursesRoutes = require('./routes/courses');
const subjectRoutes = require('./routes/subject'); // Correctly import the subject routes

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // Add this line

app.get('/', (req, res) => {
    res.send('<h1>This is project</h1>');
});

app.get('/home/staff', (req, res) => {
    res.send('<h1>This is staff</h1>');
});

app.get('/home', (req, res) => {
    res.send('<h1>This is home</h1>');
});

app.get('/home/student', (req, res) => {
    res.send('<h1>This is student</h1>');
});

app.get('/home/courses', (req, res) => {
    res.send('<h1>This is courses</h1>');
});

app.get('/home/subject', (req, res) => {
  res.send('<h1>This is subject</h1>');
});


app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack
    res.status(500).send({ error: 'Something went wrong!' });
});

// Mount the routes
app.use('/home/staff', staffRoutes);
app.use('/home/student', studentRoutes);
app.use('/home/courses', coursesRoutes);
app.use('/home/subjects', subjectRoutes); // Use the subject routes correctly

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
