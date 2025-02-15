import { Link } from "react-router-dom"
import { BsThreeDots } from "react-icons/bs";
import { GrValidate } from "react-icons/gr";

import Actions from "./Actions";
const UserPost = ({post,user}) => {
   
 
  return (
    <>
    <Link to={"/madhu/post/1"} >
        <div className="flex gap-3 mb-4 py-5 ">
            <div className="flex flex-col items-center ">
              <div className="w-10 h-10  rounded-full "> <img src={user.profilePic||"https://res.cloudinary.com/dkvyhqwob/image/upload/v1737007754/ytvrtik8truz48kygqzm.png"} alt={user.username} className="w-full h-full object-cover rounded-full"/></div> 
                <div className="h-full w-1 my-2 bg-slate-600">

                </div>
                {post.replies.length===0?(<p>&#128564;</p> ):(            <div className="relative">
{post.replies[0]&&(<img src={post.replies[0].userprofilePic} alt=""  className="w-12 rounded-full absolute left-10"/>)}
{post.replies[1]&&(<img src={post.replies[1].userprofilePic} alt="" className="w-12 rounded-full absolute bottom-10 left-5"/>)}

{post.replies[1]&&(<img src={post.replies[2].userprofilePic} alt=""  className="w-12 rounded-full "/>)}
</div>)}
    
            </div>
            <div className="flex-1 flex-col gap-2">
                <div className="flex justify-between w-full">
                    <div className="flex w-full items-center">
                        <h2 className="font-bold ">{user?.username}</h2>
                        <div className="w-4 h-4 bg-blue-400 rounded-full ml-2">
                        <GrValidate  className="w-full h-full object-cover  overflow-hidden text-black"/>
                        </div>
          
                        
                    </div>
                    <div className="gap-4 flex ">
                        <h3 className="text-slate-100">1d</h3>
                        <BsThreeDots className="flex items-center h-full" />

                    </div>
                </div>
                <h3>{post.text}</h3>
                {post.img &&
                <div className="rounded-lg overflow-hidden  w-full h-full my-2  border-1 border-slate-900"><img src={post.img} alt="" className="w-full"/></div>}
                
               
            
          
                </div>
        </div>
        </Link>
        <div className="flex gap-3 my-1 mb-4">
                    <Actions  post={post} /> 

                </div>
              
                <hr />
                
        </>
  )
}

export default UserPost
