import mongoose from 'mongoose';

const { Schema } = mongoose;

// Quiz Battle Questions model - matches IIT project questions format
const quizBattleQuestionSchema = new Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator(v) {
        return v.length >= 2 && v.length <= 6;
      },
      message: 'Options must have between 2 and 6 items',
    },
  },
  answer: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  domain: {
    type: String,
    enum: ['Verbal', 'Quant', 'Logical', 'Mixed'],
    default: 'Mixed',
    index: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'easy', 'medium', 'hard'],
    index: true,
  },
}, {
  timestamps: true,
  collection: 'questions',
});

// Indexes for efficient querying
quizBattleQuestionSchema.index({ domain: 1, difficulty: 1 });
quizBattleQuestionSchema.index({ difficulty: 1 });

const QuizBattleQuestion = mongoose.model('QuizBattleQuestion', quizBattleQuestionSchema);

export default QuizBattleQuestion;
