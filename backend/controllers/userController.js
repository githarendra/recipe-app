import cloudinary from '../config/cloudinary.js'
import User from "../models/User.js";
import Recipe from "../models/Recipe.js";
import { selectFields } from 'express-validator/lib/field-selection.js';

export const getUserProfile = async (req,res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        const recipes = await Recipe.find({author:req.params.id}).populate('author', 'name avatar').sort({createdAt:-1});

        res.json({user,recipes});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateUserProfile = async (req,res) => {
    try {
        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        const {name, bio, password} = req.body;

        user.name = name || user.name;
        user.bio = bio || user.bio;

        if (req.file) {
        const buffer = Buffer.isBuffer(req.file.buffer)
        ? req.file.buffer
        : Buffer.from(req.file.buffer)
        const dataUri = `data:${req.file.mimetype};base64,${buffer.toString('base64')}`
        const result = await cloudinary.uploader.upload(dataUri, { folder: 'recipe-app' })
        user.avatar = result.secure_url
        }
        if(password){
            user.password = password;
        }

        const updatedUser = await user.save();
             
        res.json({
            _id:    updatedUser._id,
            name:   updatedUser.name,
            email:  updatedUser.email,
            bio:    updatedUser.bio,
            avatar: updatedUser.avatar,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const saveRecipe = async (req,res) => {
    try {
        const user = await User.findById(req.user.id);

        const alreadySaved = await user.savedRecipes.includes(req.params.recipeId);

        if(alreadySaved){
            user.savedRecipes = user.savedRecipes.filter(
                (id) => id.toString() !== req.params.recipeId
            )
        }
        else{
            user.savedRecipes.push(req.params.recipeId);
        }
        await user.save();
        res.json({
            saved: !alreadySaved,
            savedRecipes: user.savedRecipes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getSavedRecipes = async (req,res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'savedRecipes',
            populate: {
                path: 'author',
                select: 'name avatar'
            }
        });
        res.json(user.savedRecipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}