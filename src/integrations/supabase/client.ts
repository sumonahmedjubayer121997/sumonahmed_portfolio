
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = "https://rkywvmkutlwxfqrmclai.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJreXd2bWt1dGx3eGZxcm1jbGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2ODQ3MTIsImV4cCI6MjA2NzI2MDcxMn0.ZB6QkW0l0vyahM3dnIDnPH5V17YOMiet6dl-eiaZsGo"

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
