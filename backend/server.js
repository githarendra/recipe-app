import "./config/env.js";
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import recipeRoutes from './routes/recipes.js';
import userRoutes from './routes/users.js';

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:"true"}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});