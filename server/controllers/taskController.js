const mongoose = require('mongoose');
const Task = require('../models/Task');
const Subject = require('../models/Subject');

// Allowed enums for validation
const ALLOWED_TYPES = ['Assignment', 'Project', 'Lab Record', 'Exam Prep', 'Homework', 'Other'];
const ALLOWED_PRIORITIES = ['High', 'Medium', 'Low'];
const ALLOWED_STATUSES = ['Pending', 'In Progress', 'Completed'];

// @desc    Get all tasks for current student (with filters, search, and sorting)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, subjectId, search, sort, timeframe } = req.query;

    const query = { userId: req.user._id };
    const now = new Date();

    // Timeframe filters: 'today', 'week', 'overdue'
    if (timeframe === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      query.dueDate = { $gte: startOfDay, $lte: endOfDay };
    } else if (timeframe === 'week') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 59, 999);
      query.dueDate = { $gte: startOfDay, $lte: endOfWeek };
    } else if (timeframe === 'overdue') {
      query.status = { $ne: 'Completed' };
      query.dueDate = { $lt: now };
    }

    if (status && ALLOWED_STATUSES.includes(status)) {
      query.status = status;
    }

    if (priority && ALLOWED_PRIORITIES.includes(priority)) {
      query.priority = priority;
    }

    if (subjectId && mongoose.Types.ObjectId.isValid(subjectId)) {
      query.subjectId = subjectId;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    let sortOption = { dueDate: 1 }; // Default: closest deadline first
    if (sort === 'dueDate_desc') sortOption = { dueDate: -1 };
    else if (sort === 'priority') {
      // High (H) -> Medium (M) -> Low (L) custom ordering
      sortOption = { priority: 1, dueDate: 1 };
    } else if (sort === 'createdAt_desc') sortOption = { createdAt: -1 };
    else if (sort === 'createdAt_asc') sortOption = { createdAt: 1 };

    const tasks = await Task.find(query)
      .populate('subjectId', 'name code color')
      .sort(sortOption);

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('[getTasks Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve tasks'
    });
  }
};

// @desc    Get dashboard metrics & summary
// @route   GET /api/tasks/stats/summary
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
      completedThisWeek
    ] = await Promise.all([
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, status: 'Pending' }),
      Task.countDocuments({ userId, status: 'In Progress' }),
      Task.countDocuments({ userId, status: 'Completed' }),
      Task.countDocuments({
        userId,
        status: { $ne: 'Completed' },
        dueDate: { $lt: now }
      }),
      Task.countDocuments({
        userId,
        status: 'Completed',
        completedAt: { $gte: sevenDaysAgo }
      })
    ]);

    // Overall completion percentage
    const overallRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Next 3 urgent deadlines
    const urgentTasks = await Task.find({
      userId,
      status: { $ne: 'Completed' }
    })
      .populate('subjectId', 'name code color')
      .sort({ dueDate: 1 })
      .limit(3);

    return res.status(200).json({
      success: true,
      data: {
        total: totalTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
        overdue: overdueTasks,
        completedThisWeek,
        completionRate: overallRate,
        urgentTasks
      }
    });
  } catch (error) {
    console.error('[getTaskStats Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve task statistics'
    });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    const task = await Task.findOne({ _id: id, userId: req.user._id }).populate(
      'subjectId',
      'name code color'
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied'
      });
    }

    return res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('[getTaskById Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve task'
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, subjectId, type, priority, status, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    if (!dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Task due date is required'
      });
    }

    // Verify subject ownership if subjectId is provided
    let verifiedSubjectId = null;
    if (subjectId) {
      if (!mongoose.Types.ObjectId.isValid(subjectId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid subject ID'
        });
      }
      const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
      if (!subject) {
        return res.status(400).json({
          success: false,
          message: 'Selected subject does not exist or does not belong to your account'
        });
      }
      verifiedSubjectId = subject._id;
    }

    const finalType = ALLOWED_TYPES.includes(type) ? type : 'Assignment';
    const finalPriority = ALLOWED_PRIORITIES.includes(priority) ? priority : 'Medium';
    const finalStatus = ALLOWED_STATUSES.includes(status) ? status : 'Pending';

    const task = await Task.create({
      userId: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      subjectId: verifiedSubjectId,
      type: finalType,
      priority: finalPriority,
      status: finalStatus,
      dueDate: new Date(dueDate),
      completedAt: finalStatus === 'Completed' ? new Date() : null
    });

    const populatedTask = await Task.findById(task._id).populate('subjectId', 'name code color');

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: populatedTask
    });
  } catch (error) {
    console.error('[createTask Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create task'
    });
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, subjectId, type, priority, status, dueDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    const task = await Task.findOne({ _id: id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied'
      });
    }

    if (title && title.trim()) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();

    if (subjectId !== undefined) {
      if (subjectId === '' || subjectId === null) {
        task.subjectId = null;
      } else {
        if (!mongoose.Types.ObjectId.isValid(subjectId)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid subject ID'
          });
        }
        const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
        if (!subject) {
          return res.status(400).json({
            success: false,
            message: 'Selected subject does not belong to your account'
          });
        }
        task.subjectId = subject._id;
      }
    }

    if (type && ALLOWED_TYPES.includes(type)) task.type = type;
    if (priority && ALLOWED_PRIORITIES.includes(priority)) task.priority = priority;

    if (status && ALLOWED_STATUSES.includes(status)) {
      task.status = status;
      if (status === 'Completed' && !task.completedAt) {
        task.completedAt = new Date();
      } else if (status !== 'Completed') {
        task.completedAt = null;
      }
    }

    if (dueDate) {
      task.dueDate = new Date(dueDate);
    }

    await task.save();

    const populatedTask = await Task.findById(task._id).populate('subjectId', 'name code color');

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: populatedTask
    });
  } catch (error) {
    console.error('[updateTask Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update task'
    });
  }
};

// @desc    Quick update status (e.g., mark as completed/pending)
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`
      });
    }

    const task = await Task.findOne({ _id: id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied'
      });
    }

    task.status = status;
    task.completedAt = status === 'Completed' ? new Date() : null;

    await task.save();

    const populatedTask = await Task.findById(task._id).populate('subjectId', 'name code color');

    return res.status(200).json({
      success: true,
      message: `Task marked as ${status}`,
      data: populatedTask
    });
  } catch (error) {
    console.error('[updateTaskStatus Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update task status'
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    const task = await Task.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('[deleteTask Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete task'
    });
  }
};

module.exports = {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
};
