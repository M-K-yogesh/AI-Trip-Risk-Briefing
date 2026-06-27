const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middlewares/auth');

router.post('/generate', authMiddleware, aiController.generate);

module.exports = router;
