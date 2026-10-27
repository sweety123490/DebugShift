import Challenge from '../models/Challenge.js';
import Submission from '../models/Submission.js';

// @desc    Get user dashboard stats & progress metrics
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Run parallel metrics queries
    const [totalChallenges, userSubmissions, challengesList] = await Promise.all([
      Challenge.countDocuments(),
      Submission.find({ user: userId })
        .populate('challenge', 'title slug category difficulty')
        .sort({ createdAt: -1 }),
      Challenge.find().select('category difficulty'),
    ]);

    // Unique challenges completed (where user has at least one submission)
    const completedChallengeIds = new Set(
      userSubmissions.map((sub) => sub.challenge?._id?.toString()).filter(Boolean)
    );
    const challengesCompleted = completedChallengeIds.size;

    // Average AI score across submissions
    const totalScore = userSubmissions.reduce((acc, sub) => acc + (sub.score || 0), 0);
    const averageScore = userSubmissions.length > 0 ? Math.round(totalScore / userSubmissions.length) : 0;

    // Recent 5 submissions
    const recentSubmissions = userSubmissions.slice(0, 5);

    // Category breakdown
    const categoryCounts = {};
    challengesList.forEach((c) => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    const categoryProgress = {};
    userSubmissions.forEach((sub) => {
      if (sub.challenge && sub.challenge.category) {
        const cat = sub.challenge.category;
        categoryProgress[cat] = (categoryProgress[cat] || 0) + 1;
      }
    });

    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
      stats: {
        totalChallenges,
        challengesCompleted,
        completionRate: totalChallenges > 0 ? Math.round((challengesCompleted / totalChallenges) * 100) : 0,
        averageScore,
        totalSubmissionsCount: userSubmissions.length,
      },
      recentSubmissions,
      categoryCounts,
      categoryProgress,
    });
  } catch (error) {
    next(error);
  }
};
