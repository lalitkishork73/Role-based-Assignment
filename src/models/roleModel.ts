import mongoose, { Document, Schema } from 'mongoose';

export interface Role {
    name: string;
}

export interface RoleModel extends Role, Document {}

const RoleModelSchema = new Schema(
    {
        name: { type: String, required: true ,unique: true },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model<RoleModel>('role', RoleModelSchema);
