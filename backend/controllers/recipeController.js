import Recipe from "../models/Recipe.js";
import { uploadToCloudinary } from "../middleware/upload.js";

export const getRecipes = async (req,res) => {
    try {
         const {search,category,page=1,limit=10} = req.query;

        let query = {};
        if(search){
            query.$text = {$search : search};
        }
        if(category){
            query.category = category;
        }

        const skip = (page-1)*limit;

        const recipes = await Recipe.find(query)
        .populate('author','name avatar')
        .sort({createdAt: -1})
        .skip(skip)
        .limit(Number(limit));

        const total = await Recipe.countDocuments(query)

        res.json({
            recipes,
            currentPage: Number(page),
            totalPages: Math.ceil(total/limit),
            total
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRecipeById = async (req,res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
        .populate('author', 'name avatar bio');

        if(!recipe){
            return res.status(404).json({ message: 'Recipe not found'});
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createRecipe = async (req,res) => {
    try {
        const {title, description, ingredients, steps, cookingTime, servings, category} = req.body;
        let image = '';
        if(req.file){
            const result = await uploadToCloudinary(req.file.buffer);
            image = result.secure_url;
        }
        const recipe = await Recipe.create({
            title,
            description,
            ingredients: JSON.parse(ingredients), 
            steps: JSON.parse(steps),
            cookingTime,
            servings,
            category,
            image,
            author: req.user._id,
        });

        await recipe.populate('author','name avatar');
        res.status(201).json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this recipe' });
    }

    const { title, description, ingredients, steps, cookingTime, servings, category } = req.body;

    let image = recipe.image;
    if(req.file){
        const result = await uploadToCloudinary(req.file.buffer);
        image = result.secure_url;
    }

    recipe.title       = title       || recipe.title;
    recipe.description = description || recipe.description;
    recipe.ingredients = ingredients ? JSON.parse(ingredients) : recipe.ingredients;
    recipe.steps       = steps       ? JSON.parse(steps)       : recipe.steps;
    recipe.cookingTime = cookingTime || recipe.cookingTime;
    recipe.servings    = servings    || recipe.servings;
    recipe.category    = category    || recipe.category;
    recipe.image       = image;

    const updatedRecipe = await recipe.save();
    await updatedRecipe.populate('author', 'name avatar');

    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRecipe = async (req,res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if(!recipe){
            return res.status(404).json({ message: 'Recipe not found' });
        }
        if(recipe.author.toString() !== req.user._id.toString()){
           return res.status(403).json({ message: 'Not authorized to delete this recipe' }); 
        }
        await recipe.deleteOne();
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getRecipesByUser = async (req,res) => {
    try {
        const recipes = await Recipe.find({author:req.params.userId})
        .populate('author','name avatar')
        .sort({createdAt:-1});

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

