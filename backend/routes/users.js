import { getUserProfile, updateUserProfile } from "../controllers/userController.js";
import express from "express";
import protect from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get('/:id',getUserProfile);
router.put('/profile', protect, upload.single('avatar'), updateUserProfile);

export default router;