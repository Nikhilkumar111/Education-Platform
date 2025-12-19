import express from "express"

// POST   /api/subscriptions               → create subscription (student assigns teacher)
// GET    /api/subscriptions/student/:id   → get all subscriptions for a student
// GET    /api/subscriptions/teacher/:id   → get all subscriptions for a teacher
// GET    /api/subscriptions/active/:id    → get active subscription for a student
// PUT    /api/subscriptions/:id           → update subscription (status/payment) 


import { protect } from "../middleware/authMiddleware.js";
// import { authorizeRoles } from "../middleware/role.middleware.js";

// import { validate } from "../middleware/validate.js";
// import { teacherProfileSchema } from "../validations/teacher.validation.js";
// import validateObjectId from "../middleware/validateObjectId.middleware.js";

import {
createSubscription,
// getAllSubscriptionForStudent,
//  getAllSubscriptionForTeacher,
  getAllActiveSubscriptionForStudent,
//  updateSubscriptionForStudent,
}from "../controller/subscription.controller.js"



const router = express.Router();

// ================== TEACHER TEST ROUTES ==================

// Create a new test (Teacher only)
// , validate(createTestSchema)

// authorizeRoles("student")
router.post("/", protect, createSubscription);
//  authorizeRoles("student", "admin")

//complete information of the subscription 
// router.get("/student/:id", protect, getAllSubscriptionForStudent);

//  authorizeRoles("student")
router.get("/student/:id/active", protect, getAllActiveSubscriptionForStudent);



//  authorizeRoles("teacher", "admin")
// router.get("/teacher/:id", protect, getAllSubscriptionForTeacher);

//  authorizeRoles("student", "admin")

// router.put("/:id", protect, updateSubscriptionForStudent);


// Get all tests

export default router;