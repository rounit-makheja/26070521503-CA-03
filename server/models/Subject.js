const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Subject must belong to a student'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'Please provide subject name'],
      trim: true,
      maxlength: [100, 'Subject name cannot exceed 100 characters']
    },
    code: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [20, 'Subject code cannot exceed 20 characters'],
      default: ''
    },
    instructor: {
      type: String,
      trim: true,
      maxlength: [100, 'Instructor name cannot exceed 100 characters'],
      default: ''
    },
    color: {
      type: String,
      default: '#4F46E5', // Modern indigo default badge color
      match: [/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Please provide a valid hex color']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Subject', subjectSchema);
