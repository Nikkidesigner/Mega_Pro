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
router.post('/add-course', async (request, response) => {
    console.log('Request Body:', request.body);
    const {course_name} = request.body;
    console.log(request.body);
    try {
        const statement = `INSERT INTO courses (course_name) VALUES (?)`;
        const [result] = await db.execute(statement, [course_name]);
        response.send(utils.createSuccess(result));
    } catch (error) {
        console.error('Error during the adding course:', error);
        response.status(500).send(utils.createError(error));
    }  
});

// get method to show courses
router.get('/show-courses', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM courses');
        res.send(utils.createSuccess(rows));
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).send(utils.createError(err));
    }
});

module.exports = router;