const express = require("express");
const router = express.Router();
const db = require("../db");
const utils = require("../utils");

// Get marking schema for a course
router.get("/show-schema", async (req, res) => {
  const { course_name } = req.query;

  console.log("Course Name:", course_name); // Log the course name

  if (!course_name) {
    return res.status(400).send(utils.createError("Course name is required"));
  }

  try {
    const statement = `
            SELECT s.subject_name, e.theory_weightage, e.lab_weightage, e.ia1_weightage, e.ia2_weightage 
            FROM evaluationscheme e
            JOIN subjects s ON e.subject_id = s.subject_id
            JOIN courses c ON s.course_id = c.course_id
            WHERE c.course_name = ?
        `;
    const [rows] = await db.execute(statement, [course_name]);
    res.send(utils.createSuccess(rows));
  } catch (err) {
    console.error("Error fetching marking schema:", err);
    res.status(500).send(utils.createError(err));
  }
});

// Add a new marking schema
router.post("/add-marking-schema", async (req, res) => {
  const {
    theory_weightage,
    lab_weightage,
    ia1_weightage,
    ia2_weightage,
    subject_name,
    course_name,
  } = req.body;

  console.log("Request Body:", req.body); // Log the request body
  try {
    // Get course ID
    const [courseResult] = await db.execute(
      "SELECT course_id FROM courses WHERE course_name = ?",
      [course_name]
    );

    if (courseResult.length === 0) {
      throw new Error(`Course not found for course_name: ${course_name}`);
    }

    const course_id = courseResult[0].course_id;
    console.log("Course ID:", course_id); // Log the course ID

    // Get subject ID
    const [subjectResult] = await db.execute(
      "SELECT subject_id FROM subjects WHERE subject_name = ? AND course_id = ?",
      [subject_name, course_id]
    );

    if (subjectResult.length === 0) {
      throw new Error(
        `Subject not found for subject_name: ${subject_name} and course_id: ${course_id}`
      );
    }

    const subject_id = subjectResult[0].subject_id;
    console.log("Subject ID:", subject_id); // Log the subject ID

    const statement = `
            INSERT INTO evaluationscheme (theory_weightage, lab_weightage, ia1_weightage, ia2_weightage, subject_id) 
            VALUES (?, ?, ?, ?, ?)
        `;

    console.log("Insert Statement Parameters:", [
      theory_weightage,
      lab_weightage,
      ia1_weightage,
      ia2_weightage,
      subject_id,
    ]); // Log the parameters

    const [result] = await db.execute(statement, [
      theory_weightage,
      lab_weightage,
      ia1_weightage,
      ia2_weightage,
      subject_id,
    ]);
    res.send(utils.createSuccess(result));
  } catch (err) {
    console.error("Error adding marking schema:", err.message);
    res.status(500).send(utils.createError(err.message));
  }
});

router.get("/get-subjects", async (req, res) => {
  const { course_name } = req.query;
  try {
    const statement = `
            SELECT s.subject_name
            FROM subjects s
            JOIN courses c ON s.course_id = c.course_id
            WHERE c.course_name = ?
        `;
    const [rows] = await db.execute(statement, [course_name]);
    res.send(utils.createSuccess(rows));
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).send(utils.createError(err));
  }
});

router.get("/get-courses", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT course_name FROM courses");
    res.send(utils.createSuccess(rows));
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).send(utils.createError(err));
  }
});

router.get('/get-groups', async (req, res) => {
  const courseName = req.query.course_name;

  try {
      // Fetch course_id based on course_name
      const [courseResult] = await db.execute('SELECT course_id FROM courses WHERE course_name = ?', [courseName]);
      if (courseResult.length === 0) {
          return res.status(404).send(utils.createError('Course not found'));
      }
      const course_id = courseResult[0].course_id;

      // Fetch groups based on course_id
      const [groupsResult] = await db.execute('SELECT group_name FROM course_groups WHERE course_id = ?', [course_id]);
      if (groupsResult.length === 0) {
          return res.status(404).send(utils.createError('No groups found for the course'));
      }

      // Send the group names as a response
      const groups = groupsResult.map(group => group.group_name);
      res.send(groups);

  } catch (error) {
      console.error('Error fetching groups:', error);
      res.status(500).send(utils.createError('Internal server error'));
  }
});

module.exports = router;
