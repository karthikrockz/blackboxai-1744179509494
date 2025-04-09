const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter election title'],
    maxLength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxLength: [500, 'Description cannot exceed 500 characters']
  },
  positions: [{
    type: String,
    required: [true, 'Please enter at least one position']
  }],
  startDate: {
    type: Date,
    required: [true, 'Please enter start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please enter end date'],
    validate: {
      validator: function(endDate) {
        return endDate > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  isActive: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Validate positions array is not empty
electionSchema.path('positions').validate(function(value) {
  return value.length > 0;
}, 'At least one position is required');

module.exports = mongoose.model('Election', electionSchema);
