import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getUserProfile, updateUserProfile } from '../api/users.js'
import { useAuth } from '../context/AuthContext'
import RecipeCard from '../components/RecipeCard'
import LoadingSpinner from '../components/LoadingSpinner'

import usePageTitle from '../hooks/usePageTitle'

const ProfilePage = () => {
  usePageTitle('Profile')
  const { id } = useParams()
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [form, setForm] = useState({ name: '', bio: '' })

  const isOwner = user && user._id === id

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getUserProfile(id)
        setProfile(data.user)
        setRecipes(data.recipes)
        setForm({ name: data.user.name, bio: data.user.bio || '' })
      } catch {
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  useEffect(() => {
  if (profile) {
    document.title = `FlavorSync | ${profile.name}`
  }
}, [profile])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('bio', form.bio)
      if (avatarFile) formData.append('avatar', avatarFile)

      const { data } = await updateUserProfile(formData)

      setProfile((prev) => ({ ...prev, name: data.name, bio: data.bio, avatar: data.avatar }))
      updateUser({ name: data.name, avatar: data.avatar })
      setEditing(false)
      setAvatarFile(null)
      setAvatarPreview('')
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!profile) return null

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        {/* Profile header */}
        <div className="flex items-start gap-6 mb-10">

          {/* Avatar */}
          <div className="shrink-0">
            {editing ? (
              <label className="cursor-pointer block">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-zinc-300 dark:border-zinc-600 hover:border-orange-400 transition-colors">
                  {avatarPreview || profile.avatar ? (
                    <img
                      src={avatarPreview || profile.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-2xl font-semibold text-orange-600 dark:text-orange-400">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <p className="text-xs text-center text-zinc-400 mt-1">Change photo</p>
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            ) : (
              <div className="w-20 h-20 rounded-full overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-2xl font-semibold text-orange-600 dark:text-orange-400">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            {editing ? (
              <form onSubmit={handleSave} className="space-y-3 max-w-sm">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Name"
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-zinc-900 dark:text-zinc-100"
                />
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={2}
                  placeholder="Bio"
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-zinc-900 dark:text-zinc-100 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm transition-colors disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditing(false); setAvatarPreview(''); setAvatarFile(null) }}
                    className="px-4 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-500 hover:border-zinc-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                    {profile.name}
                  </h1>
                  {isOwner && (
                    <button
                      onClick={() => setEditing(true)}
                      className="px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 hover:border-orange-400 hover:text-orange-500 transition-colors"
                    >
                      Edit profile
                    </button>
                  )}
                </div>
                {profile.bio && (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">{profile.bio}</p>
                )}
                <p className="text-sm text-zinc-400 dark:text-zinc-500">
                  {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Recipes */}
        <h2 className="text-lg font-medium mb-6 text-zinc-900 dark:text-zinc-100">
          {isOwner ? 'Your recipes' : `${profile.name}'s recipes`}
        </h2>

        {recipes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-400 dark:text-zinc-500 text-sm">No recipes yet</p>
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
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default ProfilePage