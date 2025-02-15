import { FaSearch } from "react-icons/fa";

import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";

import MessageContainer from "../components/MessageContainer";
import Conversation from "../components/Conversation";
import { toast } from "react-toastify";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messageAtom";
import { BiConversation } from "react-icons/bi";
import userAtom from "../atoms/userAtom";
import { SocketContext } from "../context/SocketContext";
const ChatPage = () => {
  const [loadingConversations, setLoadingConversation] = useState(true);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const [searchText, setSearchText] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);
  const currentUser = useRecoilValue(userAtom);
const{socket,onlineUsers}=useContext(SocketContext);
useEffect(()=>{
  socket?.on("messagesSeen",({conversationId})=>{
    setConversations(prev=>{
      const updateConversation=prev.map(conversation=>{
        if(conversation._id===conversationId){
          return{
            ...conversation,
            lastMessage:{
              ...conversation.lastMessage,
              seen:true,
            }
          }
        }
        return conversation
      })
      
      return updateConversation
    })
 
  })
},[socket,setConversations])
  useEffect(() => {
    setSelectedConversation([])
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/user/conversations", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        if (data.error) {
          toast.error(data.error);
          return;
        }

        setConversations(data);
        console.log("Fetched Conversations:", data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoadingConversation(false);
      }
    };
    getConversations();
  }, [setConversations]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);

    try {
      const res = await fetch(`/api/users/profile/${searchText}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const searchedUser = await res.json();

      if (searchedUser.error) {
        toast.error(searchedUser.error);
        return;
      }

      if (searchedUser._id === currentUser._id) {
        toast.error("You can't message yourself");
        return;
      }

      const conversationAlreadyFound = conversations.find(
        (conversation) => conversation?.participants[0]?._id === searchedUser._id
      );

      if (conversationAlreadyFound) {
        setSelectedConversation({
          _id: conversationAlreadyFound._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        return;
      }

      const initiateCon = {
        mock: true,
        lastMessage: {
          text: "",
         
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };

      setConversations((prev) => [...prev, initiateCon]);
      console.log("Updated Conversations State:", conversations);
      setSelectedConversation( {_id:initiateCon._id,
        userId:initiateCon.participants[0]._id,
        userProfilePic:initiateCon.participants[0].profilePic,
        username:initiateCon.participants[0].username,
        mock:initiateCon.mock});
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSearchingUser(false);
    }
  };

  // Debugging Recoil States
  useEffect(() => {
    console.log("Conversations Updated:", conversations);
  }, [conversations]);

  useEffect(() => {
    console.log("Selected Conversation Updated:", selectedConversation);
  }, [selectedConversation]);

  const { colormode } = useContext(AppContext);

  return (
    <>
      <div className="flex  items-center justify-center">
   
        <div className="flex gap-2 p-4 lg:w-[900px] md:w-[80%] w-full">
          <div className="w-1/3 gap-2 flex flex-col p-2">
            <h2>Your Conversation</h2>
            
            <div className="flex  items-center">
              <form onSubmit={handleSearch} >
                <div className="flex max-sm:flex-col flex-row gap-2 " >
                <input
                  type="text"
                  placeholder="Search user here ..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className={`hover:outline-none p-1 w-full outline-none rounded ${
                    colormode === "light" ? "bg-white" : "bg-black"
                  } border-2 border-slate-900`}
                />
                <div
                  className="w-8 h-8 flex items-center justify-center bg-slate-800 rounded p-2"
                 
                >
                  {searchingUser ? (
                    <div className="w-4 animate-spin h-4 rounded-full border-t-2 border-white"></div>
                  ) : (
                    <FaSearch className="text-white" onClick={handleSearch}/>
                  )}
                </div>
                </div>
              </form>
            </div>

            <div className="flex flex-col gap-2">
              {!loadingConversations &&
                conversations?.length > 0 &&
                conversations.map((conversation) => (
                  <Conversation key={conversation._id} isOnline={onlineUsers.includes(conversation.participants[0]?._id)} conversation={conversation} />
                ))}
            </div>
          </div>
          {!selectedConversation?._id && (
            <div className="flex-[70%] flex flex-col items-center justify-center rounded-md p-2 h-[400px]">
              <BiConversation className="w-32 h-32" />
              <h2>Select a conversation to start messaging</h2>
            </div>
          )}
          {selectedConversation?._id && (
            <div className="w-2/3 bg-slate-800 rounded mt-10  p-3 h-full">
              <MessageContainer />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;
