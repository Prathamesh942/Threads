import { Router } from "express";
import {
  getuser,
  followuser,
  updateuser,
  unfollowuser,
} from "../controller/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:userId").get(verifyJwt, getuser);
router.route("/:userId").put(verifyJwt, updateuser);
router.route("/:userId/follow").post(verifyJwt, followuser);
router.route("/:userId/unfollow").post(verifyJwt, unfollowuser);

export default router;
