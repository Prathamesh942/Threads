import { Router } from "express";
import {
  getuser,
  followuser,
  updateuser,
  unfollowuser,
  getActivity,
  searchUser,
} from "../controller/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/:userId").get(getuser);
router
  .route("/:userId")
  .put(
    verifyJwt,
    upload.fields([{ name: "profile", maxCount: 1 }]),
    updateuser
  );
router.route("/:userId/follow").post(verifyJwt, followuser);
router.route("/:userId/unfollow").post(verifyJwt, unfollowuser);
router.route("/:userId/activity").get(verifyJwt, getActivity);
router.route("/search/:username").get(searchUser);

export default router;
