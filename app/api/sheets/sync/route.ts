import { NextRequest, NextResponse } from 'next/server'
import { requireProfile } from '@/lib/server/supabase'
import { createServerClient } from '@/lib/server/supabase'
import { syncClientSheet } from '@/lib/server/google-sheets'
import { isCaseTeam } from '@/lib/server/rbac'

export async function POST(req: NextRequest) {
  try {
    const profile = await requireProfile()

    // Apenas CASE team pode sincronizar
    if (!isCaseTeam(profile.role as any)) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const { clientId } = await req.json()
    if (!clientId) return NextResponse.json({ error: 'clientId obrigatório' }, { status: 400 })

    const supabase = createServerClient()
    const { data: client, error } = await supabase
      .from('clients')
      .select('id, name, google_sheet_id')
      .eq('id', clientId)
      .single()

    if (error || !client) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }
    if (!client.google_sheet_id) {
      return NextResponse.json({ error: 'Nenhuma planilha vinculada a este cliente' }, { status: 400 })
    }

    const counts = await syncClientSheet(clientId, client.google_sheet_id)

    return NextResponse.json({ ok: true, counts })
  } catch (err: any) {
    console.error('[sheets/sync]', err)
    return NextResponse.json({ error: err.message ?? 'Erro ao sincronizar' }, { status: 500 })
  }
}
