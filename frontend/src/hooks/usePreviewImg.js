import { useState } from "react";
import { toast } from "react-toastify";

const usePreviewImg = () => {
    const [imgUrl,setImgurl]=useState(null);
    const handleImageChange=(e)=>{
        const file=e.target.files[0];
        
        if(file&&file.type.startsWith("image/")){
            const reader=new FileReader();

            reader.onloadend=()=>{
                setImgurl(reader.result);
            }
            reader.readAsDataURL(file);

        }else{
            toast.error("Invalid file type Please select an Image file")
            setImgurl(null);
        }
    }
  return {handleImageChange,imgUrl,setImgurl}
}

export default usePreviewImg
