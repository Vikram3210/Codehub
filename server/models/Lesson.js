import mongoose from 'mongoose';

const { Schema } = mongoose;

// Optional embedded MCQ schema kept for backward compatibility with older content
const mcqSchema = new Schema({
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
    validate: {
      validator(v) {
        return v >= 0 && v < this.options.length;
      },
      message: 'Answer must be a valid option index',
    },
  },
  explanations: {
    type: [String],
    default: [],
  },
}, { _id: false });

// Lesson (Level) model
// Each lesson belongs to a Language via languageId
const lessonSchema = new Schema({
  // New, canonical reference to Language
  languageId: {
    type: Schema.Types.ObjectId,
    ref: 'Language',
    required: false, // Not required to handle existing documents
    index: true,
  },

  // Backward-compatible key field (optional)
  languageKey: {
    type: String,
    lowercase: true,
    trim: true,
    index: true,
  },

  // Legacy levelId field (e.g., "java_00_intro") for backward compatibility
  levelId: {
    type: String,
    trim: true,
    index: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    default: '',
    trim: true,
  },

  // Sequential level number within a language (0-based for intro levels)
  levelNumber: {
    type: Number,
    required: true,
    index: true,
    min: 0, // Allow 0 for intro/background lessons (e.g., java_00_intro)
  },

  difficulty: {
    type: String,
    enum: ['easy', 'intermediate', 'advanced'],
    default: 'easy',
  },

  order: {
    type: Number,
    default: 0,
  },

  // Additional content fields used by the app
  lessonTitle: {
    type: String,
    trim: true,
  },

  theory: {
    type: String,
  },

  mcqs: {
    type: [mcqSchema],
    default: [],
  },

  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Efficient lookup of a lesson within a language
lessonSchema.index({ languageId: 1, levelNumber: 1 }, { unique: true });

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;