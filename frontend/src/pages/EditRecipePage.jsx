import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getRecipeById, updateRecipe } from '../api/recipes.js'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

import usePageTitle from '../hooks/usePageTitle'

const CATEGORIES = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'other']

const EditRecipePage = () => {
  usePageTitle('Edit Recipe')
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', cookingTime: '', servings: '', category: 'dinner',
  })
  const [ingredients, setIngredients] = useState([{ name: '', amount: '' }])
  const [steps, setSteps] = useState([''])

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getRecipeById(id)
        if (data.author._id !== user._id) return navigate('/browse')
        setForm({
          title: data.title,
          description: data.description,
          cookingTime: data.cookingTime,
          servings: data.servings,
          category: data.category,
        })
        setIngredients(data.ingredients)
        setSteps(data.steps)
        setPreview(data.image)
      } catch {
        navigate('/browse')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }
  const addIngredient = () => setIngredients([...ingredients, { name: '', amount: '' }])
  const removeIngredient = (i) => setIngredients(ingredients.filter((_, idx) => idx !== i))
  const updateIngredient = (i, field, value) => {
    const updated = [...ingredients]
    updated[i][field] = value
    setIngredients(updated)
  }
  const addStep = () => setSteps([...steps, ''])
  const removeStep = (i) => setSteps(steps.filter((_, idx) => idx !== i))
  const updateStep = (i, value) => {
    const updated = [...steps]
    updated[i] = value
    setSteps(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      formData.append('ingredients', JSON.stringify(ingredients))
      formData.append('steps', JSON.stringify(steps))
      if (image) formData.append('image', image)
      await updateRecipe(id, formData)
      navigate(`/recipes/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update recipe')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold mb-8 text-zinc-900 dark:text-zinc-100">Edit recipe</h1>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image */}
          <div>
            <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-2">Photo</label>
            <label className="block cursor-pointer">
              <div className={`aspect-video rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 overflow-hidden flex items-center justify-center hover:border-orange-400 transition-colors ${preview ? 'p-0' : 'p-8'}`}>
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <p className="text-2xl mb-2">+</p>
                    <p className="text-sm text-zinc-400">Click to upload image</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>

          {[
            { label: 'Title', name: 'title', type: 'text' },
            { label: 'Description', name: 'description', type: 'text' },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1.5">{label}</label>
              <input type={type} name={name} value={form[name]} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-zinc-900 dark:text-zinc-100" />
            </div>
          ))}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1.5">Time (min)</label>
              <input type="number" name="cookingTime" value={form.cookingTime} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-zinc-900 dark:text-zinc-100" />
            </div>
            <div>
              <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1.5">Servings</label>
              <input type="number" name="servings" value={form.servings} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-zinc-900 dark:text-zinc-100" />
            </div>
            <div>
              <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1.5">Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-zinc-900 dark:text-zinc-100 capitalize">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-2">Ingredients</label>
            <div className="space-y-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2">
                  <input placeholder="Ingredient" value={ing.name} onChange={(e) => updateIngredient(i, 'name', e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-zinc-900 dark:text-zinc-100" />
                  <input placeholder="Amount" value={ing.amount} onChange={(e) => updateIngredient(i, 'amount', e.target.value)}
                    className="w-28 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-zinc-900 dark:text-zinc-100" />
                  {ingredients.length > 1 && (
                    <button type="button" onClick={() => removeIngredient(i)}
                      className="px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-red-500 hover:border-red-300 transition-colors text-sm">✕</button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addIngredient} className="mt-2 text-sm text-orange-500 hover:text-orange-600 transition-colors">+ Add ingredient</button>
          </div>

          {/* Steps */}
          <div>
            <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-2">Steps</label>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="w-6 h-6 mt-2.5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-medium shrink-0">{i + 1}</span>
                  <textarea placeholder={`Step ${i + 1}`} value={step} onChange={(e) => updateStep(i, e.target.value)} rows={2}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-zinc-900 dark:text-zinc-100 resize-none" />
                  {steps.length > 1 && (
                    <button type="button" onClick={() => removeStep(i)}
                      className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-red-500 hover:border-red-300 transition-colors text-sm">✕</button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addStep} className="mt-2 text-sm text-orange-500 hover:text-orange-600 transition-colors">+ Add step</button>
          </div>

          <button type="submit" disabled={saving}
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors disabled:opacity-60">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default EditRecipePage