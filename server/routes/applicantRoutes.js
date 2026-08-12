const express = require('express');
const {
  addApplicant,
  getApplicants,
  getApplicantById,
  updateApplicantStatus,
  updateApplicant,
  deleteApplicant,
  exportApplicantsCSV,
} = require('../controllers/applicantController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Export CSV endpoint (must come before /:id)
router.get('/export/csv', protect, exportApplicantsCSV);

router.route('/')
  .get(protect, getApplicants)
  .post(upload.single('resume'), addApplicant);

router.patch('/:id/status', protect, updateApplicantStatus);

router.route('/:id')
  .get(protect, getApplicantById)
  .put(protect, updateApplicant)
  .delete(protect, deleteApplicant);

module.exports = router;
