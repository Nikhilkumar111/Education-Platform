import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    grade: { type: String }, // className from frontend
    subjectsChosen: [{ type: String }],
    school: { type: String },
    location: { type: String }, // location from frontend
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
    },
    performance: { type: Number, default: 0 },
    attendance: { type: Number, default: 0 },
    assignment: { type: Number, default: 0 },
    achievements: { type: [String] },
    walletBalance: { type: Number, default: 0 },
    contactNumber: { type: String },
    avatar: { type: String },
  },
  { timestamps: true }
  
);

const StudentProfile =
  mongoose.models.StudentProfile ||
  mongoose.model("StudentProfile", studentProfileSchema);

export default StudentProfile;
