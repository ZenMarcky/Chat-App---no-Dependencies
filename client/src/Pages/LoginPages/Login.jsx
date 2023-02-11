import React, { useEffect,useContext } from 'react';
import './Login.css';
import {Link,useNavigate} from 'react-router-dom';
 import {useForm} from 'react-hook-form';
import Axios from 'axios';
import { UserAuthContext } from '../../helper/Context';



function Login() {

let navigate = useNavigate();
const {globalAuthState,setGlobalAuthState} = useContext(UserAuthContext);

// For validation
  const {register,handleSubmit,formState:{errors}} = useForm();

// Login function
 async function onSubmit (data){
  let response = await Axios.post('http://localhost:3001/User/login',data);
  if(response.data.error){
    alert(response.data.error)
  }
  else{
    alert("Success")
    setGlobalAuthState({
      ...globalAuthState,
   status : true
    })
    navigate('/')
  }
}

  return (
    <section className='loginPages'>
      <form className='loginForm' onSubmit={handleSubmit(onSubmit)}>
       <h1 className='loginText'>Login</h1>
        <div className='inputForm'>
<p>Email</p>
<input placeholder='Type your email' type="email" {...register("email", { required: true})}/>
{errors.email && <span>This field is required</span>}
        </div>
        <div className='inputForm'>
<p>Password</p>
<input placeholder='Type your password' type="password" {...register("password", { required: true})}/>
{errors.password && <span>This field is required</span>}
        </div>

        <input type="submit" className='formSubmitBtn' />
      <Link to={'/register'}>register here</Link>
      </form>

    </section>
  )
}

export default Login;
