import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { LuSend } from "react-icons/lu";
import { useState } from "react";
import userAtom from "../atoms/userAtom";
import { toast } from "react-toastify";
import { useRecoilState, useRecoilValue } from "recoil";
import { MdOutlineCancel } from "react-icons/md";
import postsAtom from "../atoms/postsAtom";

const ReplyModal = ({ isOpen,posts,post,setPosts, user,closeModal }) => {
  const [replyText, setReplyText] = useState("");
  const[replying,setReplying]=useState(false);
  const handleReplyChange = (e) => {
    setReplyText(e.target.value);
  };
  const handleSendReply = async() => {
    if(!user)return toast.error("You must be logged in to reply to a post")
      if(replying)return;
    setReplying(true);
      try {
        const res=await fetch("/api/posts/reply/"+post._id,{
method:"PUT",
headers:{
  "Content-Type":"application/json"

},
body:JSON.stringify({text:replyText})
});
      
        const data=await res.json();
        if(data.error){
          return toast.error(data.error);
          

        }
       
const updatedPosts=posts.map((p)=>{
  if(p._id===post._id){
    return{...p,replies:[...p.replies,data]};
  }
  return p;
})
setPosts(updatedPosts);
          toast.success("Reply Added successfully")
         
          setReplyText("");
          closeModal();
          
      } catch (error) {
        console.log(error.message);
        toast.error(error.message)
      }finally{
        setReplying(false);
      }
  
  };

  return (
    <>
      {isOpen && (
        <div className="flex items-center justify-center fixed bg-gray-700 bg-opacity-50 z-50 inset-0">
          <div className="bg-slate-700 rounded p-4 flex flex-col items-end ">
            <MdOutlineCancel
              onClick={closeModal}
              className="cursor-pointer text-white mb-2"
            />
            <div>
              <textarea name="" id="" placeholder="Type Comment here ,..."rows={2}  onChange={handleReplyChange} className="rounded outline-none bg-slate-700 border-2 border-slate-400 text-white  resize-none p-2 w-[300px]"></textarea>
              <div className="flex justify-end">
                <button onClick={handleSendReply} className="bg-blue-300 w-[120px] h-[35px] rounded my-2 flex items-center justify-center" disabled={replying}>{replying?(<div className=" w-4 h-4 animate-spin rounded-full border-t-2 border-white"></div>):<p>Reply</p>}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
const Actions = ({ post}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = useRecoilValue(userAtom);
  const [liked, setLiked] = useState(post.likes?.includes(user?._id));

  const [posts, setPosts] = useRecoilState(postsAtom);
  const [isLiking, setIsLiking] = useState(false);
  const handleLikeAndUnlike = async () => {
    if (!user) return toast.error("You must logged in to like the post");
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch("/api/posts/like/" + post._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        toast.error(data.error);
        return;
      }
      if (!liked) {
const updatedPosts=posts.map((p)=>{
  if(p._id===post._id){
    return {...p,likes:[...p.likes,user._id]}

  }
  return p;
})
setPosts(updatedPosts);
      } else {
       const updatedPosts=posts.map((p)=>{
        if(p._id===post._id){
          return {...p,likes:p.likes.filter((id)=>id!==user._id)};

        }
        return p;
       })
       setPosts(updatedPosts)
      }
      setLiked(!liked);
    } catch (error) {
      toast.error(error.message);
      console.log("Error in post", error.message);
    } finally {
      setIsLiking(false);
    }
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-4">
        <div
          onClick={handleLikeAndUnlike}
          className={liked ? " text-red-600  " : ""}
        >
          <FaRegHeart className="text-2xl cursor-pointer" />
        </div>
        <div onClick={handleOpenModal}>
          <FaRegComment className="text-2xl cursor-pointer" />
        </div>
        <RepostOption />
        <ShareOption />
      </div>
      <div className="flex items-center gap-3">
        <h3>{post.likes.length} likes</h3>
        <div className="w-2 h-2 border-slate-600 rounded-full"></div>
        <h3>{post.replies.length} replies</h3>
      </div>
      <ReplyModal
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        setPosts={setPosts}
        user={user}
        post={post}
        posts={posts}
      />
    </div>
  );
};

export default Actions;

const ShareOption = () => {
  return (
    <>
      <div>
        <LuSend className="text-2xl cursor-pointer" />
      </div>
    </>
  );
};

const RepostOption = () => {
  return (
    <>
      <div>
        <BiRepost className="text-2xl cursor-pointer" />
      </div>
    </>
  );
};
