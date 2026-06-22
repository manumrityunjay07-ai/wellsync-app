import { createClient } from '@supabase/supabase-js'

// We are completely hardcoding these and ignoring import.meta.env
// because Vercel is injecting broken environment variables.
const supabaseUrl = 'https://yawtxitexkysanhcnaex.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhd3R4aXRleGt5c2FuaGNuYWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzNDk0NTksImV4cCI6MjAzMzkyNTQ1OX0.O-8b2Q1aN8s-zH8vG7sM9A7D6L2f3Z4d2G1v-T6z8vI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
