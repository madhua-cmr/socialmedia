import Actions from "../components/Actions"
import { formatDistanceToNow } from "date-fns";
import {  useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Comment from "../components/Comment";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
const navigate=useNavigate()
  const{user,loading}=useGetUserProfile();
  const currentuser=useRecoilValue(userAtom)
 
  const[posts,setPosts]=useRecoilState(postsAtom)
  const {pid}=useParams();
  const currentPost=posts[0];

  const handleDelete=async()=>{

    try {
      if(!window.confirm("Are you sure to delete the post?"))return;
      const res=await fetch(`/api/posts/${currentPost._id}`,{
        method:"DELETE",
       
      })
      const data=await res.json();
   if(data.error){
    toast.error(data.error);
   }
  
   toast.success(data.message);
   navigate(`/${user.username}`)
// setPost([])
  
    } catch (error) {
      toast.error(error.message);

    }
  }
  useEffect(()=>{
  const getPost=async()=>{
    try {
      console.log("hi");
      const res=await fetch(`/api/posts/${pid}`,{
        method:"GET",
        headers:{
          "Content-Type":"application/json"
        }
      });

      const data=await res.json();
   
      if(data.error){
        toast.error(data.error);
        return;

      }
      
      setPosts([data]);
      console.log(data)
    } catch (error) {
      toast.error(error.message)
    }
  }
  getPost()
  },[pid,setPosts])
  if(!user&&loading){
return (
  <div className="flex items-center justify-center inset-0"><div className="animate-spinner w-5 h-5 border-t-2 border-white "></div></div>
)
  }
  if(!user&&!loading){
    return <p className="flex items-center justify-center"> User not found </p>
  }
  if(!currentPost)return (<div>Post not found</div>)
  return (
   <section className="container ">
    <div className="flex flex-col gap-4 " >
      <div className="flex justify-between ">
        <div className=" flex gap-2"><div className="w-14 h-14"><img src={user?.profilePic||'https://res.cloudinary.com/dkvyhqwob/image/upload/v1737007754/ytvrtik8truz48kygqzm.png'} alt="" className="w-full h-full object-cover rounded-full " /></div><h1 className="text-[18px]">{user.username}</h1></div>
        <div className="flex gap-3 items-center">
          <p>{formatDistanceToNow(new Date(currentPost.createdAt))}  ago</p>
          {currentuser?._id===user._id&&<MdDelete className="w-6 h-6 cursor-pointer" onClick={handleDelete} />}
        </div>
      </div>
      <h2 className=" text-[17px]">{currentPost.text}</h2>
     {currentPost.img&&( <div className="border border-slate-500 rounded-md "><img src={currentPost.img} className="w-full h-full object-cover rounded-md"alt="" /></div>)}
      <Actions post={currentPost}/> 
      
      <hr className="border-slate-700 my-4 "/>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
        <h1> &#128075;</h1>
        <h3>Get the App to like ,reply and post.</h3>
        </div>
        <button className="rounded-md bg-slate-600 w-[80px] h-[40px]">Get</button>
      </div>
      <hr  className="my-4 border-slate-600 border-1"/>
      {currentPost.replies.map((reply,index)=>(
    <Comment key={index} reply={reply} lastReply={reply._id===currentPost.replies[currentPost.replies.length-1]._id}/>
      ))}


    </div>
   </section>
  )
}

export default PostPage
