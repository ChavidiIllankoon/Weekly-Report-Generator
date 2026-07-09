const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    week: {
      type: String,
      required: [true, 'Week is required (e.g., 2026-W27)'],
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
    },
    completedTasks: {
      type: [String],
      default: [],
    },
    plannedTasks: {
      type: [String],
      default: [],
    },
    blockers: {
      type: [String],
      default: [],
    },
    hoursWorked: {
      type: Number,
      required: [true, 'Hours worked is required'],
      min: 0,
      max: 168,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Draft', 'Submitted'],
      default: 'Draft',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
reportSchema.index({ userId: 1, week: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ project: 1 });

module.exports = mongoose.model('Report', reportSchema);
