import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yawtxitexkysanhcnaex.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhd3R4aXRleGt5c2FuaGNuYWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MTEzOTcsImV4cCI6MjA5NzE4NzM5N30.omz-jGMsxv2ttehg2Xt4Uhk4vmQ4kl_crb0oYB-9Plc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
