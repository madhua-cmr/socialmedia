import express from "express";
import { Server } from "socket.io";
import http from "http";
import Message from "../models/message.Model.js";
import Conversation from "../models/conversationModel.js";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

export const getRecipientSocketId=(recipientId)=>{
  return userSocketMap[recipientId];
}
const userSocketMap={};

io.on("connection", (socket) => {
  console.log("User connected", socket.id);
 const userId=socket.handshake.query.userId;
 if(userId!="undefined")userSocketMap[userId]=socket.id;
 io.emit("getOnlineUsers",Object.keys(userSocketMap));
 socket.on("markMessagesSeen",async({conversationId,userId})=>{
  try{
    await Message.updateMany({conversationId:conversationId,seen:false},{$set:{seen:true}});
    await Conversation.updateOne({_id:conversationId},{$set:{"lastMessage.seen":true}});


io.to(userSocketMap[userId]).emit("messagesSeen",{conversationId});

  }catch(err){
    console.log(err);
    
  }

 })
  socket.on("disconnect",()=>{console.log("User disconnected");
    delete userSocketMap[userId];
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
  })
});


export { io, app, server };


