const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const {
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
} = require('../controllers/taskController');

const router = express.Router();

// All task routes require authentication
router.use(auth);

// Validation rules for create/update
const taskValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be pending, in-progress, or completed'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Priority must be low, medium, high, or critical'),
  body('tags')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Tags must be an array with at most 5 items'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Due date must be a valid date'),
];

const createValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  ...taskValidation.slice(1), // Skip the optional title rule
];

// Static routes MUST come before parameterized routes
// @route   GET /api/tasks/trash
router.get('/trash', getTrash);

// @route   GET /api/tasks/analytics
router.get('/analytics', getAnalytics);

// @route   GET /api/tasks
router.get('/', getTasks);

// @route   GET /api/tasks/:id
router.get('/:id', getTask);

// @route   POST /api/tasks
router.post('/', createValidation, validate, createTask);

// @route   PUT /api/tasks/:id
router.put('/:id', taskValidation, validate, updateTask);

// @route   PATCH /api/tasks/:id/status
router.patch(
  '/:id/status',
  [
    body('status')
      .isIn(['pending', 'in-progress', 'completed'])
      .withMessage('Status must be pending, in-progress, or completed'),
  ],
  validate,
  updateTaskStatus
);

// @route   DELETE /api/tasks/:id (soft delete)
router.delete('/:id', softDeleteTask);

// @route   PATCH /api/tasks/:id/restore
router.patch('/:id/restore', restoreTask);

// @route   DELETE /api/tasks/:id/permanent
router.delete('/:id/permanent', permanentDeleteTask);

module.exports = router;
