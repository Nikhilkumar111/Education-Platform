import TeacherProfile from "../models/TeacherProfile.model.js"
import User from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";



// this routes will worked very well so handle it 

// export const createTeacherProfile = asyncHandler(async (req, res) => {
//   const userId = req.user._id;

//   // Fix subjects array when sent as JSON in form-data
//   // for the subject which is sended by users in string type 
//   let subjects = req.body.subjects;
//   if (typeof subjects === "string") {
//     try {
//       subjects = JSON.parse(subjects);
//     } catch {
//       return res.status(400).json(new ApiResponse(400, null, "Invalid subjects format, expected array"));
//     }
//   }

//   const { qualification, experience, bio, city, address, offlineAvailable } = req.body;

//   if (!subjects || !qualification || !bio || !city || !address) {
//     return res.status(400).json(new ApiResponse(400, null, "All fields are required"));
//   }

//   const existingProfile = await TeacherProfile.findOne({ user: userId });
//   if (existingProfile) {
//     return res.status(409).json(new ApiResponse(409, null, "Teacher profile already exists"));
//   }

//   let avatarUrl = req.user.avatar;
//   if (req.file) {
//     const uploaded = await uploadOnCloudinary(req.file.path, "image");
//     avatarUrl = uploaded.secure_url;
//     if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
//   }

//   const newProfile = await TeacherProfile.create({
//     user: userId,
//     subjects,
//     qualification,
//     experience: experience || 0,
//     bio,
//     city,
//     address,
//     offlineAvailable: offlineAvailable ?? true,
//     avatar: avatarUrl,
//   });

//   await User.findByIdAndUpdate(userId, { teacherProfile: newProfile._id });

//   return res.status(201).json(new ApiResponse(201, { profile: newProfile }, "Teacher profile created"));
// });





















//this will working well

// ✅ Get current teacher profile
export const getTeacherProfile = asyncHandler(async (req, res) => {
  const profile = await TeacherProfile.findOne({ user: req.user._id }).populate("user", "name email phone avatar");
    console.log("Teacher profile is ", profile)
  if (!profile) return res.status(404).json(new ApiResponse(404, null, "Profile not found"));
  return res.status(200).json(new ApiResponse(200, { profile }, "Teacher profile fetched"));
});






//  Update teacher profile
// export const updateTeacherProfile = asyncHandler(async (req, res) => {
//   const updates = { ...req.body };
// console.log("Update controller triggered");


//   // If subjectsChosen is sent as string, parse it
//   if (updates.subjectsChosen && typeof updates.subjectsChosen === "string") {
//     try {
//       updates.subjectsChosen = JSON.parse(updates.subjectsChosen);
//     } catch (err) {
//       console.error("Failed to parse subjectsChosen:", err);
//       return res.status(400).json(new ApiResponse(400, null, "Invalid subjectsChosen format"));
//     }
//   }


//   // Handle avatar upload if file exists
//   if (req.file) {
//     try {
//       const uploaded = await uploadOnCloudinary(req.file.path, "image");
//       updates.avatar = uploaded.secure_url;
//       if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
//     } catch (err) {
//       console.error("Avatar upload failed:", err);
//       return res.status(500).json(new ApiResponse(500, null, "Avatar upload failed"));
//     }
//   }

//  // Update profile in DB
//   const updatedProfile = await TeacherProfile.findOneAndUpdate(
//     { user: req.user._id },
//     updates,
//     { new: true, runValidators: true }
//   ).populate("user", "name email phone avatar"); // include user info

//   if (!updatedProfile) {
//     return res.status(404).json(new ApiResponse(404, null, "Profile not found"));
//   }

//   return res.status(200).json(
//     new ApiResponse(200, { profile: updatedProfile }, "Teacher profile updated")
//   );
// });

// *******************************************************
// Update teacher profile
export const updateTeacherProfile = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  console.log("Update controller triggered");

  /* ================= SUBJECTS ================= */
  if (updates.subjectsChosen && typeof updates.subjectsChosen === "string") {
    try {
      updates.subjectsChosen = JSON.parse(updates.subjectsChosen);
    } catch (err) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid subjectsChosen format"));
    }
  }

  /* ================= PRICE PER MONTH ================= */
  if (updates.pricePerMonth !== undefined) {
    const parsedPrice = Number(updates.pricePerMonth);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, null, "pricePerMonth must be a valid number")
        );
    }
    updates.pricePerMonth = parsedPrice;
  }

  /* ================= AVATAR ================= */
  let newAvatarUrl = null;
  if (req.file) {
    try {
      const uploaded = await uploadOnCloudinary(req.file.path, "image");
      newAvatarUrl = uploaded.secure_url;
      updates.avatar = newAvatarUrl;

      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    } catch (err) {
      return res
        .status(500)
        .json(new ApiResponse(500, null, "Avatar upload failed"));
    }
  }

  /* ================= UPDATE TEACHER PROFILE ================= */
  const updatedProfile = await TeacherProfile.findOneAndUpdate(
    { user: req.user._id },
    updates,
    { new: true, runValidators: true }
  ).populate("user", "name email phone avatar");

  if (!updatedProfile) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Profile not found"));
  }

  /* ================= UPDATE USER AVATAR ================= */
  if (newAvatarUrl) {
    await User.findByIdAndUpdate(req.user._id, { avatar: newAvatarUrl });
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { profile: updatedProfile },
      "Teacher profile updated"
    )
  );
});










//  Get all teachers (students/admin can view)
export const getAllTeachers = asyncHandler(async (req, res) => {
  const teachers = await TeacherProfile.find().populate("user", "name email avatar");
  return res.status(200).json(new ApiResponse(200, { teachers }, "All teachers fetched"));
});




export const getTeacherById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const teacher = await TeacherProfile.findById(id).populate("user", "name email avatar");


  if (!teacher) {
    return res.status(404).json(new ApiResponse(404, null, "Teacher not found"));
  }

  return res.status(200).json(
    new ApiResponse(200, { teacher }, "Teacher Profile fetched")
  );
});













//  Delete teacher profile (admin only)
export const deleteTeacherProfile = asyncHandler(async (req, res) => {
  const profile = await TeacherProfile.findByIdAndDelete(req.params.id);
  if (!profile) return res.status(404).json(new ApiResponse(404, null, "Profile not found"));

  // Remove reference from User
  await User.findByIdAndUpdate(profile.user, { teacherProfile: null });

  return res.status(200).json(new ApiResponse(200, null, "Teacher profile deleted"));
});
