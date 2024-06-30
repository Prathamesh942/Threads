import Router from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();
import {
  updateComment,
  deleteComment,
} from "../controller/comment.controller.js";

router.route("/:commentId").put(verifyJwt, updateComment);
router.route("/:commentId/").delete(verifyJwt, deleteComment);

export default router;
