import { toast } from "react-toastify";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";

const SettingsPage = () => {
    const navigate=useNavigate();
const {handleLogout}=useLogout();
    const handleFreezeAccount=async()=>{
        if(!window.confirm("Are you sure want to frozen your account?")){
            return;
        }
        try {
            const res=await fetch(`/api/users/freeze/account`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                }
            });
            const data=await res.json();
            if(data.error){
                toast.error(data.error);
                return;
            }
            if(data.success){
                toast.success("Your Account has frozened successfully");
               await handleLogout();
                navigate("/auth");
   return;
            }
        } catch (error) {
            toast.error(error.message);
            console.log("error in handlefrozen",error.message);
        }
    }
  return (
    <div >
         
           <section className="container ">
        <h2 className="mb-7">Freeze your account</h2>
        <button className='p-1 border-red-500 border-2 rounded bg-red-400' onClick={handleFreezeAccount}>Freeze</button>
        </section>
    </div>
  )
}

export default SettingsPage
