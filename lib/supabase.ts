/**
 * Cliente Supabase para uso no BROWSER (Client Components)
 * Usa apenas NEXT_PUBLIC_ vars — sem nenhum segredo
 */
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
