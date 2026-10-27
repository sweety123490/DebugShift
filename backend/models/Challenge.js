import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Challenge title is required'],
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: [true, 'Challenge slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Challenge category is required'],
      enum: [
        'React Hooks',
        'JavaScript Async/Await',
        'Express Middleware',
        'API Error Handling',
        'Memory Leaks',
        'State Management',
      ],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    description: {
      type: String,
      required: [true, 'Problem description is required'],
    },
    language: {
      type: String,
      default: 'javascript',
    },
    brokenCode: {
      type: String,
      required: [true, 'Broken code snippet is required'],
    },
    referenceSolution: {
      type: String,
      required: [true, 'Reference solution is required'],
      select: false, // Ensure reference solution is NEVER leaked in public queries!
    },
    expectedBehavior: {
      type: String,
      required: [true, 'Expected behavior is required'],
    },
    bugExplanation: {
      type: String,
      required: [true, 'Bug explanation is required'],
      select: false, // Keep hidden until after evaluation or submission
    },
    hints: [
      {
        type: String,
      },
    ],
    evaluationRubric: {
      keyIssuesToFix: [String],
      mustIncludeConcepts: [String],
      commonMistakes: [String],
    },
    estimatedMinutes: {
      type: Number,
      default: 15,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    language_override: 'none',
  }
);

// Indexes for fast category/difficulty filtering & searching
challengeSchema.index({ category: 1, difficulty: 1 });
challengeSchema.index(
  { title: 'text', description: 'text' },
  { default_language: 'english', language_override: 'none' }
);

export default mongoose.model('Challenge', challengeSchema);
