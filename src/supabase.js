import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nxvejlxlhicdlwjntgzt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54dmVqbHhsaGljZGx3am50Z3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NDQxNDgsImV4cCI6MjA5NDAyMDE0OH0.7sIwcakFfcNzo9VKOZ1CMmGFBaaO2DrU1GIjkllpnm8'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)