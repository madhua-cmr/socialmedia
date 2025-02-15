import express from "express";
import { getAllConversations, getMessages, sendMessage } from "../controllers/messageController.js";
import  protectRoute  from "../middlewares/protectRoute.js";

const router=express.Router();

router.post("/send/newmessage",protectRoute,sendMessage);
router.get("/:otherUserId",protectRoute,getMessages);
router.get("/user/conversations",protectRoute,getAllConversations)
export default router;