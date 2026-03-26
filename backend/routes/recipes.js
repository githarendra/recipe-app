import { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, getRecipesByUser } from "../controllers/recipeController.js";
import express from "express";
import protect from "../middleware/auth.js"
import upload from "../middleware/upload.js";

const router = express.Router();

router.get('/', getRecipes);
router.get('/user/:userId', getRecipesByUser);
router.get('/:id', getRecipeById);

router.post('/', protect, upload.single('image'), createRecipe);
router.put('/:id', protect, upload.single('image'), updateRecipe);
router.delete('/:id', protect, deleteRecipe);

export default router;