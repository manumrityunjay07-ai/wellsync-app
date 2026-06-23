import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(authUser) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()
      
    if (!data) {
      const { data: newProfile } = await supabase.from('users').insert({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.full_name || authUser.email.split('@')[0]
      }).select().single()
      setProfile(newProfile)
    } else {
      setProfile(data)
    }
  }

  async function signUp(email, password, name) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email,
        name,
      })
    }
    return data
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
    if (error) throw error
    return data
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
  }

  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  }

  async function updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  }

  async function updateProfile(updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    if (error) throw error
    setProfile(data)
    return data
  }

  async function toggleRole() {
    if (!profile) return
    const { data } = await api.post('/api/user/toggle-role')
    setProfile(data)
    return data
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      updateProfile,
      fetchProfile,
      resetPassword,
      updatePassword,
      toggleRole,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
