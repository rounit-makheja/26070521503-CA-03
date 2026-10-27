const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Notification must belong to a student'],
      index: true
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
      index: true
    },
    type: {
      type: String,
      enum: ['OVERDUE', 'DUE_TODAY', 'DUE_SOON', 'SYSTEM'],
      default: 'DUE_SOON'
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    },
    // Unique key used to prevent generating duplicate reminder notifications for the same task & condition
    reminderKey: {
      type: String,
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index ensuring no duplicate reminder keys for a given user
notificationSchema.index({ userId: 1, reminderKey: 1 }, { unique: true });

module.exports = mongoose.model('Notification', notificationSchema);
