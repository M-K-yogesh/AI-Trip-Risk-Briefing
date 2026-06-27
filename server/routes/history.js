const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, historyController.getAllHistory);
router.get('/:id', authMiddleware, historyController.getHistoryById);
router.delete('/:id', authMiddleware, historyController.deleteHistoryById);
router.delete('/', authMiddleware, historyController.clearAllHistory);

module.exports = router;
