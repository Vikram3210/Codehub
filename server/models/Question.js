import mongoose from 'mongoose';

const { Schema } = mongoose;

// QuizQuestion model (per lesson)
const quizQuestionSchema = new Schema({
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
    index: true,
  },
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
  // Store the correct answer value (string) for flexibility
  correctAnswer: {
    type: String,
    required: true,
    trim: true,
  },
  explanation: {
    type: String,
    default: '',
  },
  points: {
    type: Number,
    default: 10,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  collection: 'quizquestions',
});

// Efficient per-lesson ordering
quizQuestionSchema.index({ lessonId: 1, order: 1 });

const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);

// Exported as default so existing imports (`Question`) still work
export default QuizQuestion;

