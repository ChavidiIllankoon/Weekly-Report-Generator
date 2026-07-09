const Report = require('../models/Report');
const User = require('../models/User');

// @desc    Get all reports (with filters)
// @route   GET /api/manager/reports
// @access  Private (manager)
const getAllReports = async (req, res) => {
  try {
    const { week, project, member, status } = req.query;
    const filter = {};

    if (week) filter.week = week;
    if (project) filter.project = project;
    if (member) filter.userId = member;
    if (status) filter.status = status;

    const reports = await Report.find(filter)
      .populate('userId', 'name email role')
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.error('Get all reports error:', error.message);
    res.status(500).json({ message: 'Server error fetching reports' });
  }
};

// @desc    Get manager dashboard stats
// @route   GET /api/manager/dashboard
// @access  Private (manager)
const getDashboard = async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const submittedReports = await Report.countDocuments({ status: 'Submitted' });
    const pendingReports = await Report.countDocuments({ status: 'Draft' });

    // Count reports with blockers
    const reportsWithBlockers = await Report.countDocuments({
      blockers: { $exists: true, $not: { $size: 0 } },
      status: 'Submitted',
    });

    // Total open blockers count
    const blockerAgg = await Report.aggregate([
      { $match: { blockers: { $exists: true, $not: { $size: 0 } } } },
      { $project: { blockerCount: { $size: '$blockers' } } },
      { $group: { _id: null, total: { $sum: '$blockerCount' } } },
    ]);
    const openBlockers = blockerAgg.length > 0 ? blockerAgg[0].total : 0;

    // Reports by week (for line chart)
    const reportsByWeek = await Report.aggregate([
      { $match: { status: 'Submitted' } },
      {
        $group: {
          _id: '$week',
          count: { $sum: 1 },
          totalTasks: { $sum: { $size: '$completedTasks' } },
          totalHours: { $sum: '$hoursWorked' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Reports by project (for bar chart)
    const reportsByProject = await Report.aggregate([
      {
        $lookup: {
          from: 'projects',
          localField: 'project',
          foreignField: '_id',
          as: 'projectInfo',
        },
      },
      { $unwind: '$projectInfo' },
      {
        $group: {
          _id: '$projectInfo.name',
          count: { $sum: 1 },
          totalHours: { $sum: '$hoursWorked' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Recent activity (last 10 submitted reports)
    const recentActivity = await Report.find({ status: 'Submitted' })
      .populate('userId', 'name email')
      .populate('project', 'name')
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('userId project week status updatedAt completedTasks');

    // Team members count
    const totalMembers = await User.countDocuments({ role: 'member' });

    res.json({
      totalReports,
      submittedReports,
      pendingReports,
      openBlockers,
      reportsWithBlockers,
      totalMembers,
      reportsByWeek,
      reportsByProject,
      recentActivity,
    });
  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.status(500).json({ message: 'Server error fetching dashboard' });
  }
};

module.exports = { getAllReports, getDashboard };
