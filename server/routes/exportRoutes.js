const express = require('express');
const auth = require('../middleware/auth');
const { exportCSV } = require('../controllers/exportController');

const router = express.Router();

// All export routes require authentication
router.use(auth);

// @route   GET /api/export/csv
router.get('/csv', exportCSV);

module.exports = router;
