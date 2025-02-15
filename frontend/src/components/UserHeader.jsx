/* eslint-disable react/prop-types */
import { FaInstagram } from "react-icons/fa";
import { CgMenuRound } from "react-icons/cg";
import { toast } from "react-toastify";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnFollow from "../hooks/useFollowUnFollow";

const UserHeader = ({user}) => {
  const { handleFollowUnfollow, currentuser, following, updating } =useFollowUnFollow({user});
  const copyurl = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast.success("Profile link copied");
    });
  };

  const followers = user?.followers || [];
 
  return (
    <section className="flex flex-col  gap-4 items-start">
      <div className="flex   w-full justify-between">
        <div className="">
          <h1>{user.name}</h1>
          <div className="flex gap-2 items-center">
            <h3>{user.username}</h3>
            <p className="bg-slate-800 text-xs text-slate-400 p-1 rounded-full">
              threads.net
            </p>
          </div>
        </div>
        <div className="h-[120px] w-[120px]">
          <img
            src={
              user?.profilePic ||
              "https://res.cloudinary.com/dkvyhqwob/image/upload/v1737007754/ytvrtik8truz48kygqzm.png"
            }
            alt="profile"
            className=" rounded-full w-full h-full object-cover"
          />
        </div>
      </div>
      <h3>{user.bio}</h3>

      {currentuser?._id === user?._id && (
        <RouterLink
          to="/update"
          className="bg-slate-700 flex items-center justify-center p-2 rounded-2xl  text-slate-200"
        >
          <button>Update profile</button>
        </RouterLink>
      )}
      {currentuser?._id !== user?._id && (
        <button
          onClick={handleFollowUnfollow}
          disabled={updating}
          className="bg-slate-700 flex items-center justify-center p-2 rounded-2xl w-[80px] text-slate-100 disabled:opacity-80"
        >
          {updating ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2  border-white"></div>
          ) : (
            <span>{following ? "Unfollow" : "Follow"}</span>
          )}
        </button>
      )}
      <div className="flex    w-full justify-between">
        <div className="flex items-center  ">
          <p className="  text-slate-700 ">{followers.length} followers</p>
          <div className="mx-2 w-1 h-1 bg-slate-600 rounded-3xl"></div>
          <p className="  text-slate-700 ">instagram.com</p>
        </div>
        <div className="flex gap-2 ">
          <div className="text-2xl cursor-pointer hover:bg-slate-600 rounded-full p-2  ">
            <FaInstagram />
          </div>
          <div className=" group text-2xl cursor-pointer relative hover:bg-slate-600 rounded-full p-2">
            <CgMenuRound />
            <div className="hidden group-hover:block  absolute top-10 w-[100px] bg-slate-600 text-sm p-1.5 rounded ring-1 ring-slate-100  ">
              {" "}
              <button className="w-full h-full" onClick={() => copyurl()}>
                Copy Link
              </button>
            </div>
          </div>
        </div>{" "}
      </div>
      <div className="flex w-full ">
        <div className="cursor-pointer flex-1 flex border-b border-b-white justify-center pb-3   ">
          Threads
        </div>
        <div className="cursor-pointer flex-1 flex border-b border-b-slate-400 justify-center pb-3   ">
          Replies
        </div>
      </div>
    </section>
  );
};

export default UserHeader;
