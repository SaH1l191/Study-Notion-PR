const User = require("../models/User");
const Profile = require("../models/Profile")
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { trackEvent } = require("../utils/analytics");
require("dotenv").config();

// send OTP ka Handler likhna hai

exports.sendOTP = async (req, res) => {
  try {
    // fetch email from requests body
    //     The line const checkUserPresent = await User.findOne({ email }) does not use destructuring; instead, it uses an object shorthand syntax to create an object with a property named email. Here's a detailed breakdown of what's happening and why:

    // Explanation
    // Object Shorthand Syntax:

    // When you have a variable and you want to create an object where the property name is the same as the variable name, you can use shorthand syntax.
    // For example, { email } is a shorthand for { email: email }.
    // MongoDB Query:

    // The await User.findOne({ email }) query is using Mongoose to find a document in the User collection where the email field matches the value of the email variable.
    const { email } = req.body;
    // check if user already exist
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    // generate OTP using otp-generator library
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });
    console.log("OTP generated", otp);
    // check to otp is unique or not
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
        digits: true,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayLoad = { email, otp };
    // create an entry in db
    const otpBody = await OTP.create(otpPayLoad);
    console.log(otpBody);
    // return response success
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otpPayLoad
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// SignUp Handler

exports.signUp = async (req, res) => {
  try {
    // Data fetch from request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;
    // validate karlo
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    // 2 password match karlo
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password donot match retry",
      });
    }
    // check User already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: " User is already registered",
      });
    }

    // Find Most Recent OTP
    const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    console.log("recetntopsss ", recentOtp);
    // validate OTP
    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    } else if (otp !== recentOtp[0].otp) {
      return res.status(400).json({
        // ivalid otp
        success: false,
        message: "Invalid OTP",
      });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // profile
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });
    // Entry create in DB
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
    });
    // Track user registration event
    trackEvent('USER_REGISTERED', {
      userId: user._id,
      email: user.email,
      accountType: user.accountType,
      registrationMethod: 'email_otp'
    });

    // return res
    return res.status(200).json({
      success: true,
      message: "User is Registered Successfully",
      user,
      recentOtp,
      metrics: {
        platformUsers: "Growing user base",
        securityFeatures: "OTP verification, JWT authentication",
        responseTime: `${Date.now() - (req.startTime || Date.now())}ms`
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "user cannot be registered please try again",
    });
  }
};

// Login Handler

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validate the data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required , please try again",
      });
    }
    // user check exist or not
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return user.status(401).json({
        success: false,
        message: "User is not registered,please signup first",
      });
    }
    // generate JWT, after password matching
    if (await bcrypt.compare(password, user.password)) {
      const payLoad = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payLoad, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      user.token = token;
      user.password = undefined;
      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      // create cookie and send response
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Login Failure , please try again",
    });
  }
};

exports.getUser= async (req, res) => {
  try{
    
  }catch(error){
    return res.status(500).json({
      success: false,
      message: "getUser Details error  , please try again",
    });
  }

}

// Change Password Handler
exports.changePassword = async (req, res) => {
  try {
    // fetch data
    const { email, oldPassword, newPassword, confirmPassword } = req.body;
    // validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not registered",
      });
    }
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "current password do not match",
      });
    }
    // user exists so compare oldpass & storedpass
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }
    // now hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // send mail that password has been updated
    await mailSender(email, "Password Updated Confirmation", "Go to Login");
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
