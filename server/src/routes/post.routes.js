import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";

import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getUserPosts,
} from "../controller/post.controller.js";

const router = Router();

router.route("/").post(verifyJwt, createPost);
router.route("/").get(getPosts);
router.route("/:postId").put(verifyJwt, updatePost);
router.route("/:postId").delete(verifyJwt, deletePost);
router.route("/:username/posts").get(getUserPosts);

export default router;
