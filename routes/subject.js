const express = require('express');
const router = express.Router();
const db = require('../db'); 
const utils = require('../utils'); 

router.get('/add-subject',(req, res)=>{
  res.send("subject");
})

// POST endpoint to add a subject related to a course
router.post('/add-subject', async (req, res) => {
    console.log(req.body);
    const { subject_name, course_id } = req.body;
    try {
        // Insert subject into the subjects table
        const statement = `INSERT INTO subjects (subject_name, course_id) VALUES (?, ?)`;
        const [result] = await db.execute(statement, [subject_name, course_id]);
        res.send(utils.createSuccess(result));
    } catch (error) {
        console.error('Error adding subject:', error);
        res.status(500).send(utils.createError(error));
    }
});

// GET endpoint to fetch subjects related to a specific course
router.get('/show-subject/:course_id', async (req, res) => {
    const { course_id } = req.params;
    try {
        // Query subjects associated with the specified course_id
        const statement = `SELECT * FROM subjects WHERE course_id = ?`;
        const [rows] = await db.query(statement, [course_id]);
        res.send(utils.createSuccess(rows));
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).send(utils.createError(error));
    }
});

router.get("/show-subject", async(req, res)=> {
    const statement = 'select * from Subjects'
    const [rows] = await db.query(statement, [course_id]);
    res.send(rows)
});
module.exports = router;
