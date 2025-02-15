import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { AppContext } from "../context/AppContext"
import { useSetRecoilState } from "recoil"
import authScreenAtom from "../atoms/authAtom"
import userAtom from "../atoms/userAtom"
import { toast } from "react-toastify"

const LoginCard = () => {
    
    const  setAuthScreenState=useSetRecoilState(authScreenAtom)
    const {colormode}=useContext(AppContext);
    const[loading,setLoading]=useState(false);
    const setUser=useSetRecoilState(userAtom)
    const [inputs,setInputs]=useState({
        username:"",
        password:""

    });

    const handleLogin=async(event)=>{
        setLoading(true);
    event.preventDefault();
    try {
        const res=await fetch("/api/users/login",{
            method:"POST",
            headers:{
                "Content-type":"application/json",
            },
            body:JSON.stringify(inputs)
        })

        const data=await res.json();
        
        if(data.error){
            console.log(data.error)
            toast.error(data.error);
    return;
        }
  localStorage.setItem("user",JSON.stringify(data));
  setUser(data);
  toast.success("Logged in successfully");
    } catch (error) {
        console.log(error.message);
        toast.error(error.message);
    }finally{
        setLoading(false);

    }
    }
  return (
    <section className="container flex flex-col items-center justify-center   h-[550px]">
    <div className={` flex flex-col items-center justify-center gap-8  p-8 my-auto ${colormode==="dark"? 'bg-[#30343f]':' bg-white'} bg-slate-600 `}>
        <h2 className="font-semibold">Login</h2>
        <form action="" className="flex flex-col gap-4">
           
            <div className="flex flex-col gap-3">
                <h3 className="">Username</h3>
                <input value={inputs.username} onChange={(event)=>setInputs({...inputs,username:event.target.value})}type="text" name="username" placeholder="Username" id="name" className={`rounded ${colormode==="dark"?"bg-[#30343f]" : "bg-white"} border-2 border-[#807d8055] outline-none hover:outline-none  p-2  w-[230px]}`} required/>
            </div>
            <div className="flex flex-col gap-3">
                <h3>Password</h3>
                <input value={inputs.password} onChange={(event)=>setInputs({...inputs,password:event.target.value})} type="password"  placeholder="Password" name="password" id="pass"  className={`rounded ${colormode==="dark"?"bg-[#30343f]" : "bg-white"} border-2 border-[#807d8055] outline-none hover:outline-none  p-2  w-[230px]}`}  required/>
            </div>
            <button className="flex bg-stone-900 hover:bg-slate-700 p-2 rounded text-white items-center justify-center" onClick={handleLogin} disabled={loading}>{loading?(<div className="animate-spin w-4 h-4 rounded-full border-slate-300 border-t-2"></div>):(<span>Login</span>)}</button>

            <p>Don&apos;t have an account?<Link  className="text-blue-500" onClick={()=>setAuthScreenState("signup")}> Sign up</Link></p>
        </form>

    </div>
  </section>
  )
}

export default LoginCard
