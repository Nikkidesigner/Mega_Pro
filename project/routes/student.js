const express = require("express");
const router = express.Router();
const db = require("../db");
const utils = require("../utils");
const cryptoJS = require("crypto-js");
const config = require("../config");
const jwt = require("jsonwebtoken");

router.post("/register", async (request, response) => {
  const { email, password } = request.body;
  try {
    const encryptedPassword = String(cryptoJS.SHA256(password));
    const statement = `INSERT INTO users (email, password) VALUES (?, ?);`;
    const result = await db.execute(statement, [email, encryptedPassword]);
    response.send(utils.createSuccess(result));
  } catch (error) {
    response.send(utils.createError(error));
  }
});

router.post("/login", async (request, response) => {
  const { email, password } = request.body;
  try {
    const encryptedPassword = String(cryptoJS.SHA256(password));
    const statement = `SELECT id, email FROM users WHERE email = ? AND password = ?`;
    db.execute(statement, [email, encryptedPassword], (error, users) => {
      if (error) {
        response.status(500).send(utils.createError(`error is ${error}`));
      } else {
        if (users.length == 0) {
          response.status(401).send(utils.createError(`user does not exist`));
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
      }
    });
  } catch (error) {
    response.status(500).send(utils.createError(error));
  }
});

module.exports = router;
