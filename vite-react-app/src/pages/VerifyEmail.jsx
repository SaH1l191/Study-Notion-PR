import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OTPInput from "react-otp-input";
import { sendOtp, signUp } from "../services/operations/authApi";
import { useNavigate, Link } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { PiArrowsCounterClockwise } from "react-icons/pi";


const VerifyEmail = () => {
  const { signupData, loading } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, []);

  function submitHandler(e) {
    e.preventDefault();
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;
    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
  }
  return (
    <div className="flex items-center justify-center max-w-full min-h-screen">
      {!loading ? (
        <div className="flex flex-col h-full max-w-sm gap-3">
          <h1 className="text-3xl font-semibold leading-9 text-richblack-5">
            Verify Email
          </h1>
          <p className="self-stretch text-base font-normal text-richblack-100">
          A verification code has been sent to you. Enter the code below
          </p>
          <form onSubmit={submitHandler} className="flex flex-col gap-5">
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span>-</span>}
              renderInput={(props) => <input {...props} />}
              containerStyle={{
                display: "flex",
                alignItems : "center",
                gap: "4px",
                marginTop: "5px", // Adjust as needed
              }}
              inputStyle={{
                width: "50px", // Adjust as needed
                height: "50px", 
                borderRadius: "8px", 
                backgroundColor: "#161D29", 
                color: "#999DAA", 
                border: "none", // Remove the border
                boxShadow: "0px -1px 0px 0px rgba(255, 255, 255, 0.18) inset",
                textAlign: "center",
                fontSize: "16px", 
              }}
              focusStyle={{ outline: "none" }} // Disable focus outline
            />
            <button
              type="submit"
              className="flex items-center self-stretch justify-center w-full gap-2 p-3 rounded-lg bg-yellow-50 "
              style={{
                boxShadow: "-0.5px -1.5px 0px 0px rgba(0, 0, 0, 0.12) inset",
              }}
            >
              Verify Email
            </button>
          </form>
          <div className="flex justify-between">
            <div className='flex items-center self-stretch gap-2 rounded-lg text-richblack-5 '>
            <IoMdArrowBack />
              <Link to="/login">
                <p className='text-base font-medium text-center'>Back to Login</p>
              </Link>
            </div>
            <button
              onClick={() => dispatch(sendOtp(signupData.email, navigate))}
              className="flex items-center gap-1 text-blue-200"
            >
            <PiArrowsCounterClockwise />
              Resend it
            </button>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default VerifyEmail;
