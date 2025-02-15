import { useRecoilState, } from "recoil"
import userAtom from "../atoms/userAtom"
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

const useLogout = () => {
    
    const navigate=useNavigate();
    const [user,setUser]=useRecoilState(userAtom);
    
    const handleLogout=async()=>{
    try {
        const res=await fetch("/api/users/logout",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            }
        })

        const data=await res.json()

        if(data.error){
            toast.error(data.error);
             return;
        }
        localStorage.removeItem("user")
        setUser(null);
       
        if(data.message){
            toast.success(data.message);
            console.log(user);
            navigate("/");
        }
       
    } catch (error) {
         toast.error(error.message)
    }
}
  return (
   {handleLogout}
  )
}

export default useLogout
