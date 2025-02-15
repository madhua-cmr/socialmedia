import express from "express";
import protectRoute  from "../middlewares/protectRoute.js";
import {
  createPost,
  deletePost,
  getFeedPosts,
  getPost,
  likeUnlikePost,
  replyToPost,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/create", protectRoute, createPost);
router.get("/:id", getPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);
router.get("/get/feed", protectRoute, getFeedPosts);

export default router