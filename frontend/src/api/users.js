import api from './axios.js'

export const getUserProfile = (id) => api.get(`/users/${id}`)
export const updateUserProfile = (data) => api.put('/users/profile', data)
export const saveRecipe = (recipeId) => api.post(`/users/save/${recipeId}`)
export const getSavedRecipes = () => api.get('/users/saved')