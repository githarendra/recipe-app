import { useState, Suspense, lazy } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import useRecipes from '../hooks/useRecipes'
import RecipeCard from '../components/RecipeCard'
import LoadingSpinner from '../components/LoadingSpinner'
import usePageTitle from '../hooks/usePageTitle'


const FloatingFood = lazy(() => import('../components/3d/FloatingFood'))

const HomePage = () => {
  usePageTitle('Home')
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { recipes, loading } = useRecipes({ limit: 3 })

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/browse?search=${search}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden">

        {/* 3D canvas background */}
        <div className="absolute inset-0 opacity-60">
          <Suspense fallback={null}>
            <FloatingFood />
          </Suspense>
        </div>

        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Share your recipes with the world
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-4 text-zinc-900 dark:text-zinc-100">
            Cook, share,{' '}
            <span className="text-orange-500">inspire.</span>
          </h1>

          <p className="text-lg text-zinc-700 dark:text-zinc-400 mb-8">
            Discover thousands of recipes from cooks around the world.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes..."
              className="flex-1 px-4 py-3 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex items-center justify-center gap-4 mt-6">
            <Link
              to="/browse"
              className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-orange-500 transition-colors underline underline-offset-4"
            >
              Browse all recipes →
            </Link>
            {!user && (
              <Link
                to="/register"
                className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-orange-500 transition-colors underline underline-offset-4"
              >
                Join for free →
              </Link>
            )}
          </div>
        </motion.div>
      </section>

      {/* Trending recipes */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Trending this week
            </h2>
            <Link
              to="/browse"
              className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe, i) => (
                <motion.div
                  key={recipe._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </section>
    </div>
  )
}

export default HomePage