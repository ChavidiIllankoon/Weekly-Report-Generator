const Report = require('../models/Report');

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
  try {
    const { week, project, completedTasks, plannedTasks, blockers, hoursWorked, notes } = req.body;

    if (!week || !project || hoursWorked === undefined) {
      return res.status(400).json({ message: 'Week, project, and hours worked are required' });
    }

    const report = await Report.create({
      userId: req.user._id,
      week,
      project,
      completedTasks: completedTasks || [],
      plannedTasks: plannedTasks || [],
      blockers: blockers || [],
      hoursWorked,
      notes: notes || '',
      status: 'Draft',
    });

    const populated = await Report.findById(report._id)
      .populate('project', 'name')
      .populate('userId', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Create report error:', error.message);
    res.status(500).json({ message: 'Server error creating report' });
  }
};

// @desc    Get my reports
// @route   GET /api/reports/my
// @access  Private
const getMyReports = async (req, res) => {
  try {
    const { week, project, status } = req.query;
    const filter = { userId: req.user._id };

    if (week) filter.week = week;
    if (project) filter.project = project;
    if (status) filter.status = status;

    const reports = await Report.find(filter)
      .populate('project', 'name')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.error('Get my reports error:', error.message);
    res.status(500).json({ message: 'Server error fetching reports' });
  }
};

// @desc    Update a report (only drafts, only owner)
// @route   PUT /api/reports/:id
// @access  Private
const updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check ownership
    if (report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this report' });
    }

    // Only drafts can be edited
    if (report.status === 'Submitted') {
      return res.status(400).json({ message: 'Cannot edit a submitted report' });
    }

    const { week, project, completedTasks, plannedTasks, blockers, hoursWorked, notes } = req.body;

    report.week = week || report.week;
    report.project = project || report.project;
    report.completedTasks = completedTasks !== undefined ? completedTasks : report.completedTasks;
    report.plannedTasks = plannedTasks !== undefined ? plannedTasks : report.plannedTasks;
    report.blockers = blockers !== undefined ? blockers : report.blockers;
    report.hoursWorked = hoursWorked !== undefined ? hoursWorked : report.hoursWorked;
    report.notes = notes !== undefined ? notes : report.notes;

    const updated = await report.save();
    const populated = await Report.findById(updated._id)
      .populate('project', 'name')
      .populate('userId', 'name email');

    res.json(populated);
  } catch (error) {
    console.error('Update report error:', error.message);
    res.status(500).json({ message: 'Server error updating report' });
  }
};

// @desc    Delete a report (only drafts, only owner)
// @route   DELETE /api/reports/:id
// @access  Private
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this report' });
    }

    if (report.status === 'Submitted') {
      return res.status(400).json({ message: 'Cannot delete a submitted report' });
    }

    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete report error:', error.message);
    res.status(500).json({ message: 'Server error deleting report' });
  }
};

// @desc    Submit a report (change status to Submitted)
// @route   PATCH /api/reports/submit/:id
// @access  Private
const submitReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to submit this report' });
    }

    if (report.status === 'Submitted') {
      return res.status(400).json({ message: 'Report is already submitted' });
    }

    report.status = 'Submitted';
    const updated = await report.save();
    const populated = await Report.findById(updated._id)
      .populate('project', 'name')
      .populate('userId', 'name email');

    res.json(populated);
  } catch (error) {
    console.error('Submit report error:', error.message);
    res.status(500).json({ message: 'Server error submitting report' });
  }
};

module.exports = {
  createReport,
  getMyReports,
  updateReport,
  deleteReport,
  submitReport,
};
