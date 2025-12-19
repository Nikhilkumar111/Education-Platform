import User from "../models/User.model.js";
import TeacherProfile from "../models/teacherProfile.model.js";
import StudentProfile from "../models/studentProfile.model.js";

import  {asyncHandler}  from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendToken } from "../utils/sendToken.js";
import fs from "fs";



/* -------------------------------- REGISTER -------------------------------- */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role  } = req.body;

  console.log("Incoming Registration:", { name, email, role });

  // Validate required fields
  if (!name || !email || !password || !role ) {
    console.log()
    return res
      .status(400)
      .json(new ApiResponse(400, null, " All fields including  are required"));
  }

  // Check if user already exists
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return res
      .status(409)
      .json(new ApiResponse(409, null, " User with this email already exists"));
  }

  // Validate and upload avatar
  const avatarFile = req.file;
  if (!avatarFile) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, " Avatar image is required"));
  }

  const uploadedAvatar = await uploadOnCloudinary(avatarFile.path, "image");
  if (fs.existsSync(avatarFile.path)) fs.unlinkSync(avatarFile.path);

  // Create new user
  const newUser = await User.create({
    name,
    email,
    password,
  
    role,
    avatar: uploadedAvatar.secure_url,
  });

  // Send JWT token & response via helper
  return sendToken(newUser, res, 201, "🎉 User registered successfully!");
});
// **************************************forget password with the collective email so update the










/* ---------------------------------- LOGIN --------------------------------- */
// export const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   console.log("Login Attempt:", { email });

//   if (!email || !password) {
//     return res
//       .status(400)
//       .json(new ApiResponse(400, null, "Email and password are required"));
//   }

//   const user = await User.findOne({ email }).select("+password");
//   if (!user) {
//     return res
//       .status(401)
//       .json(new ApiResponse(401, null, " Invalid email or password"));
//   }

//   const isPasswordCorrect = await user.matchPassword(password);
//   if (!isPasswordCorrect) {
//     return res
//       .status(401)
//       .json(new ApiResponse(401, null, " Invalid email or password"));
//   }

//   // Send token and response via sendToken
//   return sendToken(user, res, 200, "🎉 User logged in successfully!");
// });




export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Validate
  if (!email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Email and password are required"));
  }

  // 2️⃣ Find user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid email or password"));
  }

  // 3️⃣ Check password
  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid email or password"));
  }

  // 4️⃣ STUDENT PROFILE
  if (user.role === "student") {
    const studentProfile = await StudentProfile.findOne({ user: user._id });

    if (!studentProfile) {
      await StudentProfile.create({
        user: user._id,
        location: user.location || "",
        grade: user.grade || "",
        email: user.email || "",
        achievements: [],
        avatar: user.avatar || "",
        contactNumber: user.phone || "",
      });
    }
  }

  // 5️⃣ TEACHER PROFILE ✅ CORRECTED
  if (user.role === "teacher") {
    const teacherProfile = await TeacherProfile.findOne({ user: user._id });

    if (!teacherProfile) {
      await TeacherProfile.create({
        user: user._id,
        subjects: [],
        qualification: "",
        experience: 0,
        bio: "",
        avatar: user.avatar || "",
        verified: false,
        offlineAvailable: true,
        pricePerMonth: 0, // ✅ DEFAULT ONLY
      });
    }
  }

  // 6️⃣ Send token
  return sendToken(user, res, 200, "Login successful");
});





















/* ----------------------------- GET MY PROFILE ----------------------------- */
export const getMyProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User profile fetched successfully"));
});




/* ------------------------------ GET ALL USERS ----------------------------- */
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, { users }, "All users fetched successfully"));
});

/* --------------------------------- LOGOUT --------------------------------- */
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", { maxAge: 0, httpOnly: true });
  console.log("Logged out successfully")
  return res
    .status(200)
    .json(new ApiResponse(200, null, " Logged out successfully"));
});
