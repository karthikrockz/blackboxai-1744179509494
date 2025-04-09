const express = require('express');
const {
  getElections,
  getElection,
  createElection,
  updateElection,
  deleteElection,
  toggleElectionStatus
} = require('../controllers/electionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getElections)
  .post(protect, authorize('admin'), createElection);

router
  .route('/:id')
  .get(getElection)
  .put(protect, authorize('admin'), updateElection)
  .delete(protect, authorize('admin'), deleteElection);

router
  .route('/:id/status')
  .put(protect, authorize('admin'), toggleElectionStatus);

module.exports = router;
