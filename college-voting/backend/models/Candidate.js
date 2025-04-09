const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter candidate name'],
    maxLength: [50, 'Name cannot exceed 50 characters']
  },
  position: {
    type: String,
    required: [true, 'Please enter position']
  },
  department: {
    type: String,
    required: [true, 'Please enter department']
  },
  bio: {
    type: String,
    maxLength: [500, 'Bio cannot exceed 500 characters']
  },
  votes: {
    type: Number,
    default: 0
  },
  election: {
    type: mongoose.Schema.ObjectId,
    ref: 'Election',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Candidate', candidateSchema);
