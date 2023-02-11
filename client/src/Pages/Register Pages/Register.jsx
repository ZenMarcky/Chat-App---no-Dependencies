import React, { useContext } from 'react';
import './Register.css';
import {Link,useNavigate} from 'react-router-dom';
 import {useForm} from 'react-hook-form';
import Axios from 'axios';
import { UserAuthContext } from '../../helper/Context';

function Register() {

    let navigate = useNavigate();
// global useState
    const {globalAuthState,setGlobalAuthState} = useContext(UserAuthContext);
// for validation
    const {register,handleSubmit,formState:{errors}} = useForm();

// register function  
    async function onSubmit (data){
        let response = await Axios.post('http://localhost:3001/User/register',data);
        if(response.data.error){
          alert(response.data.error)
        }
        else{
          alert("Success")
          setGlobalAuthState({...globalAuthState,status:true})
          navigate('/')
        }
      }


  return (
    <section className='registerPages'>
    <form className='registerForm' onSubmit={handleSubmit(onSubmit)}>
     <h1 className='registerText'>Register</h1>
      <div className='inputForm'>
<p>Username</p>
<input placeholder='Type your email' type="text" {...register("username", { required: true})}/>
{errors.username && <span>This field is required</span>}
      </div>
      <div className='inputForm'>
<p>Email</p>
<input placeholder='Type your password' type="email" {...register("email", { required: true})}/>
{errors.email && <span>This field is required</span>}
      </div>
      <div className='inputForm'>
<p>Password</p>
<input placeholder='Type your password' type="password" {...register("password", { required: true})}/>
{errors.password && <span>This field is required</span>}
      </div>
      <input type="submit" className='formSubmitBtn' />
    <Link to={'/login'}>Already Have An Acoount?</Link>
    </form>

  </section>
  )
}

export default Register
