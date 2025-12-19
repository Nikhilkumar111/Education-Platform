import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    grade: { type: String },
    school: { type: String },
    location: { type: String },

    // subjects student wants to learn
    subjectsChosen: [{ type: String }],

    // 💰 KEEP THIS EXACT (Razorpay depends on it)
    walletBalance: {
      type: Number,
      default: 0,
    },

// teacher: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "TeacherProfile",
// },

    // 🔗 NEW: assigned teachers handled via subscriptions
    subscriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
      },
    ],

    performance: { type: Number, default: 0 },
    attendance: { type: Number, default: 0 },
    assignment: { type: Number, default: 0 },
    achievements: [{ type: String }],

    Phone: { type: String },
    avatar: { type: String },
  },
  { timestamps: true }
);

const StudentProfile =
  mongoose.models.StudentProfile ||
  mongoose.model("StudentProfile", studentProfileSchema);

export default StudentProfile;
