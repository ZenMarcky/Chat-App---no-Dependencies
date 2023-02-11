import React, { useEffect, useState,useContext } from 'react';
import './PeoplePages.css'
import Axios  from 'axios';
import {UserAuthContext} from '../../helper/Context'



function PeoplePages({socket}) {

let [allUser,setAllUser] = useState([])
const {globalAuthState} = useContext(UserAuthContext);
let [search,setSearch] = useState('')


useEffect(()=>{
let getAllUser = async ()=>{
let response = await Axios.get('http://localhost:3001/User/get/')
if(response.data.error){
   alert(response.data.error)
}
else{
    setAllUser(response.data)
}
}
getAllUser()
},[])


let addToConversation = async (id)=>{
  let response = await Axios.post('http://localhost:3001/conver/',{userToadd:id})
  if(response.data.error){
    alert(response.data.error)
  }
  else{
    alert("Add Success")
    socket.current.emit("newConversation",{
      _id : id
    })
  }
  }

  return (
    <section className='PeoplPages'>
    
<div className='PeopleCard'>
<div className='CardSearch'>
<input onChange={(e)=>{setSearch(e.target.value)}} placeholder='Search People' type="search" />
</div>
<div className='CardUserList'>
{
  allUser.length > 0 &&  allUser.filter((data)=>{return search.toLowerCase() === '' ? data: data.username.toLowerCase().includes(search)}).map((data)=>{
    return(
      <div key={data._id} className='UserCard'>
  {
    data._id === globalAuthState.id ?   <p>{data.username} (You)</p> :   <p>{data.username}</p>
  }
   {
    data._id !== globalAuthState.id ?  <button onClick={()=>{addToConversation(data._id)}}>Add User</button> : ""
   }
</div>
    )
  })
}

</div>
</div>

    </section>
  )
}

export default PeoplePages
