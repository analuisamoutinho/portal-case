/**
 * RBAC — Role-Based Access Control
 *
 * Papéis:
 * ┌─────────────────┬──────────────────────────────────────────┐
 * │ admin           │ CASE interno — vê e edita tudo           │
 * │ strategist      │ CASE interno — clientes atribuídos       │
 * │ client_owner    │ Cliente — vê, aprova, comenta            │
 * │ client_viewer   │ Cliente — só visualiza                   │
 * └─────────────────┴──────────────────────────────────────────┘
 */

export type UserRole = 'admin' | 'strategist' | 'client_owner' | 'client_viewer'

// Mapa de ações permitidas por papel
const PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['*'], // tudo

  strategist: [
    'dashboard:read',
    'opportunities:read', 'opportunities:write',
    'timeline:read', 'timeline:write',
    'materials:read', 'materials:write', 'materials:review',
    'meetings:read', 'meetings:write',
    'calendar:read', 'calendar:write',
    'content:read', 'content:write', 'content:generate',
    'lab:read',
    'clients:read',
  ],

  client_owner: [
    'dashboard:read',
    'opportunities:read',
    'timeline:read',
    'materials:read', 'materials:approve', 'materials:comment',
    'meetings:read',
    'calendar:read',
    'content:read',
    'lab:read', 'lab:progress',
  ],

  client_viewer: [
    'dashboard:read',
    'opportunities:read',
    'timeline:read',
    'materials:read',
    'meetings:read',
    'calendar:read',
    'content:read',
    'lab:read',
  ],
}

/** Verifica se um papel tem permissão para uma ação */
export function can(role: UserRole, action: string): boolean {
  const perms = PERMISSIONS[role]
  if (!perms) return false
  if (perms.includes('*')) return true
  return perms.includes(action)
}

/** Lança erro se o papel não tem permissão */
export function assertCan(role: UserRole, action: string): void {
  if (!can(role, action)) {
    throw new PermissionError(
      `Papel "${role}" não tem permissão para "${action}"`,
      403
    )
  }
}

/** Verifica se o papel é interno da CASE */
export function isCaseTeam(role: UserRole): boolean {
  return role === 'admin' || role === 'strategist'
}

/** Verifica se o papel é do lado do cliente */
export function isClientSide(role: UserRole): boolean {
  return role === 'client_owner' || role === 'client_viewer'
}

export class PermissionError extends Error {
  constructor(message: string, public statusCode: number = 403) {
    super(message)
    this.name = 'PermissionError'
  }
}

// ── Labels para UI ──────────────────────────────────────────────────
export const ROLE_LABELS: Record<UserRole, string> = {
  admin:         'Admin CASE',
  strategist:    'Estrategista CASE',
  client_owner:  'Responsável',
  client_viewer: 'Visualizador',
}

export const ROLE_COLORS: Record<UserRole, string> = {
  admin:         'bg-marrom/10 text-marrom',
  strategist:    'bg-bronze/10 text-bronze',
  client_owner:  'bg-success/10 text-success',
  client_viewer: 'bg-nude/30 text-marrom/60',
}
