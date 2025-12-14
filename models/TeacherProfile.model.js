import mongoose from "mongoose";

const teacherProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subjects: [{ type: String }],
    qualification: { type: String },
    experience: { type: Number, default: 0 },
    bio: { type: String },
    city: { type: String },
    address: { type: String },
    ratings: { type: Number, default: 0 },
    offlineAvailable: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    avatar: { type: String },
  },
  { timestamps: true }
);

const TeacherProfile =
  mongoose.models.TeacherProfile ||
  mongoose.model("TeacherProfile", teacherProfileSchema);

export default TeacherProfile;
