import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
      index: true,
    },
    fixedCode: {
      type: String,
      required: [true, 'Fixed code is required'],
    },
    explanation: {
      type: String,
      required: [true, 'Root cause explanation is required'],
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    scoresByCategory: {
      codeCorrectness: {
        type: Number,
        min: 0,
        max: 50,
        default: 0,
      },
      rootCauseUnderstanding: {
        type: Number,
        min: 0,
        max: 30,
        default: 0,
      },
      codeQuality: {
        type: Number,
        min: 0,
        max: 20,
        default: 0,
      },
    },
    feedback: {
      type: String,
      required: true,
    },
    suggestions: [
      {
        type: String,
      },
    ],
    correctnessAnalysis: {
      type: String,
      default: '',
    },
    expectedFixSnippet: {
      type: String,
      default: '',
    },
    evaluationProvider: {
      type: String,
      default: 'mock-evaluator',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Submission', submissionSchema);
