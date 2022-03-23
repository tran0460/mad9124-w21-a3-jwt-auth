import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    firstName: { type: String, trim: true, maxlength: 64, required: true },
    lastName: { type: String, trim: true, maxlength: 64 },
    email: {
        type: String,
        trim: true,
        maxlength: 512,
        required: true,
        unique: true,
    },
    password: { type: String, trim: true, maxlength: 70, required: true },
    isAdmin: { type: Boolean, trim: true, maxlength: 70, required: true, default: false},
})