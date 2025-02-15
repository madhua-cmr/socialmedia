import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    
    },
    password:{
        type:String,
        minLength:6,
        required:true,
    },
    profilePic:{
        type:String,
        default:"",
    },
    followers:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: "User",
        default:[]
    }
    ,
    following:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: "User",
        default:[]
    },
    bio:{
        type:String,
        default:"",
    },
    freeze:{
        type:Boolean,
        default:false,
    }
},{timestamps:true})


export const Users=mongoose.model("User",userSchema);
