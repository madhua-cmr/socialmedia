import { useEffect, useState } from "react";
import { AppContext } from "./AppContext";

const AppContextProvider = ({children}) => {
  const [toastMessage, setToastMessage] = useState("");
  const[reloadPosts,setReloadPosts]=useState(false);
    const[colormode,setColormode]=useState("light");
    const [updating,setUpdating]=useState(false);
   const  toggleColorMode=()=>{
   setColormode((prev)=>(prev==="dark"?"light":"dark"));

   }
   useEffect(()=>{
if(colormode==="dark"){
    document.documentElement.classList.add("dark");
}else{
    document.documentElement.classList.remove("dark")
}
   },[colormode])
    const value={colormode,toggleColorMode,toastMessage,updating,setUpdating, setToastMessage,reloadPosts,setReloadPosts};
  return (
    <AppContext.Provider value={value}>
{children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
