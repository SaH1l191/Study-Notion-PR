import React from 'react'
import SignupForm from '../../../components/core/Auth/SignupForm'
import LoginForm from '../../../components/core/Auth/LoginForm'
import grame from '../../../assets/Images/frame.png'
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../services/operations/authApi';

const GUEST_INSTRUCTOR = {
  email: "random1@gmail.com",
  password: "123456"
};
const GUEST_STUDENT = {
  email: "r@gmail.com",
  password: "123456"
};

const Template = ({ title, desc1, desc2, image, formtype }) => {    
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGuestLogin = (role) => {
    if (role === "instructor") {
      dispatch(login(GUEST_INSTRUCTOR.email, GUEST_INSTRUCTOR.password, navigate));
    } else {
      dispatch(login(GUEST_STUDENT.email, GUEST_STUDENT.password, navigate));
    }
  };

    //  const {loading } = useSelector((state)=>state.auth)
    return (

        <div className="flex w-11/12 py-12 mx-auto gap-y-12 justify-between max-w-[1160px] ">
            <div className="w-11/12 max-w-[450px] mx-0 ">
                <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">{title}</h1>
                <p className="text-[1.125rem] leading-[1.625rem] mt-4">
                    <span className="text-richblack-100">{desc1}</span><br></br>
                    <span className="italic text-blue-100">{desc2}</span>
                </p>
                {formtype === "signup" ?

                    (<SignupForm />) : (<LoginForm />)}

                <div className="flex flex-row items-center w-full my-4 text-richblack-700 gap-x-2 ">
                    <div className="h-[1px] bg-richblack-700 w-full"></div> <p className="text-richblack-700 font-medium leading[1.375rem]">OR</p> <div className="h-[1px] bg-richblack-700 w-full"></div>
                </div>
                <button 
                onClick={() => handleGuestLogin("instructor")}
                className="w-full flex justify-center items-center rounded-[8px] font-medium text-richblack-100 border border-richblack-700 px-[12px]
        py-[8px] gap-x-2 mt-6">
                    <p>Demo Login As GuestInstructor</p>
                </button>
                <button 
                onClick={() => handleGuestLogin("student")}
                className="w-full flex justify-center items-center rounded-[8px] font-medium text-richblack-100 border border-richblack-700 px-[12px]
        py-[8px] gap-x-2 mt-6">
                    <p>Demo Login As GuestStudent </p>
                </button>
            </div>

            <div className="relative w-11/12 max-w-[450px] ">
                <img src={grame} width={558} height={504} loading="lazy" />
                <img className="absolute -top-4 right-4 " src={image} width={558} height={490} loading="lazy" />
            </div>
        </div>
    )
}
export default Template