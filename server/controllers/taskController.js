const mongoose = require('mongoose');
const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Get all tasks (paginated, filtered, sorted, searched)
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      tags,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      dueBefore,
      dueAfter,
    } = req.query;

    // Build query filter
    const filter = { user: req.user.id, isDeleted: false };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (tags) {
      const tagArray = tags.split(',').map((t) => t.trim().toLowerCase());
      filter.tags = { $in: tagArray };
    }

    // Date range filter
    if (dueBefore || dueAfter) {
      filter.dueDate = {};
      if (dueAfter) filter.dueDate.$gte = new Date(dueAfter);
      if (dueBefore) filter.dueDate.$lte = new Date(dueBefore);
    }

    // Search filter (text search on title and description)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Sort options
    const allowedSortFields = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'title', 'status'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        tasks,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
          hasMore: pageNum * limitNum < total,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      throw ApiError.notFound('Task not found.');
    }

    res.status(200).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, tags, dueDate } = req.body;

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      status,
      priority,
      tags: tags || [],
      dueDate: dueDate || null,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, tags, dueDate } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
      isDeleted: false,
    });

    if (!task) {
      throw ApiError.notFound('Task not found.');
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (tags !== undefined) task.tags = tags;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update task status only (for Kanban drag & drop)
 * @route   PATCH /api/tasks/:id/status
 * @access  Private
 */
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id, isDeleted: false },
      { status },
      { new: true, runValidators: true }
    );

    if (!task) {
      throw ApiError.notFound('Task not found.');
    }

    res.status(200).json({
      success: true,
      message: `Task moved to ${status}`,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Soft delete a task (move to trash)
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const softDeleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
      isDeleted: false,
    });

    if (!task) {
      throw ApiError.notFound('Task not found.');
    }

    task.isDeleted = true;
    task.deletedAt = new Date();
    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task moved to trash',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Restore a task from trash
 * @route   PATCH /api/tasks/:id/restore
 * @access  Private
 */
const restoreTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
      isDeleted: true,
    });

    if (!task) {
      throw ApiError.notFound('Task not found in trash.');
    }

    task.isDeleted = false;
    task.deletedAt = null;
    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task restored successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Permanently delete a task
 * @route   DELETE /api/tasks/:id/permanent
 * @access  Private
 */
const permanentDeleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      throw ApiError.notFound('Task not found.');
    }

    res.status(200).json({
      success: true,
      message: 'Task permanently deleted',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get trashed tasks
 * @route   GET /api/tasks/trash
 * @access  Private
 */
const getTrash = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
      isDeleted: true,
    })
      .sort({ deletedAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: { tasks },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get task analytics for dashboard
 * @route   GET /api/tasks/analytics
 * @access  Private
 */
const getAnalytics = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Status distribution
    const statusStats = await Task.aggregate([
      { $match: { user: userId, isDeleted: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Priority distribution
    const priorityStats = await Task.aggregate([
      { $match: { user: userId, isDeleted: false } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // Total counts (Mongoose auto-casts string to ObjectId for find/countDocuments)
    const userIdStr = req.user.id;
    const totalTasks = await Task.countDocuments({ user: userIdStr, isDeleted: false });
    const completedTasks = await Task.countDocuments({
      user: userIdStr,
      isDeleted: false,
      status: 'completed',
    });
    const overdueTasks = await Task.countDocuments({
      user: userIdStr,
      isDeleted: false,
      status: { $ne: 'completed' },
      dueDate: { $lt: new Date() },
    });
    const trashedTasks = await Task.countDocuments({ user: userIdStr, isDeleted: true });

    // Weekly productivity (tasks completed in the last 7 days grouped by day)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyProductivity = await Task.aggregate([
      {
        $match: {
          user: userId,
          isDeleted: false,
          status: 'completed',
          updatedAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Tag distribution
    const tagStats = await Task.aggregate([
      { $match: { user: userId, isDeleted: false } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          total: totalTasks,
          completed: completedTasks,
          overdue: overdueTasks,
          trashed: trashedTasks,
          completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        },
        statusDistribution: statusStats,
        priorityDistribution: priorityStats,
        weeklyProductivity,
        tagDistribution: tagStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  softDeleteTask,
  restoreTask,
  permanentDeleteTask,
  getTrash,
  getAnalytics,
};
