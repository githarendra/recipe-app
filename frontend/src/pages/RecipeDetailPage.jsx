import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getRecipeById, deleteRecipe } from '../api/recipes.js'
import { saveRecipe, getSavedRecipes } from '../api/users.js'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import usePageTitle from '../hooks/usePageTitle'

const RecipeDetailPage = () => {
  usePageTitle('Recipe')
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await getRecipeById(id)
        setRecipe(data)
        document.title = `FlavorSync | ${data.title}`
      } catch {
        navigate('/browse')
      } finally {
        setLoading(false)
      }
    }

    const fetchSaved = async () => {
      if (!user) return
      try {
        const { data } = await getSavedRecipes()
        setIsSaved(data.some((r) => r._id === id))
      } catch (err) {
        console.error(err)
      }
    }

    fetchRecipe()
    fetchSaved()
  }, [id])

  const handleSave = async () => {
    if (!user) return navigate('/login')
    setSaving(true)
    try {
      const { data } = await saveRecipe(id)
      setIsSaved(data.saved)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this recipe?')) return
    await deleteRecipe(id)
    navigate('/browse')
  }

  if (loading) return <LoadingSpinner />
  if (!recipe) return null

  const isOwner = user && recipe.author?._id === user._id

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Image */}
        <div className="aspect-video rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-8">
          {recipe.image ? (
            <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🍽️</div>
          )}
        </div>

        {/* Title + actions */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
            {recipe.title}
          </h1>

          <div className="flex items-center gap-2 shrink-0">
            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm transition-colors ${
                isSaved
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700 text-orange-500'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-orange-400 hover:text-orange-500'
              }`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={isSaved ? '#f97316' : 'none'}
                stroke={isSaved ? '#f97316' : 'currentColor'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              {isSaved ? 'Saved' : 'Save'}
            </button>

            {isOwner && (
              <>
                <Link
                  to={`/recipes/${id}/edit`}
                  className="px-4 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-sm hover:border-orange-400 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-4 py-1.5 rounded-full border border-red-200 dark:border-red-800 text-red-500 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-6 mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          <span>⏱ {recipe.cookingTime} min</span>
          <span>🍽 {recipe.servings} servings</span>
          <span className="capitalize px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 text-xs">
            {recipe.category}
          </span>
        </div>

        {/* Author */}
        <Link
          to={`/profile/${recipe.author?._id}`}
          className="inline-flex items-center gap-2 mb-8 group"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden">
            {recipe.author?.avatar ? (
              <img src={recipe.author.avatar} alt={recipe.author.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-sm font-medium text-orange-600 dark:text-orange-400">
                {recipe.author?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-orange-500 transition-colors">
              {recipe.author?.name}
            </p>
            {recipe.author?.bio && (
              <p className="text-xs text-zinc-400">{recipe.author.bio}</p>
            )}
          </div>
        </Link>

        {/* Description */}
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
          {recipe.description}
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div>
            <h2 className="text-lg font-medium mb-4 text-zinc-900 dark:text-zinc-100">
              Ingredients
            </h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <li
                  key={i}
                  className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800 text-sm"
                >
                  <span className="text-zinc-700 dark:text-zinc-300">{ing.name}</span>
                  <span className="text-zinc-400 dark:text-zinc-500">{ing.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div>
            <h2 className="text-lg font-medium mb-4 text-zinc-900 dark:text-zinc-100">
              Steps
            </h2>
            <ol className="space-y-4">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default RecipeDetailPage