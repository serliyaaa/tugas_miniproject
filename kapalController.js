const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./config/db');

// kapalController.js
const Kapal = require('../models/kapalModel');

exports.getAllKapal = (req, res) => {
  Kapal.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.createKapal = (req, res) => {
  Kapal.create(req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Kapal created', id: results.insertId });
  });
};

exports.updateKapal = (req, res) => {
  Kapal.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Kapal updated' });
  });
};

exports.deleteKapal = (req, res) => {
  Kapal.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Kapal deleted' });
  });
};
