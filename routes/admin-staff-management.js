const express = require('express');
const router = express.Router();
const db = require('../db');

// GET endpoint to fetch all staff
router.get('/all-staff', async (req, res) => {
    try {
        const statement = 'SELECT * FROM staff';
        const [rows] = await db.query(statement);
        res.json(rows); // Ensure it returns an array
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT endpoint to update staff details
router.put('/update-staff-details', async (req, res) => {
    const { staff_id, email, course_name, role } = req.body;
    try {
        const statement = 'UPDATE staff SET email = ?, course_name = ?, role = ? WHERE staff_id = ?';
        const [result] = await db.execute(statement, [email, course_name, role, staff_id]);
        res.json(result);
    } catch (error) {
        console.error('Error updating staff details:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET endpoint to fetch all courses
router.get('/courses', async (req, res) => {
    try {
        const statement = 'SELECT * FROM courses';
        const [rows] = await db.query(statement);
        res.json(rows); // Ensure it returns an array
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
