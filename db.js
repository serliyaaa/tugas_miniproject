// db.js
const mysql = require('mysql2');
const dotenv = require('dotenv'); // Pastikan dotenv dikonfigurasi dengan benar

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Database connected!');
});

module.exports = db;
