const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { uploadMiddleware, uploadResume, analyzeResume, getResumes } = require('../controllers/resumeController');

// All resume routes are protected
router.use(auth);

router.get('/', getResumes);

// Handle multer errors specifically
router.post('/upload', (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, uploadResume);

router.post('/analyze', analyzeResume);

module.exports = router;
