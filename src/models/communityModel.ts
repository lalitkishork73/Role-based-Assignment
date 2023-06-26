import mongoose, { Document, Schema } from 'mongoose';

export interface Community {
    name: string;
    slug: string;
    owner: string;
}

export interface CommunityModel extends Community, Document {}

const CommunityModelSchema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        owner: { type: Schema.Types.ObjectId, required: true, ref: 'user' }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }  }
);

export default mongoose.model<CommunityModel>('Community', CommunityModelSchema);
