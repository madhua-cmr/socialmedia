import { useContext, useEffect, useRef, useState } from "react"
import { AppContext } from "../context/AppContext"
import { useRecoilState } from "recoil"
import userAtom from "../atoms/userAtom"
import usePreviewImg from "../hooks/usePreviewImg"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const UpdateProfilePage = () => {
    const {colormode,setToastMessage}=useContext(AppContext)
    const [updating,setUpdating]=useState(false);
    const [user,setUser]=useRecoilState(userAtom);
    const navigate=useNavigate();
 const[inputs,setInputs]=useState({
    name:user.name ||"",
    username:user.username||"",
    email:user.email||"",
    bio:user.bio||"",
    password:"",
    
    
 })
 
 useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
   
  }, [user]);
 const {handleImageChange,imgUrl}=usePreviewImg();

const handleSubmit=async(e)=>{
    e.preventDefault();
    if(updating)return;
    setUpdating(true)
    try {
        
        const res=await fetch(`/api/users/update/${user._id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",

            },
            body:JSON.stringify({...inputs,profilePic:imgUrl})
        })

        const data=await res.json();
  console.log(data)
       
     localStorage.setItem("user",JSON.stringify(data.user))
       setUser(data.user)
    

        if(data.error){
            toast.error(data.error);
        }
setToastMessage("profile updated")
       toast.success("Profile Updated successfully")
       navigate(`/getprofile/${user._id}`)
       
    } catch (error) {
        toast.error(error.message)
    }
finally{
    setUpdating(false)
}
}
 const fileRef=useRef(null);
  return (
    <section className="container flex items-center  justify-center">
        <form action="" onSubmit={handleSubmit} className={`flex  flex-col rounded  gap-4  py-6 ${colormode==="dark"?"bg-slate-900":"bg-white"} w-3/4 items-center `}>
            <h2 className="font-bold">Update Profile</h2>
            <div className="flex gap-4 justify-center items-center my-4 h-[50px] ">
                <div className="w-[100px]  h-[100px]"><img src={imgUrl||user.profilePic||'https://res.cloudinary.com/dkvyhqwob/image/upload/v1737007754/ytvrtik8truz48kygqzm.png'} alt="" className=" rounded-full object-cover h-full w-full"/></div>
                <button className="p-2  rounded h-[40px] bg-slate-700 text-slate-100 " onClick={()=>fileRef.current.click()} type="button">Change profile Image</button>
                <input type="file" name="profileavatar" id="" hidden  ref={fileRef} onChange={handleImageChange}/>
            </div>
            <div className="flex flex-col gap-2">
                <h3>Fullname</h3>
                <input required className={`${colormode==="dark"?"bg-[#30343f]" : "bg-white"} p-2 w-[270px] rounded border-slate-200 border  hover:outline-none outline-none`} type="text" placeholder="Name" value={inputs.name} onChange={(e)=>setInputs({...inputs,name:e.target.value})}/>
            </div>
            <div className="flex flex-col gap-2">
                <h3>Username</h3>
                <input required className={`${colormode==="dark"?"bg-[#30343f]" : "bg-white"} p-2 w-[270px] rounded border-slate-200 border hover:outline-none outline-none`}type="text" placeholder="madhumitha"  value={inputs.username}
                onChange={(e) =>
                  setInputs({ ...inputs, username: e.target.value })
                } />
            </div>
            <div className="flex flex-col gap-2">
                <h3>Email</h3>
                <input required className={`${colormode==="dark"?"bg-[#30343f]" : "bg-white"} p-2 w-[270px] rounded border-slate-200 border hover:outline-none outline-none`}type="email"  placeholder="email@example.com"  value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
        />
            </div>
            <div className="flex flex-col gap-2">
                <h3>Bio</h3>
                <input required className={`${colormode==="dark"?"bg-[#30343f]" : "bg-white"} p-2 w-[270px] rounded border-slate-200 border hover:outline-none outline-none`}type="text" placeholder="Your bio" value={inputs.bio} onChange={(e)=>setInputs({...inputs,bio:e.target.value})}/>
            </div> <div className="flex flex-col gap-2">
                <h3>Password</h3>
                <input  className={`${colormode==="dark"?"bg-[#30343f]" : "bg-white"} p-2 w-[270px] rounded border-slate-200 border hover:outline-none outline-none`}type="password" placeholder="password"  value={inputs.password}
                onChange={(e) =>
                  setInputs({ ...inputs, password: e.target.value })
                }
                 />
            </div>
            <div className=" flex gap-2">
                 <button className=" p-2 bg-red-700 rounded text-white w-[100px] " onClick={()=>navigate(`/${user._id}`)}type="button">Cancel</button>
                 <button className="p-2 bg-green-700 rounded text-white  w-[100px] disabled:opacity-40 flex items-center justify-center" type="submit" disabled={updating}>{updating?(<div className="animate-spin rounded-full border-t-2 border-white h-4 w-4"></div>):(<span>Submit</span>)}</button>
            </div>
        </form>
    </section>
  )
}

export default UpdateProfilePage
