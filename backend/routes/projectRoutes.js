const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', getProjects);
router.post('/', authorize('manager'), createProject);
router.put('/:id', authorize('manager'), updateProject);
router.delete('/:id', authorize('manager'), deleteProject);

module.exports = router;
