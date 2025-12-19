import StudentProfile from "../models/StudentProfile.model.js";
import User from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

//  Create student profile
//this will working well 
export const getStudentProfile = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id }).populate("user", "name email phone avatar"); // ✅ important
  console.log("Student profile is ", profile)
  if (!profile) {
    return res.status(404).json(new ApiResponse(404, null, "Profile not found"));
  }


  return res.status(200).json(new ApiResponse(200, { profile }, "Student profile fetched"));
});





// export const createStudentProfile = asyncHandler(async (req, res) => {
//   const userId = req.user._id;
//   const { grade, subjectsChosen, teacher, city, contactNumber } = req.body;

//   const existingProfile = await StudentProfile.findOne({ user: userId });
//   if (existingProfile) {
//     return res.status(409).json(new ApiResponse(409, null, "Student profile already exists"));
//   }

//   // Upload avatar if provided
//   let avatarUrl = req.user.avatar;
//   if (req.file) {
//     const uploaded = await uploadOnCloudinary(req.file.path, "image");
//     avatarUrl = uploaded.secure_url;
//     if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
//   }

//   const newProfile = await StudentProfile.create({
//     user: userId,
//     grade,
//     subjectsChosen,
//     teacher,
//     city,
//     contactNumber,
//     avatar: avatarUrl,
//   });

//   await User.findByIdAndUpdate(userId, { studentProfile: newProfile._id });

//   return res.status(201).json(new ApiResponse(201, { profile: newProfile }, "Student profile created"));
// });






//this will also working well 
//  Get current student profile


// export const updateStudentProfile = asyncHandler(async (req, res) => {
//   const updates = { ...req.body };

//   console.log("Update controller triggered");

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

//   // Update profile in DB
//   const updatedProfile = await StudentProfile.findOneAndUpdate(
//     { user: req.user._id },
//     updates,
//     { new: true, runValidators: true }
//   ).populate("user", "name email phone avatar"); // include user info




//   if (!updatedProfile) {
//     return res.status(404).json(new ApiResponse(404, null, "Profile not found"));
//   }

//   return res.status(200).json(
//     new ApiResponse(200, { profile: updatedProfile }, "Student profile updated")
//   );
// });
// **************************************************

export const updateStudentProfile = asyncHandler(async (req, res) => {
  const updates = { ...req.body };

  console.log("Update controller triggered");

  // 🔁 Parse subjectsChosen safely
  if (updates.subjectsChosen && typeof updates.subjectsChosen === "string") {
    try {
      updates.subjectsChosen = JSON.parse(updates.subjectsChosen);
    } catch (err) {
      console.error("Failed to parse subjectsChosen:", err);
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid subjectsChosen format"));
    }
  }

  // 🖼️ Handle avatar upload
  let avatarUrl;

  if (req.file) {
    try {
      const uploaded = await uploadOnCloudinary(req.file.path, "image");

      if (!uploaded?.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      avatarUrl = uploaded.secure_url;
      updates.avatar = avatarUrl;

      // cleanup local file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      // ✅ VERY IMPORTANT: update User avatar for navbar
      await User.findByIdAndUpdate(req.user._id, {
        avatar: avatarUrl,
      });

    } catch (err) {
      console.error("Avatar upload failed:", err);
      return res
        .status(500)
        .json(new ApiResponse(500, null, "Avatar upload failed"));
    }
  }

  // 🔄 Update Student Profile
  const updatedProfile = await StudentProfile.findOneAndUpdate(
    { user: req.user._id },
    updates,
    { new: true, runValidators: true }
  ).populate("user", "name email avatar");

  if (!updatedProfile) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Profile not found"));
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { profile: updatedProfile },
      "Student profile updated successfully"
    )
  );
});

// ****************************************************

























//  Get all students (teacher/admin)
export const getAllStudents = asyncHandler(async (req, res) => {
  const students = await StudentProfile.find().populate("user", "name email avatar");
  return res.status(200).json(new ApiResponse(200, { students }, "All students fetched"));
});




// ---------------------------------------------------------
// Teacher updates student metrics: performance, attendance, assignment
// ---------------------------------------------------------
export const teacherUpdateStudentMetrics = asyncHandler(async (req, res) => {
  const studentId = req.params.id;

  const { performance, attendance, assignment } = req.body;

  // Validate using Zod
  const parsed = teacherUpdateMetricsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(new ApiResponse(400, null, parsed.error.errors[0].message));
  }

  // Find student
  const student = await StudentProfile.findById(studentId);
  if (!student) {
    return res.status(404).json(new ApiResponse(404, null, "Student not found"));
  }

  // Update only given fields
  if (performance !== undefined) student.performance = performance;
  if (attendance !== undefined) student.attendance = attendance;
  if (assignment !== undefined) student.assignment = assignment;

  await student.save();

  return res.status(200).json(
    new ApiResponse(200, { student }, "Student metrics updated successfully")
  );
});





















// ✅ Delete student profile (admin only)
export const deleteStudentProfile = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findByIdAndDelete(req.params.id);
  if (!profile) return res.status(404).json(new ApiResponse(404, null, "Profile not found"));

  await User.findByIdAndUpdate(profile.user, { studentProfile: null });
  return res.status(200).json(new ApiResponse(200, null, "Student profile deleted"));
});
