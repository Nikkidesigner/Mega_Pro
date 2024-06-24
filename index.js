const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');

const studentRoutes = require('./routes/student');
const staffRoutes = require('./routes/staff');

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

app.get('/home/student', (req, res) => {
  res.send('<h1>This is student</h1>');
});

app.listen(3000);

app.use('/home/staff', staffRoutes);
app.use('/home/student', studentRoutes);
