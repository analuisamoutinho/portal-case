import { NextRequest, NextResponse } from 'next/server'
import { requireProfile, createAdminClient } from '@/lib/server/supabase'
import { createClientSheet } from '@/lib/server/google-sheets'
import { isCaseTeam } from '@/lib/server/rbac'

export async function POST(req: NextRequest) {
  try {
    const profile = await requireProfile()

    if (!isCaseTeam(profile.role as any)) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const { clientId } = await req.json()
    if (!clientId) return NextResponse.json({ error: 'clientId obrigatório' }, { status: 400 })

    const admin = createAdminClient()
    const { data: client, error } = await admin
      .from('clients')
      .select('id, name, google_sheet_id')
      .eq('id', clientId)
      .single()

    if (error || !client) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    const sheetId = await createClientSheet(client.name)

    await admin
      .from('clients')
      .update({ google_sheet_id: sheetId })
      .eq('id', clientId)

    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`
    return NextResponse.json({ ok: true, sheetId, sheetUrl })
  } catch (err: any) {
    console.error('[sheets/create]', err)
    return NextResponse.json({ error: err.message ?? 'Erro ao criar planilha' }, { status: 500 })
  }
}
