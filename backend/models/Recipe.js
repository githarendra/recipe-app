import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: String,
        required: true
    },
});

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: 500
    },
    ingredients: {
        type: [ingredientSchema],
        validate: {
            validator: (arr) => arr.length>0,
            message: 'Atleast one ingredient is required'
        }
    },
    steps: {
        type: [String],
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'Atleast one step is required'
        }
    },
    image: {
        type: String,
        default: ''
    },
    cookingTime: {
        type: Number,
        required: [true, 'Cooking time is required']
    },
    servings: {
        type: Number,
        required: [true, 'Servings is required']
    },
    category: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'other'],
        default: 'other'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},
    {
        timestamps: true,
    }
);

recipeSchema.index({
    title: 'text',
    description: 'text'
});

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;