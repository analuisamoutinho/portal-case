import { requireAuth } from '@/lib/server/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { LabWidget } from './LabWidget'

export default async function LabPage() {
  const profile = await requireAuth()

  return (
    <div className="flex h-screen bg-areia overflow-hidden">
      <Sidebar role={profile.role} clientName="Givo Açaí" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="CASE Lab" subtitle="Inteligência artificial a serviço da sua estratégia" clientName="Givo Açaí" />
        <main className="flex-1 overflow-y-auto p-8">
          <LabWidget />
        </main>
      </div>
    </div>
  )
}
