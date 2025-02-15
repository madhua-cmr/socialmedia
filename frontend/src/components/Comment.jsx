
const Comment = ({reply,lastReply}) => {
  return (
    <section className="container">
        <div className="flex  gap-2 ">
            <div className=" h-12 w-12  "><img className="w-full h-full rounded-full object-cover"src={reply.userProfilePic||"https://res.cloudinary.com/dkvyhqwob/image/upload/v1737007754/ytvrtik8truz48kygqzm.png"}/></div>
            <div className="flex-1  flex  flex-col gap-2 ">
                <h2 className="font-semibold text-[16px]">{reply.username}</h2>
                <h3 className="text-[17px]">{reply.text}</h3>
                {!lastReply?<hr className="border-1 rounded border-slate-400"/>:null}
                
            </div>
            
        </div>
    </section>
  )
}

export default Comment
