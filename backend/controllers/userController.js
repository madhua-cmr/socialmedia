import bcrypt from "bcryptjs";
import { Users } from "../models/user.Model.js";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose"
import { Posts } from "../models/post.Model.js";
export const signup = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    const exiuser = await Users.findOne({ $or: [{ email }, { username }] });
    console.log(exiuser);
    if (exiuser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newuser = new Users({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await newuser.save();

    if (newuser) {
      generateTokenAndSetCookie(newuser._id, res);
      res.status(201).json({
        _id: newuser._id,
        name: newuser.name,
        email: newuser.email,
        username: newuser.username,
        bio: newuser.bio,
        profilePic: newuser.profilePic,
      });
    } else {
      res.status(400).json({
        error: "Invalid user data",
      });
    }
  } catch (error) {
    console.log("Error in signup controller");
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const exisuser = await Users.findOne({ username });

    if (!username || !password) {
      return res.json({ error: "All fields are required" });
    }
    const ispasswordcorrect = await bcrypt.compare(
      password,
      exisuser?.password || ""
    );

    if (!exisuser || !ispasswordcorrect)
      return res.json({ error: "Invalid username or password" });

    if(exisuser.freeze){
      exisuser.freeze=false;
    }
    generateTokenAndSetCookie(exisuser._id, res);
    console.log("hi");
    res.status(200).json({
      _id: exisuser._id,
      name: exisuser.name,
      email: exisuser.email,
      username: exisuser.username,
      bio: exisuser.bio,
      profilePic: exisuser.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in login User controller");
  }
};


export const getSuggestedUser=async(req,res)=>{
  try {
    const userId=req.user._id;
    const usersFollowedByMe=await Users.findById(userId).select("following");

    const users=await Users.aggregate([
      {
        $match:{
          _id:{$ne:userId},
        }
      },{
          $sample:{size:10},
      }
    ])
    const filteredUsers=users.filter((user)=>!usersFollowedByMe.following.includes(user._id));
    const suggestedUsers=filteredUsers.slice(0,4);
    suggestedUsers.forEach((user)=>(user.password=null));

    res.status(200).json(suggestedUsers);

  } catch (error) {
    res.status(500).json({error:error.message})
  }
}
export const logoutUser = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.status(200).json({ message: "User logged out Succesfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await Users.findById(id);
    const currentuser = await Users.findById(req.user._id);

    if (id === req.user._id.toString())
      return res
        .status(400)
        .json({ error: "You cannot follow or unfollow yourself" });
    if (!userToModify || !currentuser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentuser.following.includes(id);

    if (isFollowing) {
      await Users.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await Users.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      await Users.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await Users.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in followUnfollow controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  
  const { name, email, username, password, bio } = req.body;

  let { profilePic } = req.body;

  const userId = req.user._id;

  try {
    let existuser = await Users.findById(userId);
    if (!existuser) return res.status(400).json({ error: "user not found" });
    if (req.params.id !== userId.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot update others profile" });
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      existuser.password = hashedPassword;
    }

    if (profilePic) {
      if (existuser.profilePic) {
        await cloudinary.uploader.destroy(
          existuser.profilePic.split("/").pop().split(".")[0]
        );
      }
      const uploadedresponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedresponse.secure_url;
    }
    existuser.name = name || existuser.name;
    existuser.email = email || existuser.email;
    existuser.username = username || existuser.username;
    existuser.bio = bio || existuser.bio;
    existuser.profilePic = profilePic || existuser.profilePic;

    const user = await existuser.save();
    await Posts.updateMany({"replies.userId":userId},
      {
        $set:{
          "replies.$[reply].username":user.username,
          "replies.$[reply].userProfilePic":user.profilePic
        }
      },
      {
        arrayFilters:[{"reply.userId":userId}]
      }
    )
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.log("Error in updateUser", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  const { query } = req.params;
 
  try {
    
    let user;
    //query userid
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await Users.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
       user = await Users.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
        
    }
    
    if (!user) return res.status(400).json({ error: "User not found" });
    return res.status(201).json(user);
  } catch (error) {
    console.log("Error in getUserProfile:", error.message);
    return res.status(500).json({ error: error.message });
  }
};


export const getUserPosts=async(req,res)=>{
try {
  const {id}=req.params;
  const validId=new mongoose.Types.ObjectId(id);
 
  const userposts=await Posts.find({postedBy:validId}).sort({createdAt:-1});

  return res.status(201).json(userposts);
} catch (error) {
  console.log(error.message);
  return res.status(500).json({error:error.message})
}
}


export const freezeAccount=async(req,res)=>{
  try {
      const userId=req.user._id;
      const existuser=await Users.findById(userId);
      if(!existuser){
        res.status(400).json({error:"User not found"});
        return;
      }
      existuser.freeze=true;
      await existuser.save();
      return res.status(200).json({success:true})
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({error:error.message});
  }
  
}