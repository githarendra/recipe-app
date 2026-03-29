import { getSavedRecipes, getUserProfile, saveRecipe, updateUserProfile } from "../controllers/userController.js";
import express from "express";
import protect from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get('/saved', protect, getSavedRecipes);
router.post('/save/:recipeId', protect, saveRecipe);
router.put('/profile', protect, upload.single('avatar'), updateUserProfile);
router.get('/:id',getUserProfile);

export default router;