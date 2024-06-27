const express = require("express");
const router = express.Router();
const db = require("../db");
const utils = require("../utils");
// student.js
router.get("/courses", async (req, res) => {
  try {
    const [courses] = await db.execute('SELECT course_name,course_id FROM courses');
    res.send(courses);
  } catch (error) {
    res.status(500).send(utils.createError(error));
  }
});

router.get("/groups", async (req, res) => {
  try {
    const [groups] = await db.execute('SELECT * FROM course_groups');
    res.send(groups);
  } catch (error) {
    res.status(500).send(utils.createError(error));
  }
});


// Fetch all students
router.get("/", async (request, response) => {
  try {
    const statement = `
      SELECT students.*, courses.course_name, course_groups.group_name 
      FROM students 
      LEFT JOIN courses ON students.course_id = courses.course_id 
      LEFT JOIN course_groups ON students.group_id = course_groups.group_id
    `;
    const [students] = await db.execute(statement);
    response.send(utils.createSuccess(students));
  } catch (error) {
    response.status(500).send(utils.createError(error));
  }
});

// Assign course and group to student
router.post("/assign", async (request, response) => {
  try {
    const { roll_number, course_id, group_id } = request.body;
    console.log('Incoming Payload:', request.body);

    // Validate course_id and group_id
    const [courses] = await db.execute('SELECT course_id FROM courses WHERE course_id = ?', [course_id]);
    const [groups] = await db.execute('SELECT group_id FROM course_groups WHERE group_id = ?', [group_id]);

    if (courses.length === 0 || groups.length === 0) {
      console.log('Invalid course or group:', course_id, group_id);
      return response.status(400).send(utils.createError("Invalid course or group"));
    }

    const statement = `
      UPDATE students 
      SET course_id = ?, group_id = ? 
      WHERE roll_number = ?
    `;
    const [result] = await db.execute(statement, [course_id, group_id, roll_number]);

    if (result.affectedRows === 0) {
      throw new Error("No student found with the provided roll number");
    }

    response.send(utils.createSuccess({ message: "Student assigned successfully" }));
  } catch (error) {
    console.error('Error assigning student:', error.message, error.stack);
    response.status(500).send(utils.createError(error.message));
  }
});


module.exports = router;
