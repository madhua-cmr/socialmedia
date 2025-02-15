import  { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { AppContext } from '../context/AppContext';

const useFollowUnFollow = ({user}) => {
    const currentuser=useRecoilValue(userAtom);
    const [following,setFollowing]=useState(user?.followers?.includes(currentuser?._id))
   
    const {updating,setUpdating}=useContext(AppContext)
  const userId=user?._id;

    const handleFollowUnfollow=async()=>{
        
        if(!currentuser){
            toast.error("Please login to follow")
            return;
        }
        if (!userId) {
            console.log(user)
            console.error("User ID is undefined");
            toast.error("Cannot follow/unfollow: User ID is missing");
            return;
          }
        if(updating){
            return;
            
        }
        setUpdating(true);
        try {
            if(!userId)return;
            console.log(userId)
            const res=await fetch(`/api/users/follow/${userId}`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                }
            })
            const data=await res.json();
            if(data.error){
                toast.error(data.error);
                return;
            }

            if(following){
                toast.success(`Unfollowed ${user.name}`)
                user?.followers?.pop();
            }
            else{
                toast.success(`Followed ${user.name}`);
                user?.followers?.push(currentuser?._id);
            }
            setFollowing(!following);

            console.log(data)
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }finally{
            setUpdating(false)
        }
    }
  return {handleFollowUnfollow,currentuser,following} 
}

export default useFollowUnFollow
