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
    const statement = `SELECT roll_number, email FROM students WHERE email = ? AND password = ?`;
    const [users] = await db.execute(statement, [email, encryptedPassword]);
    if (users.length == 0) {
      response.status(401).send(utils.createError(`student does not exist`));
    } else {
      const user = users[0];
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        config.SECRET_KEY
      );
      response.send(utils.createSuccess({ token, email: user.email }));
    }
  } catch (error) {
    response.status(500).send(utils.createError(error));
  }
});

module.exports = router;
