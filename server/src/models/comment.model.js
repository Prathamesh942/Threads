import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      requied: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      requied: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
