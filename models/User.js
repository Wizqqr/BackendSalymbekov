import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        avatarUrl: {
            type: String,
            default: '/noavatar.png',
        },
        viewedPosts: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Post',
            default: [], 
        },
        role: {
            type: String,
            enum: ['student', 'teacher', 'administration', 'superuser'], 
            default: 'student', 
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('User', UserSchema);
