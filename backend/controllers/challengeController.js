import mongoose from 'mongoose';
import Challenge from '../models/Challenge.js';

// @desc    Get all challenges with filtering, search, and pagination
// @route   GET /api/challenges
// @access  Public
export const getChallenges = async (req, res, next) => {
  try {
    const { category, difficulty, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    // Exclude referenceSolution and internal rubric
    const [challenges, total] = await Promise.all([
      Challenge.find(query)
        .select('-referenceSolution -evaluationRubric -bugExplanation')
        .sort({ difficulty: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Challenge.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: challenges.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      challenges,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single challenge by ID or slug
// @route   GET /api/challenges/:id
// @access  Public
export const getChallengeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let challenge;
    if (mongoose.Types.ObjectId.isValid(id)) {
      challenge = await Challenge.findById(id).select('-referenceSolution -evaluationRubric -bugExplanation');
    } else {
      challenge = await Challenge.findOne({ slug: id }).select('-referenceSolution -evaluationRubric -bugExplanation');
    }

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found.',
      });
    }

    res.status(200).json({
      success: true,
      challenge,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get hints for a challenge
// @route   GET /api/challenges/:id/hint
// @access  Public
export const getChallengeHint = async (req, res, next) => {
  try {
    const { id } = req.params;

    let challenge;
    if (mongoose.Types.ObjectId.isValid(id)) {
      challenge = await Challenge.findById(id).select('hints title');
    } else {
      challenge = await Challenge.findOne({ slug: id }).select('hints title');
    }

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found.',
      });
    }

    res.status(200).json({
      success: true,
      challengeId: challenge._id,
      hints: challenge.hints || [],
    });
  } catch (error) {
    next(error);
  }
};
