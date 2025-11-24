const express = require('express');
const convertRoutes = require('./convert');
const recentRoutes = require('./recent');

const router = express.Router();

router.use('/convert', convertRoutes);
router.use('/recent', recentRoutes);

module.exports = router;