const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const router = express.Router();

// Database connection (gunakan koneksi yang sama seperti di server.js)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kelautan',
});

// Secret key untuk JWT
const SECRET_KEY = 'your_jwt_secret_key';

// Register route
router.post('/Register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role], (err) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: 'User registered successfully.' });
  });
});

// Login route
router.post('/Login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json({ message: 'User not found.' });

    const user = result[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(403).json({ message: 'Invalid credentials.' });

    const token = jwt.sign({ id: user.id_user, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  });
});

module.exports = router;
