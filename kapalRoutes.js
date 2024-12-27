// kapalRoutes.js
const express = require('express');
const router = express.Router();
const kapalController = require('../controllers/kapalController');
const authenticateJWT = require('../middleware/authMiddleware');

router.get('/', authenticateJWT, kapalController.getAllKapal);
router.post('/', authenticateJWT, kapalController.createKapal);
router.put('/:id', authenticateJWT, kapalController.updateKapal);
router.delete('/:id', authenticateJWT, kapalController.deleteKapal);

module.exports = router;
