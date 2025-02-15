
import { GrValidate } from "react-icons/gr";


import MessageInput from "./MessageInput";
import { toast } from "react-toastify";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messageAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useContext, useEffect, useRef, useState } from "react";
import userAtom from "../atoms/userAtom";
import Message from "./Message";
import { SocketContext } from "../context/SocketContext";
import NotificationSound from "../assets/message.mp3"
const MessageContainer = () => {
  const [selectedConversation,setSelectedConversation]=useRecoilState(selectedConversationAtom);
  const [loadingMessage,setLoadingMessages]=useState(true);
  const[messages,setMessages]=useState([])
  const currentUser=useRecoilValue(userAtom);
  const{socket}=useContext(SocketContext);
  const messageRef=useRef(null);

const setConversations=useSetRecoilState(conversationsAtom)
  useEffect(()=>{
  messageRef.current?.scrollIntoView({behavior:'smooth'})
  },[messages])

  useEffect(()=>{
    const lastMessagefromOthers=messages.length&&messages[(messages?.length)-1].sender!==currentUser._id;
    if(lastMessagefromOthers){
      socket.emit("markMessagesSeen",{conversationId:selectedConversation._id,userId:selectedConversation.userId});
    }
    socket.on("messagesSeen",({conversationId})=>{
      if(selectedConversation._id===conversationId){
        setMessages((prev)=>{
          const updatedmessage=prev.map(mess=>{
            if(!mess.seen){
              return {
                ...mess,seen:true
              }
            }
            return mess;
          })
          return updatedmessage
      })
      }
    })
  },[socket,currentUser._id,messages,selectedConversation])
  useEffect(()=>{
    const handleNewMessage=(message)=>{
      if(selectedConversation._id===message.conversationId)
        setMessages((prev)=>[...prev,message]);
    if(!document.hasFocus()) {
      const sound=new Audio(NotificationSound);
      sound.play();
    }   
setConversations((prev)=>(
  prev.map((conversation)=>{
     if(conversation._id===message.conversationId){
       return{
         ...conversation,lastMessage:{
           text:message.text,
           sender:message.sender
         }
       }
     }
     return conversation;
   })),[currentUser._id,socket,messages,selectedConversation])
        
 

    }
    socket.on("newMessage",handleNewMessage);


return ()=>socket.off("newMessage",handleNewMessage);
  },[socket,selectedConversation,setConversations]);

useEffect(()=>{
  const getMessages=async()=>{

    setLoadingMessages(true);
    setMessages([]);

    try {
    if(selectedConversation.mock)return;

      const res=await fetch(`api/messages/${selectedConversation?.userId}`,{
        method:"GET",
        headers:{
          "Content-Type":"application/json"
        }
      })
      const data=await res.json();
      console.log(data);
      if(data.error){
        toast.error(data.error);
        return;
      }
      setMessages(data);
    } catch (error) {
      toast.error(error.message);
      console.log("Error in message containerr")
    }finally{
      setLoadingMessages(false);
    }
  }
  getMessages();
},[selectedConversation?.userId]);
  return (
  
    <div>
    <div className="flex ">
    <div className=" flex gap-2 items-center justify-center"><div className="w-10  h-10 "><img src={selectedConversation?.userProfilePic||'https://res.cloudinary.com/dkvyhqwob/image/upload/v1737007754/ytvrtik8truz48kygqzm.png'} className="w-full rounded-full h-full object-cover"alt="" /></div>
    <h3 className="text-slate-100 font-semibold">{selectedConversation?.username}</h3>
      <div className="w-4 h-4 bg-blue-400 rounded-full ml-2">
                            <GrValidate  className="w-full h-full object-cover  overflow-hidden text-black"/></div>
                            </div>
    </div>
    <hr />
    <div className="p-3 overflow-scroll h-[450px] flex flex-col gap-7">
   
     {!loadingMessage&&(
      messages?.map((message,index)=>(
        <div className="flex  flex-col" key={index} ref={messages?.length-1===messages?.indexOf(message)?messageRef:null} >
        <Message  message={message} ownMessage={currentUser._id===message.sender} />
      </div>
      ))
     )} 
      
   
        </div>

        <MessageInput setMessages={setMessages} />
        </div>
             
        )
}

export default MessageContainer
