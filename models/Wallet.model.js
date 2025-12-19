import mongoose from "mongoose";

const walletBalanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  walletBalance: {
    type: Number,
    default: 0,
  },

}, { timestamps: true });


const walletBalanceS = mongoose.model("walletBalanceS", walletBalanceSchema)

export default walletBalanceS;

