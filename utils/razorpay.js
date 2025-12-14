import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});


// RAZORPAY_KEY_ID=rzp_test_Bfn1uxrkPmW4RI
// RAZORPAY_SECRET=NjkWxcOSIoYj5c6sqhMosCfL
