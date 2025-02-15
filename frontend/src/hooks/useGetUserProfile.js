
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const useGetUserProfile = () => {
    const[user,setUser]=useState({});
    const[loading,setLoading]=useState(true);
    const {username}=useParams();
    

  useEffect(()=>{
const getUser=async()=>{
  try {
    const res=await fetch(`/api/users/profile/${username}`);
    const data=await res.json();
    if(data.error){
      toast.error(data.error);
return;
    }
    console.log("user",data);
    if(data.freeze){
      setUser({});
      return;
    }
 setUser(data);

  } catch (error) {
    console.log("Error in post page");
    toast.error(error.message);

  }finally{
    setLoading(false);
  }
  
}
getUser();
  },[username])
  return {loading,user}
}

export default useGetUserProfile
