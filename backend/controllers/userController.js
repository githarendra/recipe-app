import User from "../models/User.js";
import Recipe from "../models/Recipe.js";
import { uploadToCloudinary } from "../middleware/upload.js";

export const getUserProfile = async (req,res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        const recipes = await Recipe.find({author:req.params.id}).sort({createdAt:-1});

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

        if(req.file){
            const result = await uploadToCloudinary(req.file.buffer);
            user.avatar = result.secure_url;
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