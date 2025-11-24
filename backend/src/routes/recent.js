const express = require('express');
const { getRecentChecks } = require('../services/recentChecksService');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const recent = getRecentChecks();
    res.json(recent);
  } catch (error) {
    console.error('Error in recent:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;