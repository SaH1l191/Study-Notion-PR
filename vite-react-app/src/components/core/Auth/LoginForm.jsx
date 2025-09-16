import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../../../services/operations/authApi"


function LoginForm(){

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const { email, password } = formData


  function handleOnChange(e) {
    console.log(formData)
    setFormData( (prevData) =>({ ...prevData , [e.target.name] : e.target.value })                        
)
}

  
  function handleOnSubmit(e){
    e.preventDefault()
    dispatch(login(email, password, navigate))
  }

  return (

    <form onSubmit = {handleOnSubmit} className="flex flex-col w-full mt-6 gap-y-4">

        <label className='w-full'>
            <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'> Email Address <sup className='text-pink-200'>*</sup>  </p>
            <input required type="text"  value = {email} onChange={handleOnChange} placeholder="Enter email address" name="email"   className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] shadow-[0px_2px_2px_-1px_white]' />
        </label>

        <label className='relative'>
            <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>  Password <sup className='text-pink-200'>*</sup>  </p>
            <input required type= {showPassword ? ("text") : ("password")}  value = {password} onChange={handleOnChange} placeholder="Enter Password" name="password"  className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] shadow-[0px_2px_2px_-1px_white]' />   

            <span className='absolute right-3 top-[38px] cursor-pointer'  onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? (<AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF'/>) : (<AiOutlineEye fontSize={24} fill='#AFB2BF'/>)}  
            </span>                                                                        
            
            <Link to="/forgot-password"> <p className='mt-1 ml-auto text-xs text-blue-100 w-10%'> Forgot Password </p> </Link>
            
        </label>

        <button className='bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6'> Sign In </button>
    
    </form>
 
 )}


 
export default LoginForm