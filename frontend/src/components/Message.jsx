import { useRecoilState, useRecoilValue } from "recoil"
import { selectedConversationAtom } from "../atoms/messageAtom"
import userAtom from "../atoms/userAtom";
import { RiCheckDoubleLine } from "react-icons/ri";

const Message = ({ownMessage,message}) => {
  const user=useRecoilValue(userAtom);
  const selectedConversation=useRecoilValue(selectedConversationAtom);

  return (
    <>{ownMessage?( <div className="flex  justify-end  gap-1 ">
    {message?.img&&(<div className=" items-end  rounded max-w-[300px] flex gap-2"><img src={message?.img} className="w-full rounded h-full object-cover" alt="" /><RiCheckDoubleLine  className={`${message?.seen===true?"text-blue-500":""}`}/></div>)}

      {message?.text&&(<div className=" bg-slate-500 p-2 rounded max-w-[300px] "><div className="flex items-center gap-1"><p className="max-w-[260px]  break-words flex-[90%]">{message.text}</p><RiCheckDoubleLine  className={` text-[22px] ${message?.seen===true?"text-blue-500":""}`}/></div></div>)}



      <div className=" w-10 h-10  "><img src={user.profilePic||"https://res.cloudinary.com/dkvyhqwob/image/upload/v1737007754/ytvrtik8truz48kygqzm.png"} alt="" className="w-full h-full rounded-full object-cover"/></div>
    </div>):( <div className="flex justify-start gap-1 ">
          <div className=" w-10 h-10  "><img src={selectedConversation.userProfilePic||"https://res.cloudinary.com/dkvyhqwob/image/upload/v1737007754/ytvrtik8truz48kygqzm.png"} alt="" className="w-full h-full rounded-full object-cover"/></div>
          {message?.img&&(<div className="  rounded max-w-[300px] "><img src={message?.img} className="w-full rounded h-full object-cover" alt="" /></div>)}
          {message?.text &&  <div className=" bg-slate-500 p-2 rounded max-w-[300px] ">
         
         <p className="max-w-full  break-words">{message?.text}</p>
        </div>}</div>)}</>
         
  )
}

export default Message
