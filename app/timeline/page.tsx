import { requireProfile, createServerClient } from '@/lib/server/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { CheckCircle, Circle, Clock, Zap, FileSpreadsheet } from 'lucide-react'

export default async function TimelinePage() {
  const profile = await requireProfile()
  const supabase = createServerClient()

  const { data: etapas = [] } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('client_id', profile.client_id)
    .order('event_date')

  const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    concluido:  { icon: <CheckCircle size={20} />, color: 'text-success', label: 'Concluído' },
    ativo:      { icon: <Zap size={20} />, color: 'text-bronze', label: 'Em andamento' },
    proximo:    { icon: <Clock size={20} />, color: 'text-warning', label: 'Próximo' },
    futuro:     { icon: <Circle size={20} />, color: 'text-nude', label: 'Planejado' },
  }

  function getStatusKey(label: string) {
    const s = (label ?? '').toLowerCase()
    if (s.includes('conclu') || s.includes('conclui')) return 'concluido'
    if (s.includes('ativo') || s.includes('andamento')) return 'ativo'
    if (s.includes('pr') && s.includes('xim')) return 'proximo'
    return 'futuro'
  }

  return (
    <div className="flex h-screen bg-areia overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Timeline / Jornada" subtitle="Evolução estratégica do seu negócio" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            {!etapas || etapas.length === 0 ? (
              <div className="card px-6 py-16 flex flex-col items-center gap-3 text-center">
                <FileSpreadsheet size={32} className="text-nude" />
                <p className="text-sm font-medium text-darkest">Nenhuma etapa cadastrada</p>
                <p className="text-xs text-marrom/50 max-w-xs">
                  Preencha a aba <strong>Timeline</strong> na planilha do cliente e clique em Sincronizar nas Configurações.
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-[28px] top-0 bottom-0 w-px bg-bege" />
                <div className="space-y-8">
                  {etapas.map((etapa, i) => {
                    const statusKey = getStatusKey(etapa.status_label ?? '')
                    const cfg = statusConfig[statusKey]
                    const isAtivo = statusKey === 'ativo'
                    return (
                      <div key={etapa.id} className="flex gap-6 relative">
                        <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center z-10 ${statusKey === 'concluido' ? 'bg-success/10' : isAtivo ? 'bg-bronze/10' : 'bg-bege'} ${cfg.color}`}>
                          {cfg.icon}
                        </div>
                        <div className={`flex-1 card p-5 ${isAtivo ? 'border-bronze/40 shadow-card-hover' : ''}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-label text-bronze/60 mb-1">
                                {etapa.badge_label ?? new Date(etapa.event_date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                              </p>
                              <h3 className="font-display font-semibold text-darkest">{etapa.title}</h3>
                            </div>
                            <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                          </div>
                          <p className="text-sm text-marrom/60">{etapa.description}</p>
                          {isAtivo && (
                            <div className="mt-3 pt-3 border-t border-bege">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-bege rounded-full overflow-hidden">
                                  <div className="h-full bg-bronze rounded-full" style={{ width: '65%' }} />
                                </div>
                                <span className="text-xs text-bronze font-semibold">65%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
