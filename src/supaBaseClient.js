import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://czpqxoxqpbtygkmwabud.supabase.co'
const supabaseKey = 'sb_publishable_cxg6nOSy5jnNcCK1fyE6oA_f0pUFXGG'

export const supabase = createClient(supabaseUrl, supabaseKey)