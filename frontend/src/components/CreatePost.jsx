import {  useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaRegImage } from "react-icons/fa6";
import usePreviewImg from "../hooks/usePreviewImg";
import { MdCancel } from "react-icons/md";
import userAtom from "../atoms/userAtom";
import { toast } from "react-toastify";

import { useRecoilState, useRecoilValue } from "recoil";

import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";
const CreatePost = () => {
const [isOpen,setIsOpen]=useState(false);
const ImgRef=useRef(null)
const[uploading,setUploading]=useState(false)
const user=useRecoilValue(userAtom)
const MAX_CHAR=500;
const {handleImageChange,setImgurl,imgUrl}=usePreviewImg()
const[postText,setPostText]=useState("");
const[remainigChar,setRemainingChar]=useState(MAX_CHAR);

const[posts,setPosts]=useRecoilState(postsAtom);
const{username}=useParams();
const handleTextChange=(e)=>{
    const inputText=e.target.value;
    if(inputText.length>MAX_CHAR){
   const truncatedText=inputText.slice(0,MAX_CHAR);
    setPostText(truncatedText);
    setRemainingChar(0);
    }
    else{
        setPostText(inputText)
        setRemainingChar(MAX_CHAR-inputText.length);
    }
}

const openModal=()=>{
    setIsOpen(true);
}
const closeModal=()=>{
    setIsOpen(false);

}

const handleCreatePost=async(e)=>{
    setUploading(true);
    e.preventDefault();
    try{
    console.log("hi")
    const res=await fetch("/api/posts/create",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({postedBy:user._id,text:postText,img:imgUrl})
    })

    const data=await res.json();

    if(data.error){
        toast.error(data.error);
        return;
    }

    toast.success("Post created successfully");
    if(username===user.username){
        setPosts([data,...posts]);
    }


    setImgurl("");
    setRemainingChar(MAX_CHAR);
   setPostText("");
    closeModal();

}
catch(error){
    console.log(error.message);
    toast.error(error.message);
    return;
}finally{
    setUploading(false)
}
}
  return (

  <>
  
  <button className="fixed bottom-2 right-2  bg-slate-900 w-[40px] flex gap-2 items-center justify-center p-2 rounded  text-slate-100 hover:bg-slate-900" onClick={openModal}>
    <IoMdAdd  className="text-[16px]"/></button>

    {isOpen&&(
        <section className="inset-0 flex justify-center items-center bg-slate-700 bg-opacity-50  z-50 fixed">
        <div className=" w-1/3 bg-slate-700 text-slate-50  p-4 rounded">
            <div className="flex justify-between  items-center pb-8">
                <h2>Create post</h2>
                <IoClose className="text-[18px]  cursor-pointer" onClick={closeModal} />
            </div>
            <form className="flex flex-col">
            <textarea name="" id="" onChange={handleTextChange} rows={5} className="rounded outline-none mb-4 hover:outline-none bg-slate-700 border border-slate-50 shadow-sm p-3 resize-none" placeholder="write content here ...."></textarea>
            <div className="flex  justify-end"><p className="text-[14px] m-1">{remainigChar}/{MAX_CHAR}</p></div>
            <FaRegImage className="text-[18px] ml-2 mb-8 cursor-pointer" onClick={()=>ImgRef.current.click()}/>
            <input type="file" className="hidden"  ref={ImgRef} src="" alt="" onChange={handleImageChange} />
            </form>
            {imgUrl&&(
            <div className="relative">
            <img src={imgUrl} className="rounded mb-3 " alt="" />
            <MdCancel  className="absolute right-2 top-2 text-white  cursor-pointer " onClick={()=>setImgurl("")}/>
            </div>)}
            <div className="flex flex-col items-end"> <button className="bg-slate-500 rounded w-[80px] p-1.5 flex items-center justify-center" onClick={handleCreatePost} disabled={uploading}>{uploading?(<div className="animate-spin h-4 w-4 rounded-full border-white border-t-2"></div>):(<span>Post</span>)}</button></div>
            
        </div>
        </section>
    )}
   
   
    </>
  )
}

export default CreatePost
