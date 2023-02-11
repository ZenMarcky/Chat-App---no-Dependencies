import './App.css';
import React , {useEffect, useState,useRef} from 'react'
import {Routes,Route,BrowserRouter,Link} from 'react-router-dom';
import  Axios from 'axios';
import { UserAuthContext } from './helper/Context';
import MessagePage from './Pages/Message/MessagePages/MessagePage';
import Login from './Pages/LoginPages/Login';
import Register from './Pages/Register Pages/Register';
import Notfound from './Pages/PageNotFound/Notfound';
import Home from './Pages/HomePage/Home';
import PeoplePages from './Pages/PeoplePages/PeoplePages';
import {io} from 'socket.io-client'


function App() {
  // credential for cookies
  Axios.defaults.withCredentials = true;
const socket = useRef();

//global useState
let [globalAuthState,setGlobalAuthState] = useState({
  username: "",
  email: "",
  id:"",
  status: false

});

// notfication State
let [notification,setNotification] = useState([])

// getNewMessage as Notification
useEffect(()=>{
  socket.current = io("ws://localhost:3001")
  socket.current.on("getMessage",(data)=>{
setNotification([...notification,data])
})
  },[socket])

  //add User in SocketIo
  useEffect(()=>{
    socket.current.emit("addUser",globalAuthState.id)
    },[globalAuthState])
    

// Authenticate User if Token is valid
useEffect(()=>{
let authUserData = async ()=>{
let response = await Axios.get('http://localhost:3001/User/auth');
if(response.data.error){
  setGlobalAuthState({...globalAuthState,status:false});
}
else{
 setGlobalAuthState({
  ...globalAuthState,
  username:response.data.username,
  email: response.data.email,
  id: response.data.id,
status: true
 })
}
}
authUserData();
},[globalAuthState])

/// Logout
let logOut = async ()=>{
  let response = await Axios.get('http://localhost:3001/User/deletecookie')
if(response){
  setGlobalAuthState({...globalAuthState,
    username: "",
      email: "",
      id:0,
      status: false
  });
  alert('Logout Successful')
}

}
  return (
   <React.Fragment>
    <UserAuthContext.Provider value={{globalAuthState,setGlobalAuthState}}>
<BrowserRouter>
<nav className='navBar'>
  <ul className='navLink'>
    <li><Link to={'/'}>Home</Link></li>
   {
    globalAuthState.status ? 
    <><li><Link to={'/people'}>People</Link></li>
    <li><Link onClick={()=>{setNotification('')}} className='navMessage' to={'/message'}>Message{notification.length > 0 ? <><span className='notifyAlert'>!</span> <span className='notifyMessage'>New Message</span>  </>: ""}</Link></li>
    <li><Link to={'/'}>{globalAuthState.username}</Link></li> 
    <li><Link to={'/'} onClick={logOut}>Logout</Link></li></>  
    :   
    <> <li><Link to={'/login'}>Login</Link></li>
    <li><Link to={'/register'}>Register</Link></li></>
   }
  </ul>
  </nav>

<Routes>

<Route path='/' exact  element={<Home/>} />
<Route path='*' exact  element={<Notfound/>} />
{
  globalAuthState.status ? 
  <><Route path='/people' exact  element={<PeoplePages socket={socket}/>} />
  <Route path='/message' exact  element={<MessagePage socket={socket} />} /></>
  : 
  <><Route path='/login' exact  element={<Login/>} />
  <Route path='/register' exact  element={<Register/>} /></>
}
</Routes>
</BrowserRouter>
</UserAuthContext.Provider>
   </React.Fragment>
  );
}

export default App;
