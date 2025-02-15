import { Posts } from "../models/post.Model.js";
import { Users } from "../models/user.Model.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
export const createPost = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    let { img } = req.body;

    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: "PostedBy and text fields are required" });
    }
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }
    const user = await Users.findById(postedBy);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to create post " });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be ${maxLength} characters or fewer` });
    }

    if (img) {
      const uploadedresponse = await cloudinary.uploader.upload(img);
      img = uploadedresponse.secure_url;
    }

    const newPost = new Posts({ postedBy, text, img });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log("Error in create post controller", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    console.log(req.params.id);
    const post = await Posts.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(4001).json({ error: "Unauthorized to delete post" });
    }
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Posts.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const userlikedpost = post.likes.includes(userId);
    if (userlikedpost) {
      await Posts.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post Liked successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: pid } = req.params;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      return res.status(404).json({ error: "Text required" });
    }
    const post = await Posts.findById(pid);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const reply = { userId, text, userProfilePic, username };
    post.replies.push(reply);
    await post.save();
    return res.status(200).json( reply);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFeedPosts = async (req, res) => {
  const userId = req.user._id;
  try {

    if (!userId) {
      return res.status(400).json({ error: "User ID is missing" });
    }
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found in " });
    }
    const following = (user.following || []).filter(id =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (following.length === 0) {
      return res.status(200).json([]); // Return an empty feed
    }

    const feedPosts = await Posts.find({
      postedBy: { $in: following }
    }).populate("postedBy","-password -createdAt").sort({ createdAt: -1 });
    return res.status(200).json(feedPosts);
  } catch (error) {
    console.error("Error in getFeedPosts:", error.message);

    return res.status(500).json({ error: error.message });
  }
};
