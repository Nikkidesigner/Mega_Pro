const express = require("express");
const router = express.Router();
const db = require("../db");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const config = require("../config");
const utils = require("../utils");

const app = express();
const port = 3000;

// add course- post method
router.post("/add-course", async (request, response) => {
  console.log("Request Body:", request.body);
  const { course_name } = request.body;
  console.log(request.body);
  try {
    const statement = `INSERT INTO courses (course_name) VALUES (?)`;
    const [result] = await db.execute(statement, [course_name]);
    response.send(utils.createSuccess(result));
  } catch (error) {
    console.error("Error during the adding course:", error);
    response.status(500).send(utils.createError(error));
  }
});

// get method to show courses
router.get("/show-courses", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM courses");
    res.send(utils.createSuccess(rows));
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).send(utils.createError(err));
  }
});

router.get('/course-students', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, config.secret);
        const course_id = decodedToken.course_id; // Ensure course_id is part of the token payload

        if (!course_id) {
            return res.status(400).send(utils.createError('Course ID not found in token'));
        }

        const [students] = await db.query('SELECT * FROM students WHERE course_id = ?', [course_id]);
        res.send(utils.createSuccess(students));
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send(utils.createError(error));
    }
});


module.exports = router;
