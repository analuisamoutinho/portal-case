import { requireProfile, createServerClient } from '@/lib/server/supabase'
import { isCaseTeam } from '@/lib/server/rbac'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { SheetSyncPanel } from './SheetSyncPanel'
import { redirect } from 'next/navigation'

export default async function ConfiguracoesPage() {
  const profile = await requireProfile()

  if (!isCaseTeam(profile.role as any)) redirect('/dashboard')

  const supabase = createServerClient()
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, google_sheet_id, google_sheet_last_sync')
    .eq('active', true)
    .order('name')

  return (
    <div className="flex h-screen bg-areia overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Configurações" subtitle="Gerencie as planilhas vinculadas a cada cliente" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            <SheetSyncPanel clients={clients ?? []} />
          </div>
        </main>
      </div>
    </div>
  )
}
