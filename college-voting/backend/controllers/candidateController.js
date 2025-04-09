const Candidate = require('../models/Candidate');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all candidates
// @route   GET /api/v1/candidates
// @route   GET /api/v1/elections/:electionId/candidates
// @access  Public
exports.getCandidates = asyncHandler(async (req, res, next) => {
  if (req.params.electionId) {
    const candidates = await Candidate.find({ election: req.params.electionId })
      .populate('election', 'title');
    return res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single candidate
// @route   GET /api/v1/candidates/:id
// @access  Public
exports.getCandidate = asyncHandler(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id).populate('election', 'title');

  if (!candidate) {
    return next(
      new ErrorResponse(`Candidate not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: candidate });
});

// @desc    Create candidate
// @route   POST /api/v1/elections/:electionId/candidates
// @access  Private/Admin
exports.createCandidate = asyncHandler(async (req, res, next) => {
  req.body.election = req.params.electionId;
  
  const candidate = await Candidate.create(req.body);
  res.status(201).json({ success: true, data: candidate });
});

// @desc    Update candidate
// @route   PUT /api/v1/candidates/:id
// @access  Private/Admin
exports.updateCandidate = asyncHandler(async (req, res, next) => {
  let candidate = await Candidate.findById(req.params.id);

  if (!candidate) {
    return next(
      new ErrorResponse(`Candidate not found with id of ${req.params.id}`, 404)
    );
  }

  candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: candidate });
});

// @desc    Delete candidate
// @route   DELETE /api/v1/candidates/:id
// @access  Private/Admin
exports.deleteCandidate = asyncHandler(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id);

  if (!candidate) {
    return next(
      new ErrorResponse(`Candidate not found with id of ${req.params.id}`, 404)
    );
  }

  await candidate.remove();
  res.status(200).json({ success: true, data: {} });
});
