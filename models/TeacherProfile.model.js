import mongoose from "mongoose";
import { string } from "zod";

const teacherProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   subjectsChosen: [{ type: String }],
    qualification: { type: String },
    experience: { type: Number, default: 0 },
    bio: { type: String },
    location: { type: String },
    phone:{type:String},
    // address: { type: String },
    ratings: { type: Number, default: 0 },
    offlineAvailable: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    avatar: { type: String },
    Balance:{type:String ,default:0}
  },
  { timestamps: true }
);

const TeacherProfile =
  mongoose.models.TeacherProfile ||
  mongoose.model("TeacherProfile", teacherProfileSchema);

export default TeacherProfile;
