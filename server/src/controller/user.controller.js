import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "..//utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { Like } from "../models/like.model.js";

const getuser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  console.log(req.params);
  console.log(userId);
  const user = await User.findOne({ username: userId }).select(
    "-password -email"
  );
  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }
  console.log(user);
  return res.status(200).json(new ApiResponse(200, user, "User data fetched"));
});

const updateuser = asyncHandler(async (req, res) => {
  const userId = req.user.username;
  const updates = req.body;

  if (updates.username) {
    return res.ApiError(405, "Username cannot be changed");
  }
  console.log(req.body);

  console.log(userId);
  if (req.files?.profile) {
    // console.log(req.files.profile);
    const profileLocalPath = req.files?.profile[0].path;
    const profileImg = await uploadOnCloudinary(profileLocalPath);
    console.log(profileImg);
    updates.profileImg = profileImg.url;
  }

  console.log("updated", updates);
  const user = await User.findOneAndUpdate(
    { username: userId },
    { $set: updates },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile updated"));
});

const followuser = asyncHandler(async (req, res) => {
  const me = req.user;
  const userId = req.params.userId;

  const userToFollow = await User.findOne({ username: userId }).select(
    "-password -email"
  );
  //   console.log(userToFollow);
  if (!userToFollow) {
    throw new ApiError(404, "User not found");
  }
  if (!userToFollow.followers.includes(me._id)) {
    userToFollow.followers.push(me._id);
    await userToFollow.save();
  } else {
    userToFollow.followers = userToFollow.followers.filter(
      (fid) => !fid.equals(me._id)
    );
    await userToFollow.save();
  }

  console.log(me.following);

  if (!me.following.includes(userToFollow._id)) {
    me.following.push(userToFollow._id);
    await me.save();
  } else {
    me.following = me.following.filter((fid) => !fid.equals(me._id));
    await userToFollow.save();
  }

  res.status(200).json(new ApiResponse(200, me, "Followed user"));
});

const unfollowuser = asyncHandler(async (req, res) => {
  const me = req.user;
  const userId = req.params.userId;

  const userToUnFollow = await User.findOne({ username: userId }).select(
    "-password -email"
  );
  //   console.log(userToFollow);
  if (!userToUnFollow) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }
  userToUnFollow.followers = userToUnFollow.followers.filter(
    (fid) => !fid.equals(me._id)
  );

  await userToUnFollow.save();

  me.following = me.following.filter((fid) => !fid.equals(userToUnFollow._id));
  console.log(me);

  await me.save();

  res.status(200).json(new ApiResponse(200, me, "unfollowed user"));
});

const getActivity = asyncHandler(async (req, res) => {
  const followers = req.user.followers;
  const followersDetails = await User.find(
    {
      _id: { $in: followers },
    },
    "username profileImg"
  );

  const posts = await Post.find({ user: req.user._id });
  // console.log("posts are", posts);
  const likeDetails = [];
  for (const post of posts) {
    for (const like of post.likes) {
      console.log(like, post._id);
      const likee = await Like.findOne({ user: like, post: post._id })
        .populate("user", "username profileImg")
        .populate("post", "_id");
      likeDetails.push(likee);
    }
  }
  const likeDetailsSorted = likeDetails
    .map((like) => ({
      userId: like.user._id,
      username: like.user.username,
      profileImg: like.user.profileImg,
      postId: like.post._id,
      createdAt: like.createdAt,
    }))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return res
    .status(200)
    .json(
      new ApiResponse(200, { followersDetails, likeDetailsSorted }, "Activity")
    );
});

const searchUser = asyncHandler(async (req, res) => {
  const username = req.params.username;
  const result = await User.find(
    { username: { $regex: username, $options: "i" } },
    { username: 1, profileImg: 1 }
  );
  console.log(result);
  if (!result) {
    throw new ApiError(404, "user not found");
  }
  res.status(200).json(new ApiResponse(200, result, "user"));
});

export {
  getuser,
  updateuser,
  followuser,
  unfollowuser,
  getActivity,
  searchUser,
};
