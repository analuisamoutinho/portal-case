import { google } from 'googleapis'
import { createAdminClient } from './supabase'

// Estrutura de cada aba da planilha template
export const SHEET_TABS = {
  oportunidades: {
    name: 'Oportunidades',
    headers: ['titulo', 'descricao', 'prioridade', 'impacto', 'prazo', 'status'],
  },
  timeline: {
    name: 'Timeline',
    headers: ['titulo', 'descricao', 'data', 'status', 'badge_label', 'badge_value', 'icon_type'],
  },
  reunioes: {
    name: 'Reuniões',
    headers: ['titulo', 'data', 'hora', 'duracao_min', 'tipo', 'pauta', 'video_url', 'status'],
  },
  materiais: {
    name: 'Materiais',
    headers: ['titulo', 'tipo', 'tamanho', 'status', 'data', 'categoria', 'url_arquivo', 'url_preview'],
  },
  calendario: {
    name: 'Calendário',
    headers: ['titulo', 'descricao', 'tipo', 'data_inicio', 'hora', 'data_fim'],
  },
  planejamento: {
    name: 'Planejamento',
    headers: ['semana', 'data', 'formato', 'tema', 'copy', 'hashtags', 'status', 'objetivo'],
  },
}

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n')
  if (!email || !key) throw new Error('Credenciais do Google Service Account não configuradas.')
  return new google.auth.JWT({
    email,
    key,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
    ],
  })
}

// Cria uma nova planilha template para o cliente e retorna o sheetId
export async function createClientSheet(clientName: string): Promise<string> {
  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  const spreadsheet = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: `CASE Portal — ${clientName}` },
      sheets: Object.values(SHEET_TABS).map(t => ({ properties: { title: t.name } })),
    },
  })

  const spreadsheetId = spreadsheet.data.spreadsheetId!

  // Adiciona cabeçalhos em cada aba
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: 'RAW',
      data: Object.values(SHEET_TABS).map(t => ({
        range: `${t.name}!A1`,
        values: [t.headers],
      })),
    },
  })

  return spreadsheetId
}

// Lê todas as abas da planilha e sincroniza para o Supabase
export async function syncClientSheet(clientId: string, sheetId: string) {
  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })
  const admin = createAdminClient()

  // Busca todas as abas de uma vez
  const ranges = Object.values(SHEET_TABS).map(t => `${t.name}!A:Z`)
  const { data } = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: sheetId,
    ranges,
  })

  const valueRanges = data.valueRanges ?? []

  // Helper: converte linhas em objetos usando a linha de cabeçalho
  function parseRows(values: string[][] | undefined | null): Record<string, string>[] {
    if (!values || values.length < 2) return []
    const [headers, ...rows] = values
    return rows
      .filter(r => r.some(c => c?.trim()))
      .map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])))
  }

  const [opRows, tlRows, mtgRows, matRows, calRows, planRows] = valueRanges.map(vr =>
    parseRows(vr.values as string[][] | undefined)
  )

  // ── Oportunidades ─────────────────────────────────────────────────
  await admin.from('opportunities').delete().eq('client_id', clientId)
  if (opRows.length > 0) {
    await admin.from('opportunities').insert(
      opRows.map((r, i) => ({
        client_id: clientId,
        order_position: i + 1,
        title: r.titulo,
        description: r.descricao,
        priority: normalizePriority(r.prioridade),
        impact_label: r.impacto,
        deadline: r.prazo,
        workflow_status: normalizeWorkflowStatus(r.status),
        status: 'active',
      }))
    )
  }

  // ── Timeline ──────────────────────────────────────────────────────
  await admin.from('timeline_events').delete().eq('client_id', clientId)
  if (tlRows.length > 0) {
    await admin.from('timeline_events').insert(
      tlRows.map(r => ({
        client_id: clientId,
        title: r.titulo,
        description: r.descricao,
        event_date: r.data || new Date().toISOString().split('T')[0],
        badge_label: r.badge_label,
        badge_value: r.badge_value,
        icon_type: r.icon_type || 'circle',
        status_label: r.status,
      }))
    )
  }

  // ── Reuniões ──────────────────────────────────────────────────────
  await admin.from('meetings').delete().eq('client_id', clientId)
  if (mtgRows.length > 0) {
    await admin.from('meetings').insert(
      mtgRows.map(r => ({
        client_id: clientId,
        title: r.titulo,
        meeting_date: r.data || new Date().toISOString().split('T')[0],
        meeting_time: r.hora,
        duration_minutes: r.duracao_min ? parseInt(r.duracao_min) : null,
        meeting_type: r.tipo,
        agenda: r.pauta,
        video_url: r.video_url,
        summary: r.status,
        total_actions: 0,
        completed_actions: 0,
      }))
    )
  }

  // ── Materiais ─────────────────────────────────────────────────────
  await admin.from('materials').delete().eq('client_id', clientId)
  if (matRows.length > 0) {
    await admin.from('materials').insert(
      matRows.map(r => ({
        client_id: clientId,
        title: r.titulo,
        type: normalizeMaterialType(r.tipo),
        file_size: r.tamanho,
        status: normalizeMaterialStatus(r.status),
        submitted_at: r.data || new Date().toISOString(),
        category: r.categoria,
        file_url: r.url_arquivo,
        preview_url: r.url_preview,
      }))
    )
  }

  // ── Calendário ────────────────────────────────────────────────────
  await admin.from('calendar_events').delete().eq('client_id', clientId)
  if (calRows.length > 0) {
    await admin.from('calendar_events').insert(
      calRows.map(r => ({
        client_id: clientId,
        title: r.titulo,
        description: r.descricao,
        type: normalizeCalendarType(r.tipo),
        starts_at: buildDateTime(r.data_inicio, r.hora),
        ends_at: r.data_fim ? buildDateTime(r.data_fim, '') : null,
      }))
    )
  }

  // ── Planejamento ──────────────────────────────────────────────────
  // Agrupa por semana: cria um content_plan por semana única
  await admin.from('content_plans').delete().eq('client_id', clientId)
  if (planRows.length > 0) {
    const weekMap = new Map<string, typeof planRows>()
    planRows.forEach(r => {
      const w = r.semana || 'Sem semana'
      if (!weekMap.has(w)) weekMap.set(w, [])
      weekMap.get(w)!.push(r)
    })

    for (const [weekLabel, items] of Array.from(weekMap.entries())) {
      const { data: plan } = await admin
        .from('content_plans')
        .insert({
          client_id: clientId,
          week_start: items[0]?.data || new Date().toISOString().split('T')[0],
          scope: 'semanal',
          generated_at: new Date().toISOString(),
        })
        .select('id')
        .single()

      if (plan) {
        await admin.from('content_items').insert(
          items.map((r: Record<string, string>) => ({
            plan_id: plan.id,
            week_label: weekLabel,
            post_date: r.data || new Date().toISOString().split('T')[0],
            format: normalizeContentFormat(r.formato),
            title: r.tema,
            theme: r.tema,
            copy: r.copy,
            hashtags: r.hashtags,
            daily_goal: r.objetivo,
            status: normalizeContentStatus(r.status),
          }))
        )
      }
    }
  }

  // Atualiza timestamp de sincronia
  await admin
    .from('clients')
    .update({ google_sheet_last_sync: new Date().toISOString() })
    .eq('id', clientId)

  return {
    oportunidades: opRows.length,
    timeline: tlRows.length,
    reunioes: mtgRows.length,
    materiais: matRows.length,
    calendario: calRows.length,
    planejamento: planRows.length,
  }
}

// ── Normalizadores ────────────────────────────────────────────────

function normalizePriority(v: string): 'alta' | 'media' | 'baixa' {
  const s = v?.toLowerCase().trim()
  if (s === 'alta' || s === 'high') return 'alta'
  if (s === 'baixa' || s === 'low') return 'baixa'
  return 'media'
}

function normalizeWorkflowStatus(v: string): string {
  const s = v?.toLowerCase().trim().replace(/\s+/g, '_')
  if (s?.includes('analise') || s?.includes('análise')) return 'em_analise'
  if (s?.includes('aprovad')) return 'aprovada'
  return 'nova'
}

function normalizeMaterialType(v: string): string {
  const s = v?.toLowerCase().trim()
  const map: Record<string, string> = {
    carrossel: 'carrossel', carousel: 'carrossel',
    reels: 'reels', reel: 'reels', vídeo: 'reels', video: 'reels',
    stories: 'stories', story: 'stories',
    anúncio: 'anuncio', anuncio: 'anuncio', ad: 'anuncio',
  }
  return map[s] ?? 'outro'
}

function normalizeMaterialStatus(v: string): string {
  const s = v?.toLowerCase().trim()
  if (s?.includes('aprovad')) return 'aprovado'
  if (s?.includes('alter')) return 'alteracoes_solicitadas'
  return 'pendente'
}

function normalizeCalendarType(v: string): string {
  const s = v?.toLowerCase().trim()
  if (s?.includes('reuni')) return 'reuniao'
  if (s?.includes('prazo') || s?.includes('deadline')) return 'prazo'
  if (s?.includes('entrega')) return 'entrega'
  return 'acao'
}

function normalizeContentFormat(v: string): string {
  const s = v?.toLowerCase().trim()
  if (s?.includes('reel')) return 'reels'
  if (s?.includes('carr') || s?.includes('carousel')) return 'carrossel'
  if (s?.includes('stori')) return 'stories'
  return 'feed'
}

function normalizeContentStatus(v: string): string {
  const s = v?.toLowerCase().trim()
  if (s?.includes('public')) return 'publicado'
  if (s?.includes('produz')) return 'produzido'
  return 'planejado'
}

function buildDateTime(date: string, time: string): string {
  if (!date) return new Date().toISOString()
  const d = date.trim()
  const t = time?.trim() || '09:00'
  // Tenta YYYY-MM-DD, DD/MM/YYYY
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return `${d}T${t}:00`
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
    const [dd, mm, yyyy] = d.split('/')
    return `${yyyy}-${mm}-${dd}T${t}:00`
  }
  return new Date().toISOString()
}
