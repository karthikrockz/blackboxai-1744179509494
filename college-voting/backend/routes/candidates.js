const express = require('express');
const {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate
} = require('../controllers/candidateController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getCandidates)
  .post(protect, authorize('admin'), createCandidate);

router
  .route('/:id')
  .get(getCandidate)
  .put(protect, authorize('admin'), updateCandidate)
  .delete(protect, authorize('admin'), deleteCandidate);

module.exports = router;
