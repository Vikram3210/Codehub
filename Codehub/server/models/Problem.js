import mongoose from 'mongoose';

const { Schema } = mongoose;

const problemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    inputFormat: { type: String, default: '' },
    outputFormat: { type: String, default: '' },
    constraints: { type: String, default: '' },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    examples: [
      {
        input: { type: String, default: '' },
        output: { type: String, default: '' },
      },
    ],
    starterCode: {
      javascript: { type: String, default: '' },
      python: { type: String, default: '' },
      java: { type: String, default: '' },
      cpp: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
    collection: 'codingproblems',
  },
);

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
