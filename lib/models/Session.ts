import mongoose, { Schema, Model, Types } from 'mongoose';

export interface ISession {
    userId: Types.ObjectId;
    entryText: string;
    initialStressScore?: number; // 1-10, hidden or calculated
    sentimentData?: {
        score: number;
        keywords: string[];
        analysis: string;
    };
    status: 'LOCKED' | 'IN_PROGRESS' | 'UNLOCKED';
    tasksCompleted: {
        taskId: Types.ObjectId;
        timeSpent: number;
        completedAt: Date;
    }[];
    postTaskAssessment?: {
        stress: number;
        tension: number;
        energy: number;
    };
    finalStressScore?: number;
    createdAt: Date;
    updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        entryText: { type: String, required: true },
        initialStressScore: { type: Number },
        sentimentData: {
            score: Number,
            keywords: [String],
            analysis: String,
        },
        status: {
            type: String,
            enum: ['LOCKED', 'IN_PROGRESS', 'UNLOCKED'],
            default: 'LOCKED',
        },
        tasksCompleted: [
            {
                taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
                timeSpent: Number,
                completedAt: { type: Date, default: Date.now },
            },
        ],
        postTaskAssessment: {
            stress: Number,
            tension: Number,
            energy: Number,
        },
        finalStressScore: { type: Number },
    },
    { timestamps: true }
);

const Session: Model<ISession> =
    mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);

export default Session;
