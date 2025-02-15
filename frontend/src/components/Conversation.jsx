import { GrValidate } from "react-icons/gr"
import {  useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { RiCheckDoubleLine } from "react-icons/ri";
import { useContext } from "react";
import { FaRegImage } from "react-icons/fa6";
import { AppContext } from "../context/AppContext";
import { selectedConversationAtom } from "../atoms/messageAtom";
const Conversation = ({conversation,isOnline}) => {
const {colormode}=useContext(AppContext);
  const user=conversation?.participants[0];
  const currentUser=useRecoilValue(userAtom)
  const lastMessage=conversation?.lastMessage;
  const [selectedConversation,setSelectedConversation]=useRecoilState(selectedConversationAtom)
  return (
    <div className={`flex gap-3 rounded-sm m-2 ${selectedConversation?._id===conversation._id?(colormode==="light"?"bg-slate-600":"bg-slate-800"):""}`}  onClick={()=>setSelectedConversation({
      _id:conversation?._id,
      userId:user?._id,
      userProfilePic:user?.profilePic,
      username:user?.username,
      mock:conversation?.mock,
    })}   >
      <div className="w-10 h-10 relative"> <img src={user?.profilePic||'https://res.cloudinary.com/dkvyhqwob/image/upload/v1737007754/ytvrtik8truz48kygqzm.png'} alt="profile" className=" rounded-full w-full h-full object-cover" />
      {isOnline?<><div className="w-2 h-2 rounded-full bg-green-400  border-green-400 border-2 absolute bottom-0 right-0"></div></>:""}
      </div>
      <div className="flex flex-col ">
        <div className="flex items-center justify-center">
        <h3 className="font-semibold">{user?.username}</h3>
         <div className="w-4 h-4 bg-blue-400 rounded-full ml-2">
                                    <GrValidate  className="w-full h-full object-cover  overflow-hidden text-black"/></div>
         </div>
      
      
       <h4 className="flex items-center gap-1 text-[17px]">{currentUser?._id===lastMessage.sender?<RiCheckDoubleLine  className={`${lastMessage?.seen===true?"text-blue-500":""}`}/>:""}{conversation?.mock===true?"":(lastMessage.text.length>18?lastMessage.text.substring(0,18)+"...":lastMessage.text||<FaRegImage />)}</h4>
        </div>
      </div>
 
  )
}

export default Conversation
