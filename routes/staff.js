const express = require("express");
const router = express.Router();
const db = require("../db");
const utils = require("../utils");
const cryptoJS = require("crypto-js");
const config = require("../config");
const jwt = require("jsonwebtoken");

router.get("/register", (request, response) =>{
  response.send("<h1>Staff register</h1>")
})

router.post("/register", async (request, response) => {
  console.log('Request Body:', request.body);
  const { employee_number, staff_name, email, password } = request.body;
  try {
    const encryptedPassword = String(cryptoJS.SHA256(password));
    const statement = `INSERT INTO staff (employee_number, staff_name, email, password) VALUES (?, ?, ?, ?);`;
    const [result] = await db.execute(statement, [employee_number, staff_name, email, encryptedPassword]);
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
    const statement = `SELECT * FROM staff WHERE email = ? AND password = ?`;
    const [users] = await db.execute(statement, [email, encryptedPassword]);
    if (users.length == 0) {
      response.status(401).send(utils.createError(`user does not exist`));
    } else {
      const user = users[0];
      console.log("user-", user);
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role, 
          course_name: user.course_name
        },
        config.SECRET_KEY
      );
      response.send(utils.createSuccess({ token, email: user.email }));
    }
  } catch (error) {
    response.status(500).send(utils.createError(error));
  }
});

router.get('/show-unapproved-tasks/:course_name', async (req, res) => {
  const { course_name } = req.params;
  try {
    const statement = `
      SELECT 
        me.entry_id, 
        me.student_id, s.student_name,
        me.subject_id, sub.subject_name,
        me.group_id, me.course_id, me.staff_id, 
        me.theory, me.lab, me.IA1, me.IA2, 
        me.from_date, me.till_date, me.approved,
        es.theory_weightage, es.lab_weightage, es.ia1_weightage, es.ia2_weightage
      FROM 
        marksentry me
      JOIN 
        courses c ON me.course_id = c.course_id
      JOIN 
        students s ON me.student_id = s.student_id
      JOIN 
        subjects sub ON me.subject_id = sub.subject_id
      JOIN
        evaluationscheme es ON sub.subject_id = es.subject_id
      WHERE 
        c.course_name = ? AND me.approved = 0
    `;
    const [rows] = await db.query(statement, [course_name]);
    res.send(utils.createSuccess(rows));
  } catch (err) {
    console.error('Error fetching unapproved tasks:', err);
    res.status(500).send(utils.createError(err));
  }
});

router.put("/update-marks/:entry_id", async (req, res) => {
  const { entry_id } = req.params;
  const { theory, lab, ia1, ia2 } = req.body;

  try {
    const statement = `
      UPDATE marksentry
      SET theory = ?, lab = ?, IA1 = ?, IA2 = ?, approved = 1
      WHERE entry_id = ?
    `;
    const [result] = await db.execute(statement, [theory, lab, ia1, ia2, entry_id]);
    res.send(utils.createSuccess(result));
  } catch (error) {
    console.error('Error updating marks:', error);
    res.status(500).send(utils.createError(error));
  }
});




module.exports = router;
