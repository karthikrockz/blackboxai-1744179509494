const express = require('express');
const {
  submitVote,
  getResults,
  hasVoted
} = require('../controllers/voteController');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router
  .route('/vote')
  .post(protect, submitVote);

router
  .route('/results')
  .get(getResults);

router
  .route('/hasVoted')
  .get(protect, hasVoted);

module.exports = router;
