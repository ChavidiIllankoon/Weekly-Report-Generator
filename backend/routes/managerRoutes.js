const express = require('express');
const router = express.Router();
const { getAllReports, getDashboard } = require('../controllers/managerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('manager'));

router.get('/reports', getAllReports);
router.get('/dashboard', getDashboard);

module.exports = router;
