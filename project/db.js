const mysql = require('mysql2');
const dotenv = require('dotenv')
const config = require('./config');


dotenv.config();

const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

pool.getConnection((err, connected) => {
  if(err){
    console.log(`failed to connect to database cause ${err}`)
    return
  }
  console.log("connected successful");
  
  pool.query(`SELECT * FROM staff`, (err, result) => {
    if(err){
      console.log("error while executing", err)
      return;
    }
    console.log(result);
  })
});