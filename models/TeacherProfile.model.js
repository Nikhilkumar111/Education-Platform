import mongoose from "mongoose";

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
    phone: { type: String },

    ratings: { type: Number, default: 0 },
    offlineAvailable: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    avatar: { type: String },

    //  Wallet balance for earnings
    walletBalance: { type: Number, default: 0 },

    //  Assigned students via subscriptions
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudentProfile",
      },
    ],
    // models/teacher.model.js
pricePerMonth: {
  type: Number,
  required: true,
  min: 0,
},


    // Optional: history of subscriptions/payments
    subscriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
      },
    ],
  },
  { timestamps: true }
);

const TeacherProfile =
  mongoose.models.TeacherProfile ||
  mongoose.model("TeacherProfile", teacherProfileSchema);

export default TeacherProfile;
