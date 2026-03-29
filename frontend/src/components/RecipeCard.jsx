import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { saveRecipe } from '../api/users.js'
import { useAuth } from '../context/AuthContext'

const RecipeCard = ({ recipe }) => {
  const { user, savedIds, toggleSaved } = useAuth()
  const [saving, setSaving] = useState(false)

  const isSaved = savedIds.includes(recipe._id)
  const isOwner = user && user._id === recipe.author?._id

  const handleSave = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return
    setSaving(true)
    try {
      const { data } = await saveRecipe(recipe._id)
      toggleSaved(recipe._id, data.saved)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link to={`/recipes/${recipe._id}`} className="block group">
        <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-orange-300 dark:hover:border-orange-700 transition-colors">

          {/* Image */}
          <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative">
            {recipe.image ? (
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                🍽️
              </div>
            )}

            {/* Save button — hide for own recipes */}
            {user && !isOwner && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-zinc-900/90 flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={isSaved ? '#f97316' : 'none'}
                  stroke={isSaved ? '#f97316' : 'currentColor'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-orange-500 transition-colors line-clamp-1">
                {recipe.title}
              </h3>
              <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                {recipe.category}
              </span>
            </div>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">
              {recipe.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Fixed author avatar */}
                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                  {recipe.author?.avatar ? (
                    <img
                      src={recipe.author.avatar}
                      alt={recipe.author.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-xs font-medium text-orange-600 dark:text-orange-400">
                      {recipe.author?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  {recipe.author?.name}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
                <span>⏱ {recipe.cookingTime} min</span>
                <span>🍽 {recipe.servings}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default RecipeCard