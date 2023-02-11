import React, { useState,useContext, useEffect, useRef } from 'react'
import './MessagePage.css'
import Conversation from '../User/Conversation'
import ChatMessage from '../ChatMessage/ChatMessage'
import { UserAuthContext } from '../../../helper/Context';
import Axios  from 'axios';


function MessagePage({socket}) {

  const {globalAuthState} = useContext(UserAuthContext);

  // user conversation
const [conver,setConver] = useState([]);
//select someone to chat
const [currentChat,setcurrentChat] = useState([]);
// message
const [message,setMessage] = useState([]);
// newMessage
const [newMessage,setNewMessage] = useState('');
// arrival Message from socketIo
const [arrivalMessage,setArrivalMessage] = useState('');
// update The message 
const  [autoUpdate,setAutoUpdate] =  useState([]);
// use to store Id from socket io that help to render the new conversation if theres new added in realtime
const [newConRender,setNewConRender] = useState([]);
// auto scroll down the conversation if theres too many message
const scrollDown = useRef();


//  to get the arrival message and update from socketIo
useEffect(()=>{
socket.current.on("getMessage",(data)=>{
     setArrivalMessage({
      sender: data.senderId,
      text: data.text,
      createdAt: Date.now()
    })
})
socket.current.on("getConver",(data)=>{
  setNewConRender([{
 _id : data._id
 }])
})
socket.current.on("updateConver",(data)=>{
setNewConRender([{
_id : data.id
}])
})
},[])

  //add User in SocketIo
  useEffect(()=>{
    socket.current.emit("addUser",globalAuthState.id)
    },[globalAuthState])
    


/*
 to add new arrival message from socket io, I use try and catch, because it will always cause an error
when a user was not active in other conversation
*/
useEffect(()=>{
try{
  arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) 
  setMessage([...message,arrivalMessage])
}
catch(err){
console.log(err)
}
},[arrivalMessage])


// to get the user conversation data
  useEffect(()=>{
let getConver = async ()=>{
let response = await Axios.get(`http://localhost:3001/conver/${globalAuthState.id}`)
if(response.data.error){
  console.log(response.data.error)
}
else{
  setConver(response.data)
}
}
getConver();
  },[newConRender])

// to get the current conversation message
useEffect(()=>{
  const getMessages = async ()=>{

    let response = await Axios.get(`http://localhost:3001/message/${currentChat._id}`)
    if(response.data.error){
      console.log(response.data.error)
    }
    else{
    setMessage(response.data)
  }
}
getMessages();
},[currentChat,autoUpdate])

// send message
let sendMessage = async (e)=>{
e.preventDefault();
if(newMessage.length > 0){
  const receiveId = currentChat.members.find((members)=> members !== globalAuthState.id)
  const message = {
    conversationId : currentChat._id,
    senderId: globalAuthState.id,
    receiverId: receiveId,
    text: newMessage
  }
// also send realtime from socketIo
socket.current.emit("sendMessage",{
    senderId : globalAuthState.id,
   receiverId : receiveId,
    text: newMessage
  })
  let response = await Axios.post('http://localhost:3001/message/',message)
 if(response.data.error){
console.log(response.data.error)
 }
 else{
  setAutoUpdate(response.data)
  setNewMessage('')
 }
}
}

// to scroll 
useEffect(()=>{
  scrollDown.current?.scrollIntoView({behavior:"smooth"})
},[message])


// delete conversation and also to delete message
let deleteConBtn = async (id,friendsId)=>{
await Axios.delete(`http://localhost:3001/conver/${id}`).then((data)=>{
  if(data.error){
    console.log(data.error)
  }
  else{
   let removeOne = conver.filter(data => data._id !== id )
setConver(removeOne)
socket.current.emit("deleteCon",{
id : friendsId
})
  }
}).then(async ()=>{
if(message.length > 0){
  const receiveId = currentChat.members.find((members)=> members !== globalAuthState.id)
  await Axios.delete(`http://localhost:3001/message/${globalAuthState.id}/${receiveId}`);
  alert("Delete Success")
  setMessage([])
}
else{
  alert("Delete Success")
  setMessage([])
}
}).catch(()=>{
console.log('Error Request')
});
  }

  return (
    <section className='MessagePage'>
<div className='UserChat'>
<div className='chatSearch'>
My Conversation
</div>
<div className='AllUserChat'>
{
conver.length > 0 && conver.map((data,key)=>{
return(
<div className='converContainer' key={key}  onClick={()=>{setcurrentChat(data)}}>
<Conversation key={data._id}  currentChat = {deleteConBtn} conversation = {data} currentUser = {globalAuthState}/>
</div>
)
})
}
</div>
</div>
{
  currentChat ? 
 <> <div className='Chat'>
    <div className='chatContainer'>
    {
      message.length > 0 && message.map((data,key)=>{
        return(
          <div key={key} className='chats' ref={scrollDown}>
          <ChatMessage key={data._id} message={data} own={data.senderId === globalAuthState.id}/>
          </div>
        )
      })
    }
    </div>
    <div className='inputContainer'>
      <input className='messageInput' onChange={(e)=>{setNewMessage(e.target.value)}} value={newMessage} type="text" />
     <button className='messageSubmit' onClick={sendMessage}>Send</button>
    </div>
    </div>
      </>
      :
      <span>Open a conversation</span> 
}
    </section>
  )
}

export default MessagePage
