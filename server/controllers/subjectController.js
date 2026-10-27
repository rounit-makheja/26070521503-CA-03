const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const Task = require('../models/Task');

// @desc    Get all subjects for current student (with task count)
// @route   GET /api/subjects
// @access  Private
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user._id }).sort({ name: 1 });

    // Count total, completed, pending, and overdue tasks for each subject
    const subjectIds = subjects.map((s) => s._id);
    const now = new Date();

    const taskCounts = await Task.aggregate([
      { $match: { userId: req.user._id, subjectId: { $in: subjectIds } } },
      {
        $group: {
          _id: '$subjectId',
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          pendingTasks: {
            $sum: { $cond: [{ $ne: ['$status', 'Completed'] }, 1, 0] }
          },
          overdueTasks: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$status', 'Completed'] },
                    { $lt: ['$dueDate', now] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const countMap = {};
    taskCounts.forEach((tc) => {
      const total = tc.totalTasks || 0;
      const completed = tc.completedTasks || 0;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      countMap[tc._id.toString()] = {
        totalTasks: total,
        completedTasks: completed,
        pendingTasks: tc.pendingTasks || 0,
        overdueTasks: tc.overdueTasks || 0,
        completionRate
      };
    });

    const subjectsWithCounts = subjects.map((sub) => {
      const counts = countMap[sub._id.toString()] || {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        overdueTasks: 0,
        completionRate: 0
      };
      return {
        ...sub.toObject(),
        totalTasks: counts.totalTasks,
        completedTasks: counts.completedTasks,
        pendingTasks: counts.pendingTasks,
        overdueTasks: counts.overdueTasks,
        completionRate: counts.completionRate
      };
    });

    return res.status(200).json({
      success: true,
      count: subjectsWithCounts.length,
      data: subjectsWithCounts
    });
  } catch (error) {
    console.error('[getSubjects Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve subjects'
    });
  }
};

// @desc    Get single subject by ID
// @route   GET /api/subjects/:id
// @access  Private
const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subject ID'
      });
    }

    const subject = await Subject.findOne({ _id: id, userId: req.user._id });
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: subject
    });
  } catch (error) {
    console.error('[getSubjectById Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve subject'
    });
  }
};

// @desc    Create new subject
// @route   POST /api/subjects
// @access  Private
const createSubject = async (req, res) => {
  try {
    const { name, code, instructor, color } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Subject name is required'
      });
    }

    // Check if student already has a subject with the same name
    const existing = await Subject.findOne({
      userId: req.user._id,
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A subject with this name already exists'
      });
    }

    const subject = await Subject.create({
      userId: req.user._id,
      name: name.trim(),
      code: code ? code.trim().toUpperCase() : '',
      instructor: instructor ? instructor.trim() : '',
      color: color || '#4F46E5'
    });

    return res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject
    });
  } catch (error) {
    console.error('[createSubject Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create subject'
    });
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private
const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, instructor, color } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subject ID'
      });
    }

    const subject = await Subject.findOne({ _id: id, userId: req.user._id });
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found or you do not have permission to edit it'
      });
    }

    if (name && name.trim()) {
      // Check duplicate name on update
      const existing = await Subject.findOne({
        _id: { $ne: id },
        userId: req.user._id,
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'Another subject with this name already exists'
        });
      }
      subject.name = name.trim();
    }

    if (code !== undefined) subject.code = code.trim().toUpperCase();
    if (instructor !== undefined) subject.instructor = instructor.trim();
    if (color) subject.color = color;

    await subject.save();

    return res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: subject
    });
  } catch (error) {
    console.error('[updateSubject Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update subject'
    });
  }
};

// @desc    Delete subject (Safe deletion: check for linked tasks)
// @route   DELETE /api/subjects/:id
// @access  Private
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subject ID'
      });
    }

    const subject = await Subject.findOne({ _id: id, userId: req.user._id });
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found or you do not have permission to delete it'
      });
    }

    // Check if there are active tasks linked to this subject
    const linkedTasksCount = await Task.countDocuments({
      userId: req.user._id,
      subjectId: id
    });

    if (linkedTasksCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete '${subject.name}' because it has ${linkedTasksCount} assignment(s) assigned to it. Please reassign or delete the tasks first.`
      });
    }

    await Subject.deleteOne({ _id: id, userId: req.user._id });

    return res.status(200).json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('[deleteSubject Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete subject'
    });
  }
};

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
};
