import mongoose from 'mongoose';

const { Schema } = mongoose;

// QuizScore model - per user, per lesson
const quizScoreSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
    index: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 1,
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  collection: 'quizscores',
});

quizScoreSchema.index({ userId: 1, lessonId: 1, date: -1 });

const QuizScore = mongoose.model('QuizScore', quizScoreSchema);

export default QuizScore;

