import { useContext } from "react";
import useFollowUnFollow from "../hooks/useFollowUnFollow";
import { AppContext } from "../context/AppContext";

const SuggestedUser = ({sugguser}) => {
      const {updating,setUpdating}=useContext(AppContext)
  const {handleFollowUnfollow,following}=useFollowUnFollow({user:sugguser});
  return (
    <div className="flex gap-2 relative ">
      <div className="w-10 h-10 "><img src={sugguser?.profilePic||"https://res.cloudinary.com/dkvyhqwob/image/upload/v1737007754/ytvrtik8truz48kygqzm.png"} className="w-full h-full object-cover rounded-full " alt="" /></div>
      <div className="flex flex-col gap-2">
        <div>{sugguser?.name}</div>
        <div>{sugguser?.username}</div>
      </div>
      <div ><button className=" absolute right-2  p-1 rounded bg-blue-400 " onClick={handleFollowUnfollow} disabled={updating}>{updating?<div className="w-4 h-4 rounded-full border-t-2 border-white animate-spin"></div>:(following===true?"Unfollow":"Follow")}</button></div>
    </div>
  )
}

export default SuggestedUser
