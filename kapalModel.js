const db = require('../db');

const Kapal = {
  getAll: (callback) => {
    db.query('SELECT * FROM kapal', callback);
  },
  create: (data, callback) => {
    db.query('INSERT INTO kapal SET ?', data, callback);
  },
  update: (id, data, callback) => {
    db.query('UPDATE kapal SET ? WHERE id_kapal = ?', [data, id], callback);
  },
  delete: (id, callback) => {
    db.query('DELETE FROM kapal WHERE id_kapal = ?', id, callback);
  },
};

module.exports = Kapal;