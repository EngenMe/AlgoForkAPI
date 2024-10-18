import { model, Schema, Document } from 'mongoose';
import { Problem } from '@interfaces/problems.interface';

const problemSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  inputFormat: {
    type: String,
    required: true,
  },
  outputFormat: {
    type: String,
    required: true,
  },
  examples: [
    {
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
      _id: false,
    },
  ],
  constraints: {
    type: String,
    required: true,
  },
  solution: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const problemModel = model<Problem & Document>('Problem', problemSchema);

export default problemModel;
