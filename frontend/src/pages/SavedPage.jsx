import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getSavedRecipes } from '../api/users.js'
import RecipeCard from '../components/RecipeCard'
import LoadingSpinner from '../components/LoadingSpinner'

import usePageTitle from '../hooks/usePageTitle'

const SavedPage = () => {
    usePageTitle('Saved Recipes')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getSavedRecipes()
        setRecipes(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-semibold mb-8 text-zinc-900 dark:text-zinc-100">
          Saved recipes
        </h1>

        {loading ? (
          <LoadingSpinner />
        ) : recipes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-400 dark:text-zinc-500 text-sm mb-2">No saved recipes yet</p>
            <p className="text-zinc-400 dark:text-zinc-500 text-xs">
              Tap the bookmark icon on any recipe to save it
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, i) => (
              <motion.div
                key={recipe._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <RecipeCard
                  recipe={recipe}
                  savedIds={recipes.map((r) => r._id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default SavedPage