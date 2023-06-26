import mongoose, { Document, Schema } from 'mongoose';

export interface Member {
    community: string;
    user: string;
    role: string;
}

export interface MemberModel extends Member, Document {}

const MemberModelSchema = new Schema(
    {
        community: { type: Schema.Types.ObjectId, required: true, ref: 'Community' },
        user: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
        role: { type: Schema.Types.ObjectId, required: true, ref: 'role' }
    },
    {timestamps: { createdAt: 'created_at'} }
);

export default mongoose.model<MemberModel>('member', MemberModelSchema);
