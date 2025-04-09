const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  election: {
    type: mongoose.Schema.ObjectId,
    ref: 'Election',
    required: true
  },
  candidate: {
    type: mongoose.Schema.ObjectId,
    ref: 'Candidate',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate votes
VoteSchema.index({ election: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);
