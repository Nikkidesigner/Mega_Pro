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
const subjectRoutes = require('./routes/subject');
const groupsRoutes = require('./routes/groups');
const adminStudentManagement = require('./routes/admin-student-management');
const adminStaffManagement = require('./routes/admin-staff-management');

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/home/staff', staffRoutes);
app.use('/home/student', studentRoutes);
app.use('/home/courses', coursesRoutes);
app.use('/home/subjects', subjectRoutes);
app.use('/home/groups', groupsRoutes); 
app.use('/admin-student-management', adminStudentManagement); 
app.use('/admin-staff-management', adminStaffManagement);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack
    res.status(500).send({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});