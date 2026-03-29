import { createContext, useContext, useState, useEffect } from 'react'
import { getSavedRecipes } from '../api/users.js'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  )
  const [savedIds, setSavedIds] = useState(
    JSON.parse(localStorage.getItem('savedIds')) || []
  )

  // Fetch saved recipe IDs when user logs in
  useEffect(() => {
    const fetchSaved = async () => {
      if (!user) {
        setSavedIds([])
        return
      }
      try {
        const { data } = await getSavedRecipes()
        const ids = data.map((r) => r._id)
        setSavedIds(ids)
        localStorage.setItem('savedIds', JSON.stringify(ids))
      } catch (err) {
        console.error(err)
      }
    }
    fetchSaved()
  }, [user?._id])

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', userData.token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('savedIds')
    setUser(null)
    setSavedIds([])
  }

  const updateUser = (userData) => {
    const updated = { ...user, ...userData }
    localStorage.setItem('user', JSON.stringify(updated))
    setUser(updated)
  }

  const toggleSaved = (recipeId, isSaved) => {
    const updated = isSaved
      ? [...savedIds, recipeId]
      : savedIds.filter((id) => id !== recipeId)
    setSavedIds(updated)
    localStorage.setItem('savedIds', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, savedIds, toggleSaved }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)