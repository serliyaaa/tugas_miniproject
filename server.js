const express = require('express');
const mysql = require('mysql2');
const http = require('http');
const bcrypt = require('bcryptjs');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/auth');  // Import route auth.js

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;
const SECRET_KEY = 'your_jwt_secret_key';

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kelautan',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Database connected!');
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket setup
io.on('connection', (socket) => {
    console.log('A user connected');
  });


// JWT Middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send('Access Denied');

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send('Invalid Token');
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).send('Admin access only');
  next();
}

// Use auth routes
  // Gunakan route auth.js pada path '/auth'
// Serve static files from 'public' folder
app.use(express.static('public'));
app.use('/auth', authRoutes);

// Routes
// Register
app.post('/auth/Register', async (req, res) => {
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
  
  // Login
  app.post('/auth/Login', (req, res) => {
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
  

// CRUD Kapal
 // API Routes
 app.get('/kapal', (req, res) => {
    db.query('SELECT * FROM kapal', (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    });
  });

// Create kapal (admin only)
app.post('/kapal', (req, res) => {
    const { nama_kapal, jenis_kapal, kapasitas_muatan } = req.body;
  
    db.query(
      'INSERT INTO kapal (nama_kapal, jenis_kapal, kapasitas_muatan) VALUES (?, ?, ?)',
      [nama_kapal, jenis_kapal, kapasitas_muatan],
      (err, result) => {
        if (err) return res.status(500).json(err);
        io.emit('data_changed', { event: 'data_changed', message: 'New kapal added.' });
        res.status(201).json({ message: 'Kapal added successfully.', id: result.insertId });
      }
    );
  });

// Update kapal (admin only)
app.put('/kapal/:id', (req, res) => {
    const { id } = req.params;
    const { nama_kapal, jenis_kapal, kapasitas_muatan } = req.body;
  
    db.query(
      'UPDATE kapal SET nama_kapal = ?, jenis_kapal = ?, kapasitas_muatan = ? WHERE id_kapal = ?',
      [nama_kapal, jenis_kapal, kapasitas_muatan, id],
      (err, result) => {
        if (err) return res.status(500).json(err);
        io.emit('data_changed', { event: 'data_changed', message: 'Kapal updated.' });
        res.json({ message: 'Kapal updated successfully.' });
      }
    );
  });  
  

// Delete kapal (admin only)
app.delete('/kapal/:id', (req, res) => {
    const { id } = req.params;
  
    db.query('DELETE FROM kapal WHERE id_kapal = ?', [id], (err, result) => {
      if (err) return res.status(500).json(err);
      io.emit('data_changed', { event: 'data_changed', message: 'Kapal deleted.' });
      res.json({ message: 'Kapal deleted successfully.' });
    });
  });

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
