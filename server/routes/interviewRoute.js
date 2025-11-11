const express = require('express');
const router = express.Router();
const interviewController = require('../controller/interviewController');

router.post('/answer', interviewController.handleAnswer);
router.get('/status', interviewController.getStatus);

module.exports = router;
