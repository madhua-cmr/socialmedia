import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
conversationId:{type:mongoose.Schema.Types.ObjectId,
    ref:'Conversation'
},
sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
},
text:{
    
    type:String,
},
img:{
    type:String,
    default:""
},
seen:{
    type:Boolean,
    default:false,
}
},{
    timestamps:true
})

const Message=mongoose.model('Message',messageSchema);

export default Message;