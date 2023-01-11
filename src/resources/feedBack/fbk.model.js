import mongoose from "mongoose";

const feedBackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    email: {
      type: String,
      required: false,
      trim: true,
      maxlength: 50
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'complete', 'pastdue'],
      default: 'active'
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    },
  },
  { timestamps: true }
);

feedBackSchema.index({ title: 1, createdBy: 1 }, { unique: true });

export const FeedBack = mongoose.model('feedBack', feedBackSchema);


