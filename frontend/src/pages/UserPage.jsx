import { toast } from "react-toastify";
import UserHeader from "../components/UserHeader"
import Post from "../components/Post"
import { useEffect} from "react";
import { useParams } from "react-router-dom";

import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

import {  useState } from "react";


const UserPage = () => {



const {username}=useParams();

const [posts,setPosts]=useRecoilState(postsAtom)
 const[user,setUser]=useState(null);
    const[loading,setLoading]=useState(true);
  
      

  // Fetch user data
  useEffect(() => {
    const getUser = async () => {
      if (!username) {
        console.error("Username is undefined");
        setLoading(false);
        return;
      }

      try {
        if(!username)return;
        console.log("Fetching user for username:", username);
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
      console.log("user in userpage",data);
        if (data.error) {
          toast.error(data.error);
          console.log("Errror in userpage get user")
          return;
        }

        console.log("Fetched user:", data);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error.message);
     
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [username]);

  // Fetch user posts after user data is loaded
  useEffect(() => {
    const getUserPosts = async () => {
      if(!user)return null;
      if (!user?._id) return;

      try {
        console.log("Fetching posts for user:", user._id);
        const res = await fetch(`/api/users/posts/${user._id}`);
        const data = await res.json();

        if (data.error) {
          toast.error(data.error);
          return;
        }

        console.log("Fetched posts:", data);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
        toast.error(error.message);
      }finally{
        setLoading(false);
      }
    };

    getUserPosts();
    return () => {
      setPosts([]);
    };
  }, [user, setPosts]);
 
  if (loading) {
    return (
      <section className="container flex justify-center items-center">
        <div className="animate-spin w-4 h-4 rounded-full border-slate-400 border-t-2"></div>
      </section>
    );
  }
  if (!user) {
    return (
      <p className=" container flex items-center justify-center">User not found</p>
    );
  }
  return (
    <>
    <section className="container">
    <UserHeader user={user}/>
    {posts?.length===0?(<p>No posts</p>):( posts?.map((post)=><Post key={post._id} post={post} user={user} />))}
    </section>

    </>
  )
}

export default UserPage
