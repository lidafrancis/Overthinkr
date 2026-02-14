import mongoose, { Schema, Model, Types } from 'mongoose';

export interface IGemTransaction {
    userId: Types.ObjectId;
    amount: number;
    type: 'EARN' | 'SPEND';
    description: string;
    relatedEntityId?: Types.ObjectId; // e.g., Task ID or Feature ID
    relatedEntityType?: 'TASK' | 'UNLOCK' | 'BONUS';
    createdAt: Date;
}

const GemTransactionSchema = new Schema<IGemTransaction>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number, required: true },
        type: { type: String, enum: ['EARN', 'SPEND'], required: true },
        description: { type: String, required: true },
        relatedEntityId: { type: Schema.Types.ObjectId },
        relatedEntityType: { type: String, enum: ['TASK', 'UNLOCK', 'BONUS'] },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const GemTransaction: Model<IGemTransaction> =
    mongoose.models.GemTransaction ||
    mongoose.model<IGemTransaction>('GemTransaction', GemTransactionSchema);

export default GemTransaction;
