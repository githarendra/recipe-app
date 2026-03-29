import { Routes, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useTheme } from './context/ThemeContext'
import { useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import AddRecipePage from './pages/AddRecipePage'
import EditRecipePage from './pages/EditRecipePage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SavedPage from './pages/SavedPage'

const BottomNav = () => {
  const { user } = useAuth()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[9999] bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-around py-2">

        {/* Home */}
        <Link to="/" className="flex flex-col items-center gap-1 px-4 py-1 text-zinc-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="text-xs">Home</span>
        </Link>

        {/* Browse */}
        <Link to="/browse" className="flex flex-col items-center gap-1 px-4 py-1 text-zinc-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span className="text-xs">Browse</span>
        </Link>

        {/* Add / Join — raised orange button */}
        {user ? (
          <Link to="/recipes/new" className="flex flex-col items-center gap-1 px-4 py-1">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center -mt-5 shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Add</span>
          </Link>
        ) : (
          <Link to="/register" className="flex flex-col items-center gap-1 px-4 py-1">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center -mt-5 shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Join</span>
          </Link>
        )}

        {/* Saved */}
        {user ? (
          <Link to="/saved" className="flex flex-col items-center gap-1 px-4 py-1 text-zinc-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            <span className="text-xs">Saved</span>
          </Link>
        ) : (
          <Link to="/login" className="flex flex-col items-center gap-1 px-4 py-1 text-zinc-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span className="text-xs">Login</span>
          </Link>
        )}

        {/* Profile */}
        {user ? (
          <Link to={`/profile/${user._id}`} className="flex flex-col items-center gap-1 px-4 py-1 text-zinc-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-xs font-medium text-orange-600 dark:text-orange-400">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-xs">Profile</span>
          </Link>
        ) : (
          <Link to="/register" className="flex flex-col items-center gap-1 px-4 py-1 text-zinc-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span className="text-xs">Sign up</span>
          </Link>
        )}

      </div>
    </div>
  )
}

function App() {
  const { theme } = useTheme()

  return (
    <div className={theme}>
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
        <Navbar />
        <div className="pb-20 md:pb-0">
          <Routes>
            <Route path="/"                   element={<HomePage />} />
            <Route path="/browse"             element={<BrowsePage />} />
            <Route path="/recipes/:id"        element={<RecipeDetailPage />} />
            <Route path="/login"              element={<LoginPage />} />
            <Route path="/register"           element={<RegisterPage />} />
            <Route path="/profile/:id"        element={<ProfilePage />} />
            <Route path="/saved"              element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />
            <Route path="/recipes/new"        element={<ProtectedRoute><AddRecipePage /></ProtectedRoute>} />
            <Route path="/recipes/:id/edit"   element={<ProtectedRoute><EditRecipePage /></ProtectedRoute>} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </div>
  )
}

export default App