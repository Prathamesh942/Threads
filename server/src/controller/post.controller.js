import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

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

const createComment = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const content = req.body.content;
  const comment = await Comment.create({
    user: req.user._id,
    post: postId,
    content,
  });

  if (!comment) {
    return new ApiError(401, "comment failed");
  }

  console.log(comment);

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  post.comments.push(comment._id);

  await post.save();

  return res.status(200).json(new ApiResponse(200, post, "Commented"));
});

const getComments = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const comments = await Comment.find({ post: postId })
    .populate("user", "username profileImg")
    .sort({ createdAt: -1 });

  if (!comments) {
    throw new ApiError(404, "Comments not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched"));
});

const likeUnlikePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const me = req.user;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.likes.includes(me._id)) {
    post.likes = post.likes.filter((id) => id.toString() !== me._id.toString());
    await post.save();
  } else {
    post.likes.push(me._id);
    await post.save();
  }

  return res.status(200).json(new ApiResponse(200, post, "post liked"));
});

const getLikes = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  const likesCount = post.likes.length;

  return res.status(200).json(new ApiResponse(200, likesCount, "likes count"));
});

const getPost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId).populate(
    "user",
    "username profileImg"
  );
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  return res.status(200).json(new ApiResponse(200, post, "post"));
});

export {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getUserPosts,
  createComment,
  getComments,
  likeUnlikePost,
  getLikes,
  getPost,
};
