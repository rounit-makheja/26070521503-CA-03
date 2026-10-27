const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide student name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    college: {
      type: String,
      required: [true, 'Please provide college name'],
      trim: true,
      maxlength: [150, 'College name cannot exceed 150 characters']
    },
    degree: {
      type: String,
      required: [true, 'Please provide degree / branch (e.g., B.Tech CSE)'],
      trim: true,
      maxlength: [100, 'Degree cannot exceed 100 characters']
    },
    semester: {
      type: String,
      required: [true, 'Please provide current semester (e.g., 5th Semester)'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide student email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters']
    }
  },
  {
    timestamps: true
  }
);

// Method to safely return user object without password
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
