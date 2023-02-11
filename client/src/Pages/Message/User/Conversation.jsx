import React, { useEffect, useState } from 'react'
import './Conversation.css'
import UserImg from './Images/5087579.png'
import  Axios  from 'axios';

function Conversation(props) {

let [user,setUser] = useState('');

// delete Conversation 
let deleteConBtn = async (id)=>{
  const friendsId =  props.conversation.members.find(data=>data !== props.currentUser.id)
props.currentChat(id,friendsId)
}

// get user data 
useEffect(()=>{
  const friendsId =  props.conversation.members.find(data=>data !== props.currentUser.id)
  const getUser = async ()=>{
let response = await Axios.get(`http://localhost:3001/User/get/${friendsId}`);
if(response.data.error){
  console.log(response.data.error)
}
else{
setUser(response.data)
}
  }
getUser();
},[props])


  return (
    <div  className='SomeUser'>

<img src={UserImg} alt=""/>
<p className='UserName'>{user.username}</p>
<button className='deleteConBtn' onClick={()=>{deleteConBtn(props.conversation._id)}}>Delete</button>
    </div>
  )
}

export default Conversation;
