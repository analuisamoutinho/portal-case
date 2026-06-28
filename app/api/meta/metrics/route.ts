/**
 * GET /api/meta/metrics?client_id=xxx&since=2024-06-01&until=2024-06-07
 *
 * Puxar métricas do Meta Ads para um cliente específico.
 * O token da Meta NUNCA vai ao browser — fica somente aqui.
 *
 * Segurança:
 * 1. Verifica sessão do usuário
 * 2. Verifica acesso do usuário ao client_id
 * 3. Busca token do cliente no banco (server-side)
 * 4. Chama API do Meta no servidor
 * 5. Salva snapshot no banco
 * 6. Registra no audit log
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireClientAccess, createAdminClient, AuthError } from '@/lib/server/supabase'
import { audit, extractRequestMeta } from '@/lib/server/audit'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const clientId = searchParams.get('client_id')
    const since    = searchParams.get('since')
    const until    = searchParams.get('until')

    if (!clientId || !since || !until) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: client_id, since, until' },
        { status: 400 }
      )
    }

    // 1. Verifica autenticação e acesso ao cliente
    const profile = await requireClientAccess(clientId)

    // 2. Busca credenciais do cliente no banco (server-side com service_role)
    const supabaseAdmin = createAdminClient()
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('id, name, meta_ad_account_id, meta_access_token')
      .eq('id', clientId)
      .single()

    if (clientError || !client) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    if (!client.meta_ad_account_id || !client.meta_access_token) {
      return NextResponse.json(
        { error: 'Integração Meta Ads não configurada para este cliente' },
        { status: 422 }
      )
    }

    // 3. Chama API do Meta no servidor
    const fields = [
      'spend', 'impressions', 'reach', 'clicks',
      'purchase_roas', 'cpm', 'cpc', 'ctr',
      'actions', 'action_values', 'video_play_actions',
      'video_thruplay_watched_actions',
    ].join(',')

    const metaUrl = new URL(
      `https://graph.facebook.com/v20.0/${client.meta_ad_account_id}/insights`
    )
    metaUrl.searchParams.set('fields', fields)
    metaUrl.searchParams.set('time_range', JSON.stringify({ since, until }))
    metaUrl.searchParams.set('level', 'account')
    metaUrl.searchParams.set('access_token', client.meta_access_token) // ← server only

    const metaRes = await fetch(metaUrl.toString(), {
      next: { revalidate: 0 }, // sem cache — dados em tempo real
    })

    if (!metaRes.ok) {
      const err = await metaRes.json()
      console.error('[meta/metrics] Erro da API do Meta:', err)
      return NextResponse.json(
        { error: 'Erro ao buscar dados do Meta Ads' },
        { status: 502 }
      )
    }

    const metaData = await metaRes.json()
    const insight  = metaData.data?.[0]

    if (!insight) {
      return NextResponse.json({ data: null, message: 'Sem dados no período' })
    }

    // 4. Processa e normaliza os dados
    const getAction = (type: string) =>
      insight.actions?.find((a: any) => a.action_type === type)?.value ?? 0

    const getActionValue = (type: string) =>
      insight.action_values?.find((a: any) => a.action_type === type)?.value ?? 0

    const purchases      = Number(getAction('purchase'))
    const salesValue     = Number(getActionValue('purchase'))
    const adSpend        = Number(insight.spend ?? 0)
    const roas           = insight.purchase_roas?.[0]?.value ?? (adSpend > 0 ? salesValue / adSpend : 0)

    const snapshot = {
      client_id:       clientId,
      snapshot_date:   since,
      sales_value:     salesValue,
      ad_spend:        adSpend,
      impressions:     Number(insight.impressions ?? 0),
      reach:           Number(insight.reach ?? 0),
      roas:            Number(roas),
      cpc:             Number(insight.cpc ?? 0),
      cpm:             Number(insight.cpm ?? 0),
      ctr:             Number(insight.ctr ?? 0),
      purchases,
      video_plays:     Number(insight.video_play_actions?.[0]?.value ?? 0),
      thru_plays:      Number(insight.video_thruplay_watched_actions?.[0]?.value ?? 0),
      synced_at:       new Date().toISOString(),
    }

    // 5. Upsert no banco
    await supabaseAdmin
      .from('metrics_snapshots')
      .upsert(snapshot, { onConflict: 'client_id,snapshot_date' })

    // 6. Audit log
    await audit({
      action:        'metrics.synced',
      user_id:       profile.id,
      client_id:     clientId,
      resource_type: 'metrics_snapshot',
      metadata:      { since, until, roas: snapshot.roas, ad_spend: snapshot.ad_spend },
      ...extractRequestMeta(req),
    })

    return NextResponse.json({ data: snapshot })

  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode })
    }
    console.error('[meta/metrics]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
