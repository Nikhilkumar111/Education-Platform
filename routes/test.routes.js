import express from "express";
import {
  createTest,
  // getTestById,
  // updateTest,
  // deleteTest,
  getAllTests,
  // assignTestToStudents,
} from "../controller/test.controller.js";

import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { createTestSchema, updateTestSchema, assignTestSchema } from "../validations/test.validation.js";
import validateObjectId from "../middleware/validateObjectId.middleware.js";

const router = express.Router();

// ================== TEACHER TEST ROUTES ==================

// Create a new test (Teacher only)
// , validate(createTestSchema)
router.post("/create", protect, authorizeRoles("teacher"), createTest);

// Get all tests
router.get("/all", protect, authorizeRoles("teacher"), getAllTests);

// Get single test by ID
// router.get("/:id", protect, getTestById); // Uncomment when getTestById is implemented

// Update a test (Teacher only)
// router.put("/:id", protect, authorizeRoles("teacher"), validate(updateTestSchema), updateTest); // Uncomment when updateTest is implemented

// Delete a test (Teacher only)
// router.delete("/:id", protect, validateObjectId("id"), authorizeRoles("teacher"), deleteTest); // Uncomment when deleteTest is implemented

// Assign test to students (Teacher only)
// router.post("/:id/assign", protect, authorizeRoles("teacher"), validate(assignTestSchema), assignTestToStudents); // Uncomment when assignTestToStudents is implemented

export default router;
