import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../controller/auth.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/register")
  .post(upload.fields([{ name: "profile", maxCount: 1 }]), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/checkauth").get(verifyJwt, (req, res) => {
  res.status(200).json({ loggedIn: true });
});

export default router;
