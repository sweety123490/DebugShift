import mongoose from 'mongoose';

export const validateEvaluationInput = (req, res, next) => {
  const { challengeId, fixedCode, explanation } = req.body;

  if (!challengeId) {
    return res.status(400).json({
      success: false,
      message: 'Challenge ID is required for evaluation.',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(challengeId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Challenge ID format.',
    });
  }

  if (!fixedCode || typeof fixedCode !== 'string' || fixedCode.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide your corrected code.',
    });
  }

  if (!explanation || typeof explanation !== 'string' || explanation.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an explanation of the root cause and your fix.',
    });
  }

  if (explanation.trim().length < 15) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a more descriptive root cause explanation (at least 15 characters).',
    });
  }

  next();
};
