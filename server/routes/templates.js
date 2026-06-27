const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, templateController.getTemplates);
router.post('/', authMiddleware, templateController.createTemplate);

module.exports = router;
