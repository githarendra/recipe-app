import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import useRecipes from '../hooks/useRecipes'
import RecipeCard from '../components/RecipeCard'
import LoadingSpinner from '../components/LoadingSpinner'
import usePageTitle from '../hooks/usePageTitle'

const CATEGORIES = ['all', 'breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'other']

const BrowsePage = () => {
  usePageTitle('Browse')
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [submitted, setSubmitted] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)

  const { recipes, loading, totalPages } = useRecipes({
    search: submitted,
    category: category === 'all' ? '' : category,
    page,
    limit: 9,
  })

  const handleSearch = (e) => {
    e.preventDefault()
    setSubmitted(search)
    setPage(1)
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-semibold mb-6 text-zinc-900 dark:text-zinc-100">
          Browse recipes
        </h1>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes..."
            className="flex-1 px-4 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1) }}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors capitalize ${
                category === cat || (cat === 'all' && !category)
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-orange-300 dark:hover:border-orange-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <LoadingSpinner />
      ) : recipes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-400 dark:text-zinc-500">No recipes found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, i) => (
              <motion.div
                key={recipe._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 text-sm disabled:opacity-40 hover:border-orange-400 transition-colors"
              >
                ← Prev
              </button>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 text-sm disabled:opacity-40 hover:border-orange-400 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default BrowsePage