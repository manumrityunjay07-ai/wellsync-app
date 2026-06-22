import axios from 'axios'
import { supabase } from '../lib/supabase'

const api = axios.create({
  baseURL: 'https://wellsync-app.onrender.com',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

// Attach JWT token to every request
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

// Handle 401 errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      supabase.auth.signOut()
    }
    return Promise.reject(err)
  }
)

export default api
