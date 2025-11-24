const express = require('express');
const { convertScore } = require('../services/convertService');
const { addRecentCheck } = require('../services/recentChecksService');
const { validateConvertRequest } = require('../middlewares/validation');

const router = express.Router();

router.post('/', validateConvertRequest, async (req, res) => {
  try {
    const { score, fromCountry, toCountry, user } = req.body;
    const convertedScore = convertScore(score, fromCountry, toCountry);
    const check = {
      convertedScore,
      fromCountry,
      toCountry,
      timestamp: new Date().toISOString(),
      user: user || 'Anonymous',
      score
    };
    addRecentCheck(check);
    res.json(check);
  } catch (error) {
    console.error('Error in convert:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;