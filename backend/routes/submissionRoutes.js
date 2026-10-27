import express from 'express';
import {
  evaluateSubmission,
  getMySubmissions,
  getSubmissionById,
} from '../controllers/submissionController.js';
import { protect } from '../middleware/auth.js';
import { validateEvaluationInput } from '../validators/submissionValidator.js';

const router = express.Router();

// All submission routes require authentication
router.use(protect);

router.post('/evaluate', validateEvaluationInput, evaluateSubmission);
router.get('/my', getMySubmissions);
router.get('/:id', getSubmissionById);

export default router;
