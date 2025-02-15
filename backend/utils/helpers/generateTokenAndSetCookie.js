import jwt from "jsonwebtoken"
import "dotenv/config"
const generateTokenAndSetCookie=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"15d",
    })

    res.cookie("jwt",token,{
        httpOnly:true,//more secure cannot access by client side js
        maxAge:15*24*60*60*1000, //15 days
        sameSite:"strict",  //csrf

    })
    return token;

}
export default generateTokenAndSetCookie;
