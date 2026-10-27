const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const Task = require('../models/Task');

// @desc    Scan student tasks and sync deadline notifications without duplicates
const syncStudentReminders = async (userId) => {
  const now = new Date();
  const todayDateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  // Find active (non-completed) tasks due within 3 days or overdue
  const activeTasks = await Task.find({
    userId,
    status: { $ne: 'Completed' },
    dueDate: { $lte: threeDaysFromNow }
  }).populate('subjectId', 'name code color');

  for (const task of activeTasks) {
    const dueTime = new Date(task.dueDate).getTime();
    const diffHours = (dueTime - now.getTime()) / (1000 * 60 * 60);

    let type = null;
    let title = '';
    let message = '';
    let reminderKey = '';

    const subjectPrefix = task.subjectId?.name ? `[${task.subjectId.name}] ` : '';

    if (diffHours < 0) {
      // Overdue
      type = 'OVERDUE';
      title = `Overdue Assignment: ${task.title}`;
      message = `${subjectPrefix}"${task.title}" was due on ${new Date(task.dueDate).toLocaleDateString()}. Please complete or submit it as soon as possible.`;
      // One overdue notification per task
      reminderKey = `overdue_${task._id.toString()}`;
    } else if (diffHours <= 24) {
      // Due Today / within 24h
      type = 'DUE_TODAY';
      title = `Due Today: ${task.title}`;
      message = `${subjectPrefix}"${task.title}" is due today at ${new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
      // Keyed by task + today's date so it does not duplicate on repeat views today
      reminderKey = `due_today_${task._id.toString()}_${todayDateStr}`;
    } else {
      // Due soon (within 3 days)
      type = 'DUE_SOON';
      const daysLeft = Math.ceil(diffHours / 24);
      title = `Upcoming Deadline: ${task.title}`;
      message = `${subjectPrefix}"${task.title}" is due in ${daysLeft} days (${new Date(task.dueDate).toLocaleDateString()}).`;
      // Keyed by task + date string
      reminderKey = `due_soon_${task._id.toString()}_${todayDateStr}`;
    }

    if (type && reminderKey) {
      try {
        await Notification.updateOne(
          { userId, reminderKey },
          {
            $setOnInsert: {
              userId,
              taskId: task._id,
              type,
              title,
              message,
              reminderKey,
              isRead: false
            }
          },
          { upsert: true }
        );
      } catch (err) {
        // Ignore duplicate key collision errors during concurrent requests
        if (err.code !== 11000) {
          console.warn('[SyncReminders error]:', err.message);
        }
      }
    }
  }
};

// @desc    Get all notifications for logged-in student (triggers reminder sync)
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    // Trigger on-demand sync of current student's task reminders
    await syncStudentReminders(userId);

    const notifications = await Notification.find({ userId })
      .populate('taskId', 'title status dueDate')
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    return res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error('[getNotifications Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications'
    });
  }
};

// @desc    Mark single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }

    const notification = await Notification.findOne({ _id: id, userId: req.user._id });
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.isRead = true;
    await notification.save();

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false
    });

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
      unreadCount
    });
  } catch (error) {
    console.error('[markAsRead Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update notification'
    });
  }
};

// @desc    Mark all student notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      unreadCount: 0
    });
  } catch (error) {
    console.error('[markAllAsRead Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark all as read'
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
