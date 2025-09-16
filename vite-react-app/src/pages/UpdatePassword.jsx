import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/operations/authApi";
import {AiOutlineEye,AiOutlineEyeInvisible} from 'react-icons/ai'
import { Link } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  function changeHandler(event) {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  const {password , confirmPassword} = formData;
  const submitHandler = (e) => {
    e.preventDefault();
    const token = location.pathname.split("/").at(-1);
    dispatch(resetPassword(password,confirmPassword, token,navigate));
  };
  return (
    <div className="flex items-center justify-center max-w-full min-h-screen">
      {loading ? (
        <div>Loading ...</div>
      ) : (
        <div className="flex flex-col h-full max-w-sm gap-3">
          <h1 className="text-3xl font-semibold leading-9 text-richblack-5">Choose new password</h1>
          <p className="self-stretch text-base font-normal text-richblack-100">Almost done. Enter your new password and youre all set.</p>
          <form onSubmit={submitHandler}>
            <label className="relative flex flex-col items-start w-full gap-2">
              <p className='text-sm font-normal text-richblack-5'> 
                New Password<sup className='text-sm font-normal text-pink-200'>*</sup>{" "}
              </p>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={changeHandler}
                placeholder="Enter Password"
                className='flex items-center w-full p-3 mb-2 rounded-lg text-richblack-5 bg-richblack-800 '
                    style={{boxShadow:' 0px -1px 0px 0px rgba(255, 255, 255, 0.18) inset'}}
              />
              <span
                className="absolute right-3 top-[38px] cursor-pointer "
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>

            <label className="relative flex flex-col items-start w-full gap-2 mb-5 ">
              <p className='text-sm font-normal text-richblack-5'>
                Confirm New Password<sup className='text-sm font-normal text-pink-200'>*</sup>{" "}
              </p>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={changeHandler}
                placeholder="Confirm New Password"
                className='flex items-center w-full p-3 rounded-lg text-richblack-5 bg-richblack-800 '
                    style={{boxShadow:' 0px -1px 0px 0px rgba(255, 255, 255, 0.18) inset'}}
              />
              <span
                className="absolute right-3 top-[38px] cursor-pointer "
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>
            <button type="submit" className='flex items-center self-stretch justify-center w-full gap-2 p-3 rounded-lg bg-yellow-50 ' style={{boxShadow:'-0.5px -1.5px 0px 0px rgba(0, 0, 0, 0.12) inset'} } >
              Reset Password
            </button>
          </form>
          <div className='flex items-center self-stretch gap-2 rounded-lg text-richblack-5 ' >
          <IoMdArrowBack />
              <Link to="/login">
                 <p>Back to Login</p>
              </Link>
           </div>
        </div>
      )}
    </div>
  );
};

export default UpdatePassword;
