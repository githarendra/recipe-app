import api from './axios.js'

export const getRecipes = (params) => api.get('/recipes', { params })
export const getRecipeById = (id) => api.get(`/recipes/${id}`)
export const getRecipesByUser = (userId) => api.get(`/recipes/user/${userId}`)
export const createRecipe = (data) => api.post('/recipes', data)
export const updateRecipe = (id, data) => api.put(`/recipes/${id}`, data)
export const deleteRecipe = (id) => api.delete(`/recipes/${id}`)