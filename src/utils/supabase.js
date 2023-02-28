import { createClient } from '@supabase/supabase-js'

module.exports = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
)
