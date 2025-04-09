const Election = require('../models/Election');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all elections
// @route   GET /api/v1/elections
// @access  Public
exports.getElections = asyncHandler(async (req, res, next) => {
  const elections = await Election.find().populate('createdBy', 'name email');
  res.status(200).json({ success: true, count: elections.length, data: elections });
});

// @desc    Get single election
// @route   GET /api/v1/elections/:id
// @access  Public
exports.getElection = asyncHandler(async (req, res, next) => {
  const election = await Election.findById(req.params.id).populate('createdBy', 'name email');
  
  if (!election) {
    return next(
      new ErrorResponse(`Election not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: election });
});

// @desc    Create new election
// @route   POST /api/v1/elections
// @access  Private/Admin
exports.createElection = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  const election = await Election.create(req.body);
  res.status(201).json({ success: true, data: election });
});

// @desc    Update election
// @route   PUT /api/v1/elections/:id
// @access  Private/Admin
exports.updateElection = asyncHandler(async (req, res, next) => {
  let election = await Election.findById(req.params.id);

  if (!election) {
    return next(
      new ErrorResponse(`Election not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is election creator or admin
  if (election.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update this election`, 401)
    );
  }

  election = await Election.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: election });
});

// @desc    Delete election
// @route   DELETE /api/v1/elections/:id
// @access  Private/Admin
exports.deleteElection = asyncHandler(async (req, res, next) => {
  const election = await Election.findById(req.params.id);

  if (!election) {
    return next(
      new ErrorResponse(`Election not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is election creator or admin
  if (election.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to delete this election`, 401)
    );
  }

  await election.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc    Toggle election active status
// @route   PUT /api/v1/elections/:id/status
// @access  Private/Admin
exports.toggleElectionStatus = asyncHandler(async (req, res, next) => {
  const election = await Election.findById(req.params.id);

  if (!election) {
    return next(
      new ErrorResponse(`Election not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is election creator or admin
  if (election.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update this election`, 401)
    );
  }

  election.isActive = !election.isActive;
  await election.save();

  res.status(200).json({ success: true, data: election });
});
