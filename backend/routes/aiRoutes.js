const express = require('express');
const router = express.Router();
const { askAI } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('member', 'manager'));

router.post('/ask', askAI);

module.exports = router;
