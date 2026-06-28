const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed'],
        message: 'Status must be pending, in-progress, or completed',
      },
      default: 'pending',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'critical'],
        message: 'Priority must be low, medium, high, or critical',
      },
      default: 'medium',
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 5;
        },
        message: 'A task can have at most 5 tags',
      },
    },
    dueDate: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
taskSchema.index({ user: 1, isDeleted: 1, status: 1 });
taskSchema.index({ user: 1, isDeleted: 1, priority: 1 });
taskSchema.index({ user: 1, isDeleted: 1, dueDate: 1 });
taskSchema.index({ user: 1, isDeleted: 1, createdAt: -1 });

// Text index for search
taskSchema.index({ title: 'text', description: 'text' });

// TTL index: auto-delete trashed tasks after 30 days
taskSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

// Pre-find middleware to clean tags
taskSchema.pre('save', function (next) {
  if (this.tags) {
    this.tags = this.tags.map((tag) => tag.trim().toLowerCase()).filter((tag) => tag.length > 0);
    // Remove duplicates
    this.tags = [...new Set(this.tags)];
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
