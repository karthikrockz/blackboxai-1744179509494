const mongoose = require('mongoose');
const Vote = require('../models/Vote');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Submit vote
// @route   POST /api/v1/elections/:electionId/vote
// @access  Private
exports.submitVote = asyncHandler(async (req, res, next) => {
  req.body.election = req.params.electionId;
  req.body.user = req.user.id;

  const existingVote = await Vote.findOne({
    election: req.params.electionId,
    user: req.user.id
  });

  if (existingVote) {
    return next(new ErrorResponse('You have already voted in this election', 400));
  }

  const vote = await Vote.create(req.body);
  res.status(201).json({ success: true, data: vote });
});

// @desc    Get election results
// @route   GET /api/v1/elections/:electionId/results
// @access  Public
exports.getResults = asyncHandler(async (req, res, next) => {
  const results = await Vote.aggregate([
    { $match: { election: mongoose.Types.ObjectId(req.params.electionId) } },
    { $group: { _id: '$candidate', count: { $sum: 1 } } },
    { 
      $lookup: {
        from: 'candidates',
        localField: '_id',
        foreignField: '_id',
        as: 'candidate'
      }
    },
    { $unwind: '$candidate' },
    { $sort: { count: -1 } },
    { 
      $project: {
        candidateName: '$candidate.name',
        candidatePhoto: '$candidate.photo',
        votes: '$count',
        _id: 0
      }
    }
  ]);

  // Get total votes
  const totalVotes = results.reduce((sum, candidate) => sum + candidate.votes, 0);

  // Calculate percentages
  const resultsWithPercentages = results.map(candidate => ({
    ...candidate,
    percentage: totalVotes > 0 ? Math.round((candidate.votes / totalVotes) * 100) : 0
  }));

  res.status(200).json({ 
    success: true, 
    data: {
      results: resultsWithPercentages,
      totalVotes
    }
  });
});

// @desc    Check if user has voted
// @route   GET /api/v1/elections/:electionId/hasVoted
// @access  Private
exports.hasVoted = asyncHandler(async (req, res, next) => {
  const vote = await Vote.findOne({
    election: req.params.electionId,
    user: req.user.id
  });

  res.status(200).json({ 
    success: true, 
    data: {
      hasVoted: !!vote,
      votedCandidate: vote ? vote.candidate : null
    }
  });
});
