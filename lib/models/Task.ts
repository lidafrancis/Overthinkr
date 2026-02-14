import mongoose, { Schema, Model } from 'mongoose';

export interface ITask {
    title: string;
    description: string;
    type: 'breathing' | 'movement' | 'reflection' | 'game' | 'colorMatch' | 'other';
    duration: number; // in seconds
    gemReward: number;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        type: {
            type: String,
            enum: ['breathing', 'movement', 'reflection', 'game', 'colorMatch', 'other'],
            required: true,
        },
        duration: { type: Number, required: true },
        gemReward: { type: Number, required: true },
    },
    { timestamps: true }
);

const Task: Model<ITask> =
    mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;