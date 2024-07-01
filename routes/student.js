const express = require("express");
const router = express.Router();
const db = require("../db");
const utils = require("../utils");
const cryptoJS = require("crypto-js");
const config = require("../config");
const jwt = require("jsonwebtoken");


router.get("/register", async (req, res)=>{
  res.send("<h1>this is student registration page</h1>")
})

router.post("/register", async (request, response) => {
  try {
    const { roll_number, student_name, email, password } = request.body;
    console.log({roll_number, student_name, email, password })
    // Check if any required fields are undefined
    if (!roll_number || !student_name || !email || !password) {
      return response.status(400).send(utils.createError("Missing required fields"));
    }

    const encryptedPassword = String(cryptoJS.SHA256(password));
    const statement = `INSERT INTO students (roll_number, student_name, email, password) VALUES (?, ?, ?, ?);`;
    const [result] = await db.execute(statement, [roll_number, student_name, email, encryptedPassword]);
    response.send(utils.createSuccess(result));
  } catch (error) {
    console.error('Error during registration:', error);
    response.status(500).send(utils.createError(error));
  }
});


router.post("/login", async (request, response) => {
  const { email, password } = request.body;
  try {
    const encryptedPassword = String(cryptoJS.SHA256(password));
    const statement = `SELECT roll_number, email, role, student_id FROM students WHERE email = ? AND password = ?`;
    const [users] = await db.execute(statement, [email, encryptedPassword]);
    if (users.length == 0) {
      response.status(401).send(utils.createError(`student does not exist`));
    } else {
      const user = users[0];
      console.log(' student_id : :>> ',user.student_id );
      const token = jwt.sign(
        {
          student_id: user.student_id, // Ensure this field is included
          email: user.email,
          role: user.role
        },
        config.SECRET_KEY
      );
      response.send(utils.createSuccess({ token, email: user.email, student_id: user.student_id, role: user.role }));
    }
  } catch (error) {
    response.status(500).send(utils.createError(error));
  }
});

router.get('/marks', async (req, res) => {
  console.log('Config Secret:', config.SECRET_KEY); // This should print your secret key

  console.log('Headers:', req.headers); // Log all headers for debugging

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send(utils.createError('Authorization header missing'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, config.SECRET_KEY); // Use the secret key from config
    const student_id = decodedToken.student_id; // Ensure student_id is part of the token payload

    if (!student_id) {
      return res.status(400).send(utils.createError('Student ID not found in token'));
    }

    const query = `
      SELECT students.student_name, \`course_groups\`.group_name, subjects.subject_name, marksentry.theory, marksentry.lab, marksentry.IA1, marksentry.IA2
      FROM marksentry
      JOIN students ON marksentry.student_id = students.student_id
      JOIN \`course_groups\` ON marksentry.group_id = \`course_groups\`.group_id
      JOIN subjects ON marksentry.subject_id = subjects.subject_id
      WHERE marksentry.student_id = ? AND marksentry.approved = 1
    `;
    const [rows] = await db.query(query, [student_id]);
    res.send(utils.createSuccess(rows));
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).send(utils.createError(error));
  }
});



module.exports = router;

