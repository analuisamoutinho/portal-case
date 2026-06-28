/**
 * Audit Log — registra ações sensíveis no banco
 *
 * Quando usar:
 * - Aprovação / rejeição de material
 * - Download / visualização de arquivo
 * - Geração de URL assinada
 * - Edição de oportunidade
 * - Convite de usuário
 * - Alteração de reunião
 * - Chamada à IA (planejamento)
 * - Sync de métricas (Meta / e-commerce)
 * - Remoção de acesso de cliente
 */

import { createAdminClient } from './supabase'

export type AuditAction =
  | 'material.approved'
  | 'material.rejected'
  | 'material.change_requested'
  | 'material.viewed'
  | 'file.signed_url_generated'
  | 'file.downloaded'
  | 'opportunity.created'
  | 'opportunity.updated'
  | 'opportunity.archived'
  | 'meeting.created'
  | 'meeting.action_completed'
  | 'content.ai_generated'
  | 'metrics.synced'
  | 'user.invited'
  | 'user.access_revoked'
  | 'auth.login'
  | 'auth.logout'

export interface AuditEntry {
  action:     AuditAction
  user_id:    string
  client_id?: string
  resource_id?: string
  resource_type?: string
  metadata?:  Record<string, unknown>
  ip_address?: string
  user_agent?: string
}

/** Registra uma entrada no audit log */
export async function audit(entry: AuditEntry): Promise<void> {
  try {
    const supabase = createAdminClient()

    await supabase.from('audit_logs').insert({
      action:        entry.action,
      user_id:       entry.user_id,
      client_id:     entry.client_id ?? null,
      resource_id:   entry.resource_id ?? null,
      resource_type: entry.resource_type ?? null,
      metadata:      entry.metadata ?? {},
      ip_address:    entry.ip_address ?? null,
      user_agent:    entry.user_agent ?? null,
      created_at:    new Date().toISOString(),
    })
  } catch (err) {
    // Nunca deixar falha de audit quebrar a operação principal
    // Mas registra no server log para monitoramento
    console.error('[audit] Falha ao registrar log:', err, entry)
  }
}

/** Extrai IP e user-agent do Request do Next.js */
export function extractRequestMeta(req: Request) {
  return {
    ip_address: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? req.headers.get('x-real-ip')
      ?? 'unknown',
    user_agent: req.headers.get('user-agent') ?? 'unknown',
  }
}
