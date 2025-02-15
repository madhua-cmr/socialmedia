import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { GrValidate } from "react-icons/gr";
import { useEffect, useState } from "react";
import Actions from "./Actions";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";

import userAtom from "../atoms/userAtom.js";

import postsAtom from "../atoms/postsAtom.js";
const Post = ({ post, user: user_ }) => {
  const [user, setUser] = useState(user_);
  const [liked, setLiked] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);

  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  useEffect(() => {
    const getUser = async () => {
      try {
        if (!user_._id) return;
        const res = await fetch("/api/users/profile/" + user_._id);
        const data = await res.json();
        console.log("user in homepage", data);
        if (data.error) {
          toast.error(data.error);
          return;
        }

        setUser(user);
      } catch (error) {
        toast.error(error.message);
      }
    };
    getUser();
  }, [user]);

  const handleDeletePost = async (e) => {
    e.preventDefault();
    try {
      if (!window.confirm("Are you confirm to delete the post")) return;
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success(data.message);

      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      toast.error(error.message);
    }
  };
  if (!user) return null;

  return (
    <>
      <div className="flex flex-col gap-3">
        <Link to={`/${user_?.username}/post/${post?._id}`}>
          <div className="flex gap-3 mb-4 py-5 ">
            <div className="flex flex-col items-center ">
              
              <div className="w-10 h-10">
                <img
                  src={
                    user_?.profilePic ||
                    "https://res.cloudinary.com/dkvyhqwob/image/upload/v1737007754/ytvrtik8truz48kygqzm.png"
                  }
                  alt={user_?.name}
                  className="w-full h-full object-cover rounded-full"
                 
                />
              </div>
              <div className=" flex-1  w-1 my-1 bg-slate-600"></div>

              <div className="relative ">
                {post.replies.length === 0 && <p>&#128564;</p>}
                {post?.replies[0] && (
                  <div className="w-10 h-10 ">
                    {" "}
                    <img
                      src={post.replies[0].userProfilePic||"https://res.cloudinary.com/dkvyhqwob/image/upload/v1737007754/ytvrtik8truz48kygqzm.png"}
                      alt=""
                      className="  w-full h-full object-cover rounded-full "
                    />
                  </div>
                )}
                {post?.replies[1] && (
                  <div className="">
                    {" "}
                    <img
                      src={post.replies[1].userProfilePic||"https://res.cloudinary.com/dkvyhqwob/image/upload/v1737007754/ytvrtik8truz48kygqzm.png"}
                      alt=""
                      className=" w-full h-full object-cover rounded-full absolute  right-5   "
                    />
                  </div>
                )}
                {post?.replies[2] && (
                  <div className=" ">
                    {" "}
                    <img
                      src={post.replies[2].userProfilePic||"https://res.cloudinary.com/dkvyhqwob/image/upload/v1737007754/ytvrtik8truz48kygqzm.png"}
                      alt=""
                      className=" w-full h-full object-cover rounded-full absolute left-5 "
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 flex-col gap-2">
              <div className="flex justify-between w-full">
                <div className="flex w-full items-center">
                  <h2
                    className="font-bold "
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`getprofile/${user?.username}`);
                    }}
                  >
                    {user_?.username}
                  </h2>
                  <div className="w-4 h-4 bg-blue-400 rounded-full ml-2">
                    <GrValidate className="w-full h-full object-cover  overflow-hidden text-black" />
                  </div>
                </div>
                <div className="gap-4 flex justify-end ">
                  <h3 className="text-xs">
                    {formatDistanceToNow(new Date(post.createdAt))} ago
                  </h3>

                  {currentUser?._id === user_?._id && (
                    <MdDelete className="h-8 w-8" onClick={handleDeletePost} />
                  )}
                </div>
              </div>
              <h3>{post.text}</h3>
              {post.img && (
                <div className="rounded-lg overflow-hidden  w-full h-full my-2  border-1 border-slate-900">
                  <img src={post.img} alt="" className="w-full" />
                </div>
              )}
            </div>
          </div>
        </Link>
        <div className="flex gap-3 my-1">
          <Actions post={post} />
        </div>
      </div>
      <hr />
    </>
  );
};

export default Post;
