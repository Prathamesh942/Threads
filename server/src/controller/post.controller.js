import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const createPost = asyncHandler(async (req, res) => {
  const me = req.user;
  const { content } = req.body;

  const post = await Post.create({
    user: me._id,
    content,
  });

  if (!post) {
    throw new ApiError(500, "Something went wrong try again");
  }
  console.log(post);

  return res.status(200).json(new ApiResponse(200, post, "Post created"));
});

const getPosts = asyncHandler(async (req, res) => {
  const { tags, page = 1, limit = 10 } = req.query;
  let query = {};
  if (tags) {
    query.tags = { $in: tags.split(",") };
  }

  const skip = (page - 1) * limit;

  const posts = await Post.find(query)
    .populate("user", "username profileImg")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit, 10));

  const totalPosts = await Post.countDocuments(query);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        posts,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: parseInt(page, 10),
      },
      "Post fetched"
    )
  );
});

const updatePost = asyncHandler(async (req, res) => {
  const me = req.user;
  const postId = req.params.postId;
  const updates = req.body;
  const post = await Post.findById(postId);
  console.log(me, post.user);
  if (!me._id.equals(post.user)) {
    throw new ApiError(401, "unauthorized");
  }
  post.content = updates.content;
  post.save();
  res.status(200).json(new ApiResponse(200, post, "Post updated"));
});

const deletePost = asyncHandler(async (req, res) => {
  const me = req.user;
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  // console.log(me, post.user);
  if (!me._id.equals(post.user)) {
    throw new ApiError(401, "unauthorized");
  }
  console.log(post);
  await post.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Post deleted"));
});

const getUserPosts = asyncHandler(async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const posts = await Post.find({ user: user._id })
    .populate("user", "username profileImg")
    .sort({ createdAt: -1 });

  if (!posts) {
    throw new ApiError(404, "Posts not found for this user");
  }

  return res.status(200).json(new ApiResponse(200, posts, "Posts fetched"));
});
export { createPost, getPosts, updatePost, deletePost, getUserPosts };
