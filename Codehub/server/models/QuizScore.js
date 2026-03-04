import mongoose from 'mongoose';

const { Schema } = mongoose;

// QuizScore model - per user, per game (battle quiz)
const quizScoreSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    domain: {
      type: String,
      default: 'Mixed',
      index: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'quizscores',
  }
);

const QuizScore = mongoose.model('QuizScore', quizScoreSchema);

export default QuizScore;

