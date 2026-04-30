import mongoose from 'mongoose';

const { Schema } = mongoose;

const submissionSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    problemId: { type: String, required: true, index: true },
    code: { type: String, required: true },
    language: {
      type: String,
      required: true,
      enum: ['javascript', 'python', 'java', 'cpp'],
    },
    verdict: {
      type: String,
      required: true,
      enum: ['ACCEPTED', 'WRONG_ANSWER', 'TLE', 'RUNTIME_ERROR'],
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    collection: 'codingsubmissions',
  },
);

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
