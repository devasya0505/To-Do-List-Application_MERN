const { Parser } = require('json2csv');
const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Export tasks as CSV
 * @route   GET /api/export/csv
 * @access  Private
 */
const exportCSV = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (tasks.length === 0) {
      throw ApiError.notFound('No tasks to export.');
    }

    const fields = [
      { label: 'Title', value: 'title' },
      { label: 'Description', value: 'description' },
      { label: 'Status', value: 'status' },
      { label: 'Priority', value: 'priority' },
      { label: 'Tags', value: (row) => (row.tags || []).join(', ') },
      { label: 'Due Date', value: (row) => (row.dueDate ? new Date(row.dueDate).toLocaleDateString() : 'N/A') },
      { label: 'Created At', value: (row) => new Date(row.createdAt).toLocaleDateString() },
      { label: 'Updated At', value: (row) => new Date(row.updatedAt).toLocaleDateString() },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(tasks);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=tasks_${Date.now()}.csv`);
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = { exportCSV };
