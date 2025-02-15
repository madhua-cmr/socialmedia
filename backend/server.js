import express from "express";
import path from "path"
import "dotenv/config";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import bodyParser from "body-parser";
import postRoutes from "./routes/postRoutes.js";
import cors from "cors";
import messageRoutes from "./routes/messageRoutes.js"
import {app,server}from "./socket/socket.js";
// Increase payload size limit
app.use(bodyParser.json({ limit: "10mb" })); // Set the desired limit
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //to parse form data in the req.body  extended: false option is often sufficient for simpler form data.
app.use(cookieParser());

const __dirname=path.resolve()
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


//routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages",messageRoutes);

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"/frontend/dist")))

  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
  })
}
server.listen(process.env.PORT, () => {
  console.log("Server listening to the port ", process.env.PORT);
  connectDB();
});
