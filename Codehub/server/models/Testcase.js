import mongoose from 'mongoose';

const { Schema } = mongoose;

const testcaseSchema = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
      index: true,
    },
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'codingtestcases',
  },
);

const Testcase = mongoose.model('Testcase', testcaseSchema);

export default Testcase;
