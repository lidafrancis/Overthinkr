import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
    email: string;
    password_hash: string;
    name: string;
    gems: number;
    streak: number;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password_hash: { type: String, required: true },
        name: { type: String, required: true },
        gems: { type: Number, default: 0 },
        streak: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Prevent mongoose from creating the model multiple times
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
