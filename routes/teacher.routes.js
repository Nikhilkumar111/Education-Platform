import express from "express"

import {
  // createTeacherProfile,
  getTeacherProfile,
  updateTeacherProfile,
  getAllTeachers,
  getTeacherById,
  deleteTeacherProfile,
} from "../controller/teacher.controller.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { validate } from "../middleware/validate.js";
import { teacherProfileSchema } from "../validations/teacher.validation.js";
import validateObjectId from "../middleware/validateObjectId.middleware.js";

const router = express.Router();

/* --------------------------------------------------
   CREATE TEACHER PROFILE (Teacher Only)
--------------------------------------------------- */
// tested working well 
// router.post(
//   "/",
//   protect,
//   authorizeRoles("teacher"),
//   upload.single("avatar"),
//   // validate(teacherProfileSchema),
//   createTeacherProfile
// );

/* --------------------------------------------------
   GET CURRENT TEACHER PROFILE
--------------------------------------------------- */
// tested working well 
router.get(
  "/me",
  protect,
  authorizeRoles("teacher"),
  getTeacherProfile
);



/* --------------------------------------------------
   UPDATE TEACHER PROFILE (Teacher Only)
--------------------------------------------------- */
router.put(
  "/update",
  protect,
  authorizeRoles("teacher"),
  upload.single("avatar"),
  // validate(teacherProfileSchema), // allow partial updates
  updateTeacherProfile
);

/* --------------------------------------------------
   GET ALL TEACHERS (Any Logged-in User)
--------------------------------------------------- */
router.get("/", protect, getAllTeachers);


// ***************get Teacher profile to student*************
router.get("/:id",protect,getTeacherById);











/* --------------------------------------------------
   DELETE TEACHER PROFILE (Admin Only)
--------------------------------------------------- */
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  validateObjectId("id"),
  deleteTeacherProfile
);

export default router;
