import { createClient } from '@supabase/supabase-js'
import type { TaskRow } from '@/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: TaskRow
        Insert: Omit<TaskRow, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<TaskRow, 'id' | 'session_id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
