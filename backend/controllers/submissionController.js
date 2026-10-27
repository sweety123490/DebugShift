import mongoose from 'mongoose';
import Submission from '../models/Submission.js';
import Challenge from '../models/Challenge.js';
import { evaluateCodeSubmission } from '../services/evaluatorService.js';

// @desc    Evaluate submitted bug fix code and explanation with AI
// @route   POST /api/submissions/evaluate
// @access  Private
export const evaluateSubmission = async (req, res, next) => {
  try {
    const { challengeId, fixedCode, explanation } = req.body;
    const userId = req.user._id;

    // Fetch challenge including the private reference solution & evaluation rubric
    const challenge = await Challenge.findById(challengeId).select(
      '+referenceSolution +evaluationRubric +bugExplanation'
    );

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found.',
      });
    }

    // Run AI Evaluation via service
    const evaluation = await evaluateCodeSubmission({
      challenge,
      fixedCode,
      explanation,
    });

    // Save submission to database
    const submission = await Submission.create({
      user: userId,
      challenge: challenge._id,
      fixedCode,
      explanation,
      score: evaluation.score,
      scoresByCategory: evaluation.scoresByCategory,
      feedback: evaluation.feedback,
      suggestions: evaluation.suggestions,
      correctnessAnalysis: evaluation.correctnessAnalysis,
      expectedFixSnippet: evaluation.expectedFixSnippet,
      evaluationProvider: evaluation.evaluationProvider,
    });

    // Populate challenge details for the response
    const populatedSubmission = await Submission.findById(submission._id).populate(
      'challenge',
      'title slug category difficulty expectedBehavior'
    );

    res.status(201).json({
      success: true,
      message: 'Evaluation complete',
      submission: populatedSubmission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all submissions for the logged in user
// @route   GET /api/submissions/my
// @access  Private
export const getMySubmissions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [submissions, total] = await Promise.all([
      Submission.find({ user: userId })
        .populate('challenge', 'title slug category difficulty estimatedMinutes')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Submission.countDocuments({ user: userId }),
    ]);

    res.status(200).json({
      success: true,
      count: submissions.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      submissions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single submission report by ID (must belong to user)
// @route   GET /api/submissions/:id
// @access  Private
export const getSubmissionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission ID format.',
      });
    }

    const submission = await Submission.findById(id).populate(
      'challenge',
      'title slug category difficulty expectedBehavior brokenCode'
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found.',
      });
    }

    // Security check: ensure submission belongs to the requesting user
    if (submission.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You cannot view another user’s submission report.',
      });
    }

    res.status(200).json({
      success: true,
      submission,
    });
  } catch (error) {
    next(error);
  }
};
