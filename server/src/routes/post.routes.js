import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";

import {
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
} from "../controller/post.controller.js";

const router = Router();

router.route("/").post(verifyJwt, createPost);
router.route("/").get(getPosts);
router.route("/:postId").get(getPost);
router.route("/:postId").put(verifyJwt, updatePost);
router.route("/:postId").delete(verifyJwt, deletePost);
router.route("/:username/posts").get(getUserPosts);
router.route("/:postId/comments").post(verifyJwt, createComment);
router.route("/:postId/comments").get(getComments);
router.route("/:postId/likes").post(verifyJwt, likeUnlikePost);
router.route("/:postId/likes").get(getLikes);

export default router;
