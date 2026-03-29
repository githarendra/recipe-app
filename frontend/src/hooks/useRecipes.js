import { useState, useEffect } from 'react'
import { getRecipes } from '../api/recipes.js'

const useRecipes = (params) => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const { data } = await getRecipes(params)
        setRecipes(data.recipes)
        setTotalPages(data.totalPages)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [JSON.stringify(params)])

  return { recipes, loading, error, totalPages }
}

export default useRecipes