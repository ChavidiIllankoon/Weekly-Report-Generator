const express = require('express');
const router = express.Router();
const {
  createReport,
  getMyReports,
  updateReport,
  deleteReport,
  submitReport,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.post('/', createReport);
router.get('/my', getMyReports);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);
router.patch('/submit/:id', submitReport);

module.exports = router;
