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

// export default mongoose.model("Studentwalletm", walletBalanceSchema);
const Studentwalletm = mongoose.model("Studentwalletm", walletBalanceSchema)

export default Studentwalletm;


// const User = mongoose.model("User", userSchema);
// export default User;
