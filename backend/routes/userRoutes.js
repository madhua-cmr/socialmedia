import express from "express";
import {
  followUnfollowUser,
  freezeAccount,
  getSuggestedUser,
  getUserPosts,
  getUserProfile,
  loginUser,
  logoutUser,
  signup,
  updateUser,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", loginUser);
router.get("/suggested", protectRoute, getSuggestedUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update/:id", protectRoute, updateUser);
router.get("/profile/:query", getUserProfile);
router.put("/update/:id", protectRoute, updateUser);
router.get("/posts/:id", protectRoute, getUserPosts);
router.put("/freeze/account", protectRoute, freezeAccount);

export default router;
