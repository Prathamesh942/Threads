import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const updateComment = asyncHandler(async (req, res) => {
  const me = req.user;
  const commentId = req.params.commentId;
  const content = req.body.content;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "comment not found");
  }

  console.log(comment);

  console.log(comment.user, me._id);
  if (!comment.user.equals(me._id)) {
    throw new ApiError(401, "Unauthorized");
  }

  comment.content = content;
  await comment.save();

  return res.status(200).json(new ApiResponse(200, comment, "comment updated"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "comment not found");
  }

  await comment.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, "comment deleted"));
});

export { updateComment, deleteComment };
