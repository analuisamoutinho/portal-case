/**
 * Clientes Supabase para uso SERVER-SIDE APENAS.
 *
 * REGRAS:
 * - createServerClient → Server Components, Route Handlers, Middleware
 * - createAdminClient  → operações privilegiadas (cron, webhooks, admin)
 *                        NUNCA chamar de Client Components
 *
 * A service_role_key bypassa todo o RLS.
 * Só deve ser usada em contextos completamente server-side
 * e apenas quando estritamente necessário.
 */
import { createServerClient as _createServerClient } from '@supabase/ssr'
import { createClient as _createAdminClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

// ── Server client (respeita RLS + sessão do usuário) ────────────────
export function createServerClient(cookieStore?: ReadonlyRequestCookies) {
  const store = cookieStore ?? cookies()

  return _createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return store.getAll() },
        setAll(cookiesToSet) {
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

// ── Admin client (service_role — bypassa RLS) ────────────────────────
// USE COM EXTREMO CUIDADO. Somente em:
// - Cron jobs de sincronização
// - Webhooks do Meta
// - Operações de setup de admin
// - NUNCA em fluxos que recebem input do usuário sem validação adicional
export function createAdminClient() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      '[createAdminClient] SUPABASE_SERVICE_ROLE_KEY não configurada. ' +
      'Verifique .env.local — esta variável nunca deve ter prefixo NEXT_PUBLIC_.'
    )
  }

  return _createAdminClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

// ── Helpers de sessão ────────────────────────────────────────────────

/** Retorna o usuário autenticado ou lança erro 401 */
export async function requireAuth() {
  const supabase = createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new AuthError('Não autenticado', 401)
  }

  return user
}

/** Retorna o perfil completo com role e client_id */
export async function requireProfile() {
  const user = await requireAuth()
  const supabase = createServerClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, client_id, role, full_name, email')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    throw new AuthError('Perfil não encontrado', 403)
  }

  return profile
}

/** Garante que o usuário é admin da CASE */
export async function requireAdmin() {
  const profile = await requireProfile()

  if (profile.role !== 'admin') {
    throw new AuthError('Acesso restrito a administradores', 403)
  }

  return profile
}

/** Garante que o usuário pertence ao client_id informado */
export async function requireClientAccess(clientId: string) {
  const profile = await requireProfile()

  if (profile.role !== 'admin' && profile.client_id !== clientId) {
    throw new AuthError('Acesso negado a este cliente', 403)
  }

  return profile
}

// ── Erro tipado ──────────────────────────────────────────────────────
export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message)
    this.name = 'AuthError'
  }
}
