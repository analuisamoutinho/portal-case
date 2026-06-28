import { requireProfile, createServerClient } from '@/lib/server/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Instagram, Megaphone, Video, FileText, FileSpreadsheet } from 'lucide-react'

export default async function CalendarioPage() {
  const profile = await requireProfile()
  const supabase = createServerClient()

  const { data: eventos = [] } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('client_id', profile.client_id)
    .order('starts_at')

  const tipoConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    acao:     { color: 'text-bronze',  bg: 'bg-bronze/10',  icon: <Instagram size={14} /> },
    campanha: { color: 'text-warning', bg: 'bg-warning/10', icon: <Megaphone size={14} /> },
    reuniao:  { color: 'text-marrom',  bg: 'bg-bege',       icon: <Video size={14} /> },
    prazo:    { color: 'text-success', bg: 'bg-success/10', icon: <FileText size={14} /> },
    entrega:  { color: 'text-success', bg: 'bg-success/10', icon: <FileText size={14} /> },
  }

  return (
    <div className="flex h-screen bg-areia overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Calendário" subtitle="Agenda editorial e de campanhas" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {/* Legenda */}
            <div className="flex gap-4 mb-6 flex-wrap">
              {Object.entries(tipoConfig).map(([tipo, cfg]) => (
                <span key={tipo} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-pill ${cfg.bg} ${cfg.color}`}>
                  {cfg.icon} {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </span>
              ))}
            </div>

            {!eventos || eventos.length === 0 ? (
              <div className="card px-6 py-16 flex flex-col items-center gap-3 text-center">
                <FileSpreadsheet size={32} className="text-nude" />
                <p className="text-sm font-medium text-darkest">Nenhum evento cadastrado</p>
                <p className="text-xs text-marrom/50 max-w-xs">
                  Preencha a aba <strong>Calendário</strong> na planilha do cliente e clique em Sincronizar nas Configurações.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {eventos.map((ev) => {
                  const date = new Date(ev.starts_at)
                  const cfg = tipoConfig[ev.type] ?? tipoConfig.acao
                  return (
                    <div key={ev.id} className="card card-hover p-4 flex items-start gap-4">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-card ${cfg.bg} flex flex-col items-center justify-center`}>
                        <span className={`text-xl font-display font-bold ${cfg.color}`}>
                          {date.getDate().toString().padStart(2, '0')}
                        </span>
                        <span className={`text-[10px] uppercase tracking-wider ${cfg.color}`}>
                          {date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-darkest text-sm">{ev.title}</h3>
                          <span className={`flex items-center gap-1 text-xs font-semibold ${cfg.color}`}>
                            {cfg.icon}
                            {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {ev.description && (
                          <p className="text-xs text-marrom/50 mt-1">{ev.description}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
