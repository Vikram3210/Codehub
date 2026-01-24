import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
    index: true
  },
  languageKey: {
    type: String,
    required: true,
    index: true
  },
  levelId: {
    type: String,
    required: true,
    index: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 2 && v.length <= 6;
      },
      message: 'Options must have between 2 and 6 items'
    }
  },
  correctAnswer: {
    type: String,
    required: true,
    trim: true
  },
  explanation: {
    type: String,
    default: ''
  },
  xpReward: {
    type: Number,
    default: 10
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
questionSchema.index({ lessonId: 1, order: 1 });
questionSchema.index({ languageKey: 1, levelId: 1 });

const Question = mongoose.model('Question', questionSchema);

export default Question;

