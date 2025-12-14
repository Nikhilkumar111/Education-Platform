import crypto from "crypto";
import Studentwalletm from "../models/Wallet.model.js";
import { razorpay } from "../utils/razorpay.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "zod";

/**
 * CREATE RAZORPAY ORDER
 * POST /api/wallet/create-order
 */
export const StudentWallet = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  // ✅ Basic validation
  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid amount",
    });
  }

  // ✅ Create Razorpay order
  const order = await razorpay.orders.create({
    amount: amount * 100, // rupees → paise
    currency: "INR",
    receipt: `wallet_recharge_${Date.now()}`,
  });

  return res.status(200).json({
    success: true,
    order,
  });
});




export const VerifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
  } = req.body;

  const userId = req.user._id; // ✅ from auth middleware

  // ✅ Validate inputs
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !amount
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing payment details",
    });
  }

  // ✅ Verify signature
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment signature",
    });
  }

  // ✅ Find wallet OR create one
  let wallet = await Studentwalletm.findOne({ user: userId });

  if (!wallet) {
    wallet = await Studentwalletm.create({
      user: userId,
      walletBalance: 0,
    });
  }

  // ✅ Update balance
  wallet.walletBalance += Number(amount);
  await wallet.save();

  return res.status(200).json({
    success: true,
    walletBalance: wallet.walletBalance,
  });
});




export const getWalletBalance = async (req, res) => {
  const userId = req.user._id;

  let wallet = await Studentwalletm.findOne({ user: userId });

  // Create wallet if not exists
  if (!wallet) {
    wallet = await Studentwalletm.create({
      user: userId,
      walletBalance: 0,
    });
  }

  res.status(200).json({
    balance: wallet.walletBalance,
  });
};
