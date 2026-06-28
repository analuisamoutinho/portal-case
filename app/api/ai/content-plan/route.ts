/**
 * POST /api/ai/content-plan
 *
 * Gera planejamento de conteúdo para Instagram usando Claude.
 * A chave da Anthropic NUNCA vai ao browser.
 *
 * Body: { client_id: string, scope: 'semanal' | 'mensal', week_start: string }
 *
 * Segurança:
 * 1. Valida sessão
 * 2. Valida acesso ao cliente
 * 3. Busca apenas dados do cliente solicitado (sem dados de outros)
 * 4. Chama Claude no servidor com contexto mínimo
 * 5. Salva plano no banco
 * 6. Registra no audit log
 */

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { requireClientAccess, createAdminClient, AuthError } from '@/lib/server/supabase'
import { assertCan } from '@/lib/server/rbac'
import { audit, extractRequestMeta } from '@/lib/server/audit'
import type { UserRole } from '@/lib/server/rbac'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { client_id, scope = 'semanal', week_start } = body

    if (!client_id || !week_start) {
      return NextResponse.json(
        { error: 'client_id e week_start são obrigatórios' },
        { status: 400 }
      )
    }

    // 1. Verifica autenticação e acesso ao cliente
    const profile = await requireClientAccess(client_id)

    // 2. Verifica permissão para gerar conteúdo
    assertCan(profile.role as UserRole, 'content:generate')

    // 3. Busca APENAS dados do cliente solicitado
    const supabaseAdmin = createAdminClient()

    const { data: client } = await supabaseAdmin
      .from('clients')
      .select('id, name, slug')
      .eq('id', client_id)
      .single()

    // Últimas métricas do cliente (contexto mínimo para a IA)
    const { data: metrics } = await supabaseAdmin
      .from('metrics_snapshots')
      .select('snapshot_date, roas, ctr, purchases, sales_value, avg_ticket')
      .eq('client_id', client_id)
      .order('snapshot_date', { ascending: false })
      .limit(7)

    // Oportunidades ativas (para alinhar conteúdo à estratégia)
    const { data: opportunities } = await supabaseAdmin
      .from('opportunities')
      .select('title, description, priority')
      .eq('client_id', client_id)
      .eq('status', 'active')
      .order('order_position')
      .limit(4)

    // 4. Constrói prompt com contexto mínimo (sem dados de outros clientes)
    const context = {
      cliente: client?.name ?? 'Cliente',
      semana:  week_start,
      metricas_recentes: metrics?.slice(0, 3).map(m => ({
        data:    m.snapshot_date,
        roas:    m.roas,
        ctr:     m.ctr,
        vendas:  m.sales_value,
      })) ?? [],
      oportunidades: opportunities?.map(o => o.title) ?? [],
    }

    // 5. Chama Claude no servidor — NEXT_PUBLIC não existe aqui
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!, // server-only
    })

    const message = await anthropic.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{
        role:    'user',
        content: `Você é um estrategista de conteúdo da CASE Aceleradora.
Gere um planejamento de conteúdo ${scope} para Instagram do cliente "${context.cliente}".

CONTEXTO:
- Semana de início: ${context.semana}
- Métricas recentes: ${JSON.stringify(context.metricas_recentes)}
- Oportunidades estratégicas ativas: ${context.oportunidades.join(', ')}

FORMATOS DISPONÍVEIS: reels, feed, stories, carrossel

Responda APENAS com JSON válido, sem texto antes ou depois:
{
  "items": [
    {
      "post_date": "YYYY-MM-DD",
      "format": "reels|feed|stories|carrossel",
      "title": "Título do conteúdo",
      "daily_goal": "Inspirar|Educar|Conectar|Informar|Gerar valor|Humanizar"
    }
  ]
}

Gere um item por formato por dia, durante 7 dias.`,
      }],
    })

    // 6. Parseia resposta
    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    let parsed: { items: any[] }

    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
    } catch {
      return NextResponse.json({ error: 'Resposta inválida da IA' }, { status: 502 })
    }

    // 7. Salva no banco
    const { data: plan, error: planError } = await supabaseAdmin
      .from('content_plans')
      .insert({ client_id, week_start, scope, generated_at: new Date().toISOString() })
      .select()
      .single()

    if (planError || !plan) {
      return NextResponse.json({ error: 'Erro ao salvar plano' }, { status: 500 })
    }

    const items = parsed.items.map((item: any) => ({
      plan_id:    plan.id,
      post_date:  item.post_date,
      format:     item.format,
      title:      item.title,
      daily_goal: item.daily_goal,
      status:     'planejado',
    }))

    await supabaseAdmin.from('content_items').insert(items)

    // 8. Audit log
    await audit({
      action:        'content.ai_generated',
      user_id:       profile.id,
      client_id,
      resource_id:   plan.id,
      resource_type: 'content_plan',
      metadata:      { scope, week_start, items_count: items.length },
      ...extractRequestMeta(req),
    })

    return NextResponse.json({ data: { plan, items } })

  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode })
    }
    console.error('[ai/content-plan]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
