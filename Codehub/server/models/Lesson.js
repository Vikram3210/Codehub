import mongoose from 'mongoose';

// MCQ Schema (embedded in lesson)
const mcqSchema = new mongoose.Schema({
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
    answer: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                return v >= 0 && v < this.options.length;
            },
            message: 'Answer must be a valid option index'
        }
    },
    explanations: {
        type: [String],
        default: []
    }
}, { _id: false });

const lessonSchema = new mongoose.Schema({
    languageKey: {
        type: String,
        required: true,
        index: true
    },
    levelNumber: {
        type: Number,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    lessonTitle: {
        type: String,
        required: true,
        trim: true
    },
    theory: {
        type: String,
        required: true
    },
    mcqs: {
        type: [mcqSchema],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
lessonSchema.index({ languageKey: 1, levelNumber: 1 }, { unique: true });

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;