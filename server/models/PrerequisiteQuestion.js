import mongoose from 'mongoose';

const { Schema } = mongoose;

// PrerequisiteQuestion model (per lesson & language)
const prerequisiteQuestionSchema = new Schema({
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
    index: true,
  },
  // Some datasets store language as a display name (e.g. "Java")
  // We keep both language + languageKey for compatibility.
  language: {
    type: String,
    trim: true,
  },
  languageKey: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  // Some datasets scope prerequisites by levelNumber
  levelNumber: {
    type: Number,
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
  // Store the correct answer value (string) for consistency with quiz questions
  correctAnswer: {
    type: String,
    required: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  collection: 'Prerequisite_questions',
});

prerequisiteQuestionSchema.index({ lessonId: 1, languageKey: 1 });

const PrerequisiteQuestion = mongoose.model('PrerequisiteQuestion', prerequisiteQuestionSchema);

export default PrerequisiteQuestion;
