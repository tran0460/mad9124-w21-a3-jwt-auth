import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    username: { type: String, required: true, maxlength: 64 },
    ipAddress: { type: String, required: true, maxlength: 64 },
    didSucceed: { type: Boolean, required: true},
    CreatedAt: { type: Date, required: true},
});
const Model = mongoose.model("AuthenticationAttempts", schema);

export default Model;