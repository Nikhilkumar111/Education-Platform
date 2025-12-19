import {asyncHandler} from "../utils/asyncHandler.js";
import Subscription from "../models/Subscription.model.js";
import TeacherProfile from "../models/TeacherProfile.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import walletBalanceS from "../models/Wallet.model.js";

// ================= CREATE SUBSCRIPTION =================





export const createSubscription = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const { teacherId, purpose, duration = 1, mode, notes, subject } = req.body;

  // 0️⃣ ✅ Check if student already has 3 or more active subscriptions
  const activeSubscriptionsCount = await Subscription.countDocuments({
    student: studentId,
    status: "active",
  });

  if (activeSubscriptionsCount >= 3) {
    return res.status(400).json(
      new ApiResponse(
        400,
        null,
        "You cannot have more than 3 active subscriptions"
      )
    );
  }

  // 1️⃣ Find teacher profile
  const teacherProfile = await TeacherProfile.findById(teacherId);
  if (!teacherProfile) {
    return res.status(404).json(
      new ApiResponse(404, null, "Teacher profile not found")
    );
  }

  // 2️⃣ Calculate total amount
  const monthlyFee = teacherProfile.pricePerMonth || 0;
  const totalAmount = monthlyFee * duration;

  // 3️⃣ Fetch student wallet
  const studentWallet = await walletBalanceS.findOne({ user: studentId });
  if (!studentWallet || studentWallet.walletBalance < totalAmount) {
    return res.status(400).json(
      new ApiResponse(400, null, "Insufficient wallet balance")
    );
  }

  // 4️⃣ Fetch teacher wallet
  let teacherWallet = await walletBalanceS.findOne({ user: teacherId });
  if (!teacherWallet) {
    teacherWallet = await walletBalanceS.create({ user: teacherId, walletBalance: 0 });
  }

  // 5️⃣ Deduct student wallet
  studentWallet.walletBalance -= totalAmount;
  await studentWallet.save();

  // 6️⃣ Add to teacher wallet
  teacherWallet.walletBalance += totalAmount;
  await teacherWallet.save();

  // 7️⃣ Set subscription dates
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(startDate.getMonth() + duration);
  const graceEndDate = new Date(endDate);
  graceEndDate.setDate(endDate.getDate() + 10); // 10 days grace

  // 8️⃣ Create subscription
  const subscription = await Subscription.create({
    student: studentId,
    teacher: teacherProfile._id,
    purpose,
    duration,
    mode,
    notes,
    amount: totalAmount,
    status: "active",
    subject: subject || teacherProfile.subjectsChosen[0] || "General",
    paid: true,
    endDate,
    graceEndDate,
  });

  return res.status(201).json(
    new ApiResponse(201, { subscription }, "Teacher assigned successfully")
  );
});











export const getAllActiveSubscriptionForStudent = asyncHandler(async (req, res) => {
  const { id: studentId } = req.params;

  if (!studentId) {
    return res.status(400).json(
      new ApiResponse(400, null, "Student ID is required")
    );
  }

  const subscriptions = await Subscription.find({
    student: studentId,
    status: "active",
  })
    // Populate teacher → then populate user inside teacher to get name & email
    .populate({
      path: "teacher",
      populate: {
        path: "user", // this points to the actual User document
        select: "name email",
      },
      select: "subjectsChosen",
    })
    // Populate student → then populate user inside student to get name
    .populate({
      path: "student",
      populate: {
        path: "user",
        select: "name",
      },
    })
    .sort({ createdAt: -1 });

  if (!subscriptions || subscriptions.length === 0) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          studentId,
          studentName: null,
          assignedTeachers: [],
        },
        "No active subscriptions found"
      )
    );
  }

  // Extract student name safely
  const studentName = subscriptions[0]?.student?.user?.name || "me";

  const assignedTeachers = subscriptions.map((sub) => ({
    teacherId: sub.teacher?._id,
    teacherName: sub.teacher?.user?.name, // from nested user
    subject: sub.subject || sub.teacher?.subjectsChosen?.[0] || "General",
    email: sub.teacher?.user?.email, // from nested user
    subscriptionId: sub._id,
    endDate: sub.endDate,
    graceEndDate: sub.graceEndDate,
    amount: sub.amount,
    mode: sub.mode,
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        studentId,
        studentName,
        assignedTeachers,
      },
      "Student active subscriptions fetched successfully"
    )
  );
});





// export const  getAllSubscriptionForStudent = asyncHandler(async(req,res)=>{



// })








// export const getAllSubscriptionForTeacher = asyncHandler(async(req,res)=>{

// })




// export const updateSubscriptionForStudent = asyncHandler(async(req,res)=>{

// })

