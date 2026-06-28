import { createServerClient as _createServerClient } from '@supabase/ssr'
import { createClient as _createAdminClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export function createServerClient(cookieStore?: ReadonlyRequestCookies) {
  const store = cookieStore ?? cookies()

  return _createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return store.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              (store as any).set(name, value, options)
            )
          } catch {
            // Server Components não conseguem setar cookies — ok
          }
        },
      },
    }
  )
}

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('[createAdminClient] SUPABASE_SERVICE_ROLE_KEY não configurada.')
  }

  return _createAdminClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function requireAuth() {
  const supabase = createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new AuthError('Não autenticado', 401)
  return user
}

export async function requireProfile() {
  const user = await requireAuth()
  const supabase = createServerClient()
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, client_id, role, full_name, email')
    .eq('id', user.id)
    .single()
  if (error || !profile) throw new AuthError('Perfil não encontrado', 403)
  return profile
}

export async function requireAdmin() {
  const profile = await requireProfile()
  if (profile.role !== 'admin') throw new AuthError('Acesso restrito a administradores', 403)
  return profile
}

export async function requireClientAccess(clientId: string) {
  const profile = await requireProfile()
  if (profile.role !== 'admin' && profile.client_id !== clientId)
    throw new AuthError('Acesso negado a este cliente', 403)
  return profile
}

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message)
    this.name = 'AuthError'
  }
}
