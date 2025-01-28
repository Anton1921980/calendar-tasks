import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  text: string;
  date: string;
  order: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// indexes for quick searching
TaskSchema.index({ userId: 1, date: 1 });
TaskSchema.index({ order: 1 });

export default mongoose.model<ITask>('Task', TaskSchema);