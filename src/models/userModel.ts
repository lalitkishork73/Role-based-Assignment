import mongoose, { Document, Schema } from 'mongoose';

export interface User {
    name: string;
    email: string;
    password: string;
}

export interface UserModel extends User, Document {}

const UserModelSchema = new Schema(
    {
        name: { type: String, trim: true, required: true },
        email: { type: String, trim: true, unique: true, required: true },
        password: { type: String, trim: true, required: true }
    },
    { timestamps: { createdAt: 'created_at'}  }
);

export default mongoose.model<UserModel>('user', UserModelSchema);
