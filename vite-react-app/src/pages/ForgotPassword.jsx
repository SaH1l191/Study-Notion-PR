import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { getPasswordResetToken } from '../services/operations/authApi';
import { IoMdArrowBack } from "react-icons/io";

const ForgotPassword = () => {
 
  const [emailSent,setEmailSent] = useState(false);
  const [email,setEmail] = useState("");
  const {loading} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();

  function submitHandler(event){
    event.preventDefault();
    dispatch(getPasswordResetToken(email,setEmailSent));
  }
  return (
    <div className='flex items-center justify-center min-h-screen gap-8 bg-richblack-900 font-inter '>
       {
        loading ? (
          <div>Loading...</div> 
        ) : (<div className='flex flex-col max-w-md gap-4'>
           <h1 className='text-3xl font-semibold leading-9 text-richblack-5 md:max-w-md'>
              {
                !emailSent ? "Reset your Password" : "Check Your Email"
              }
           </h1>
           <p className='self-stretch text-base font-normal text-richblack-100'>
            {
              !emailSent ? "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery" :
               `We have sent the reset email to ${email}`
            }
           </p>
           <form onSubmit={submitHandler} className='flex flex-col items-start w-full gap-6'>
            {
              !emailSent && (
                <label className='flex flex-col items-start w-full gap-1'>
                  <p className='text-sm font-normal text-richblack-5'  >Email Address <sup className='text-sm font-normal text-pink-200'>*</sup></p>
                  <input
                    required
                    type='email'
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter Your Email Address'
                    className='flex items-center w-full p-3 rounded-lg text-richblack-5 bg-richblack-800 '
                    style={{boxShadow:' 0px -1px 0px 0px rgba(255, 255, 255, 0.18) inset'}}
                 />
                </label>
              )
            }
            <button type='submit' className='flex items-center self-stretch justify-center w-full gap-2 p-3 rounded-lg bg-yellow-50 ' style={{boxShadow:'-0.5px -1.5px 0px 0px rgba(0, 0, 0, 0.12) inset'} }>
              {
                !emailSent ? "Reset Password" : "Resend Email"    
              }
            </button>
           </form>
           <div className='flex items-center self-stretch gap-2 rounded-lg text-richblack-5 '>
              <IoMdArrowBack />
              <Link to="/login">
                 <p className='text-base font-medium text-center'>Back to Login</p>
              </Link>
           </div>
        </div>)
       } 
    </div>
  )
}

export default ForgotPassword