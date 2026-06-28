/**
 * POST /api/storage/signed-url
 *
 * Gera URL assinada com expiração curta para visualizar arquivo privado.
 *
 * REGRAS DE SEGURANÇA:
 * - Bucket deve ser PRIVADO — nunca público
 * - URL expira em 60 segundos (download) ou 300s (visualização)
 * - Verificação de que o arquivo pertence ao cliente do usuário
 * - Nunca gerar URL para arquivo de outro cliente
 * - Toda geração é registrada no audit log
 *
 * Body: { path: string, expires_in?: number }
 * path formato: "client_id/materials/arquivo.jpg"
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireProfile, createAdminClient, AuthError } from '@/lib/server/supabase'
import { audit, extractRequestMeta } from '@/lib/server/audit'

const BUCKET = 'materials'
const DEFAULT_EXPIRES = 300  // 5 minutos para visualização
const MAX_EXPIRES     = 3600 // máximo 1 hora

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { path, expires_in = DEFAULT_EXPIRES } = body

    if (!path || typeof path !== 'string') {
      return NextResponse.json({ error: 'path é obrigatório' }, { status: 400 })
    }

    // Sanitiza o caminho — impede path traversal
    const sanitizedPath = path.replace(/\.\./g, '').replace(/^\/+/, '')

    // 1. Verifica autenticação
    const profile = await requireProfile()

    // 2. Verifica que o arquivo pertence ao cliente do usuário
    // Estrutura esperada: "client_id/...resto do caminho"
    const pathClientId = sanitizedPath.split('/')[0]

    if (profile.role !== 'admin' && profile.client_id !== pathClientId) {
      return NextResponse.json(
        { error: 'Acesso negado a este arquivo' },
        { status: 403 }
      )
    }

    // 3. Gera URL assinada no servidor (service_role necessário para bucket privado)
    const supabaseAdmin = createAdminClient()
    const expiresIn = Math.min(Number(expires_in) || DEFAULT_EXPIRES, MAX_EXPIRES)

    const { data, error } = await supabaseAdmin
      .storage
      .from(BUCKET)
      .createSignedUrl(sanitizedPath, expiresIn)

    if (error || !data?.signedUrl) {
      console.error('[storage/signed-url] Erro ao gerar URL:', error)
      return NextResponse.json(
        { error: 'Não foi possível gerar o link de acesso' },
        { status: 500 }
      )
    }

    // 4. Audit log — toda geração de URL assinada é registrada
    await audit({
      action:        'file.signed_url_generated',
      user_id:       profile.id,
      client_id:     pathClientId,
      resource_id:   sanitizedPath,
      resource_type: 'storage_file',
      metadata:      { expires_in: expiresIn, bucket: BUCKET },
      ...extractRequestMeta(req),
    })

    return NextResponse.json({
      signed_url:  data.signedUrl,
      expires_in:  expiresIn,
      expires_at:  new Date(Date.now() + expiresIn * 1000).toISOString(),
    })

  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode })
    }
    console.error('[storage/signed-url]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
