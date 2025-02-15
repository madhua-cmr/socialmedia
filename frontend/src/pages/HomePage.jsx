import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import { AppContext } from "../context/AppContext";

const HomePage = () => {
 
  const[posts,setPosts]=useRecoilState(postsAtom);
  const[loading,setLoading]=useState(false);
const[suggestedUsers,setSuggestedUsers]=useState([]);
    const {updating,setUpdating}=useContext(AppContext)
  useEffect(()=>{
   const getSuggestedUsers=async()=>{
    try {
      const res=await fetch("/api/users/suggested",{
        method:"GET",
        headers:{
          "Content-Type":"applications/json",
        }
      

      })
      const data=await res.json();
      setSuggestedUsers(data);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  }
  getSuggestedUsers();
  },[])

  useEffect(()=>{
    
  const getFeedPosts=async()=>{
    setLoading(true);
   
    try {
     
      const res=await fetch("/api/posts/get/feed",{
       method:"GET",
       headers:{

       
       "Content-Type":"application/json"
       }
      });

      const data=await res.json();
     
     setPosts(data);
      if(data.error){
        console.log("Errror in get Feed posts response",data.error)
        toast.error(data.error)
      }
      
    } catch (error) {
      toast.error(error.message)
      console.log("Errror in get Feed posts front",error.message)
    }finally{
      setLoading(false)
    }
  }
  getFeedPosts()

  return () => {
    setPosts([]);
  };
  },[setPosts,updating])

  return (
    <>
    <div className="flex gap-4  md:w-3/4 mx-auto p-4 justify-center">
    <div className="flex-[70%] ">
      {loading&&(
        <div className="flex items-center"> <div className="animate-spin w-4 h-4 rounded-full border-white border-t-2 "></div></div>
      )
    
}
{!loading && posts.length===0?(<h1>Follow some users to see the feed</h1>):(posts.map((post)=>(
  <Post key={post._id} post={post} user={post?.postedBy}/>
))
)}
</div>
<div className="flex-[30%] max-md:hidden">

<SuggestedUsers suggestedUsers={suggestedUsers}/>
</div>
</div>

</>
  )
}

export default HomePage
