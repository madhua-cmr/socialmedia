import Conversation from "../models/conversationModel.js";
import Message from "../models/message.Model.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import{v2 as cloudinary} from "cloudinary";
export const sendMessage = async (req, res) => {
  try {
  
    const { message , recipientId } = req.body;
    let {img}=req.body;
    const senderId = req.user._id;
  
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
      await conversation.save();
    }
if(img){
 const uploadedResponse=await cloudinary.uploader.upload(img);
 img=uploadedResponse.secure_url;
}
    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
      img:img||""
    });
    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }),
    ]);

    const recipientSocketId=getRecipientSocketId(recipientId);
    if(recipientSocketId){
      io.to(recipientSocketId).emit("newMessage",newMessage);
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getMessages = async (req, res) => {
  const { otherUserId } = req.params;
  const userId = req.user._id;

  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllConversations = async (req, res) => {
  const userId =req.user._id;
 
  try {

    const conversations = await Conversation.find({
      participants: userId,
    }).populate({
      path: "participants",
      select: "username profilePic",
    });
    //remove currentuser
    conversations.forEach(conversation=>{
      conversation.participants=conversation.participants.filter(
        (participant)=>participant._id.toString()!==userId.toString()

      )
    })
    return res.status(200).json(conversations);
  } catch (error) {
    console.log("Error in get all conversation controller")
    return res.status(500).json({ error: error.message });
  }
};
