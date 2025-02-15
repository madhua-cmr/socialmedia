import { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5"
import { toast } from "react-toastify";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messageAtom";
import {  useRecoilValue, useSetRecoilState } from "recoil";
import { FaRegImage } from "react-icons/fa6";
import { MdOutlineCancel } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import usePreviewImg from "../hooks/usePreviewImg";
const MessageInput = ({setMessages}) => {
  const[sendingMessage,setSendingMessage]=useState(false);

  const[messageText,setMessageText]=useState("");
const selectedConversation=useRecoilValue(selectedConversationAtom);
const setConversations=useSetRecoilState(conversationsAtom)
const imgRef=useRef(null);
const{handleImageChange,imgUrl,setImgurl}=usePreviewImg()
  
  const handleSendMessage=async(e)=>{
    e.preventDefault();
if(!messageText&&!imgUrl)return;
setSendingMessage(true);
try{

const res=await fetch("/api/messages/send/newmessage",{
  method:"POST",
  headers:{
    "Content-Type":"application/json",
  },
  body:JSON.stringify({
   message:messageText,
   recipientId:selectedConversation.userId,
   img:imgUrl||""
  })
})
const data=await res.json();
console.log(data)
if(data.error){
  toast.error(data.error);
  return;
}
console.log(data)

setMessages((messages)=>[...messages,data]);

setConversations((prev) => 
  prev.map((conversation) => 
    conversation._id === selectedConversation._id
      ? {
          ...conversation,
          lastMessage: {
            text: messageText,
            sender: data.sender,
          },
          mock:false
        }
      : conversation
  )
);
setMessageText("");

setImgurl("");
}catch(error){
  toast.error(error.message);
  console.log("error in message input ")
}finally{
  setSendingMessage(false);
}
  }
  return (
    <>
   {imgUrl&&  <section className="inset-0  z-50 fixed flex items-center justify-center bg-slate-400 bg-opacity-50">
          <div className="bg-slate-700  p-4 w-1/2  flex flex-col  rounded-md gap-3">
          <div className="text-[22px] text-slate-100 flex justify-end "><MdOutlineCancel className="cursor-pointer "onClick={()=>{setImgurl("")}} /></div>
          <div><img src={imgUrl} alt="" /></div>
          <div className="text-[22px] text-slate-100 flex justify-end cursor-pointer" onClick={handleSendMessage}>{sendingMessage?(<div className="rounded-full w-4 h-4 border-t-2 border-white animate-spin"></div>):(<IoSendSharp />)}</div>
          </div>
        </section>
}
    <div className="flex items-center gap-1">
    <form className="flex-[95%]" onSubmit={handleSendMessage}>
    <div className="flex items-center justify-center w-full p-1" onClick={handleSendMessage}>
        <input type="text" onChange={(e)=>setMessageText(e.target.value)}   value={messageText} placeholder="Type a message"  className={`w-full bg-slate-800 border-2 border-slate-400 hover:outline-none outline-none rounded p-2`}/><IoSendSharp  className="text-slate-100 text-[22px] cursor-pointer ml-3" /></div></form>
        <div className=" flex-[5%] cursor-pointer" onClick={()=>imgRef.current.click()}><FaRegImage  className="text-[22px] text-slate-300"/><input type="file" onChange={handleImageChange} className="hidden" name="image" id="image" ref={imgRef} /></div> 
        </div>

       
         </>
  )
}

export default MessageInput
