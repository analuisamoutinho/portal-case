import { requireProfile, createServerClient } from '@/lib/server/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Video, Calendar, Clock, CheckCircle, FileSpreadsheet } from 'lucide-react'

export default async function ReunioesPage() {
  const profile = await requireProfile()
  const supabase = createServerClient()

  const { data: reunioes = [] } = await supabase
    .from('meetings')
    .select('*')
    .eq('client_id', profile.client_id)
    .order('meeting_date', { ascending: false })

  const tipoColor: Record<string, string> = {
    estrategica: 'text-bronze bg-bronze/10',
    operacional: 'text-marrom/60 bg-bege',
  }

  return (
    <div className="flex h-screen bg-areia overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Reuniões" subtitle="Agenda de encontros estratégicos" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-4">
            {!reunioes || reunioes.length === 0 ? (
              <div className="card px-6 py-16 flex flex-col items-center gap-3 text-center">
                <FileSpreadsheet size={32} className="text-nude" />
                <p className="text-sm font-medium text-darkest">Nenhuma reunião cadastrada</p>
                <p className="text-xs text-marrom/50 max-w-xs">
                  Preencha a aba <strong>Reuniões</strong> na planilha do cliente e clique em Sincronizar nas Configurações.
                </p>
              </div>
            ) : reunioes.map(r => {
              const pauta = r.agenda ? r.agenda.split('|').map((s: string) => s.trim()).filter(Boolean) : []
              const isRealizada = r.summary?.toLowerCase().includes('realizada') || r.summary?.toLowerCase().includes('concluida')
              const tipo = r.meeting_type?.toLowerCase() ?? 'operacional'

              return (
                <div key={r.id} className={`card p-6 ${isRealizada ? 'opacity-60' : 'card-hover'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-card flex items-center justify-center flex-shrink-0 ${isRealizada ? 'bg-bege text-nude' : 'bg-bronze/10 text-bronze'}`}>
                      <Video size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-display font-semibold text-darkest">{r.title}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-xs text-marrom/50">
                              <Calendar size={12} />
                              {new Date(r.meeting_date).toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' })}
                            </span>
                            {r.meeting_time && (
                              <span className="flex items-center gap-1 text-xs text-marrom/50">
                                <Clock size={12} />
                                {r.meeting_time}{r.duration_minutes ? ` · ${r.duration_minutes} min` : ''}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-pill ${tipoColor[tipo] ?? tipoColor.operacional}`}>
                            {tipo}
                          </span>
                          {isRealizada
                            ? <span className="flex items-center gap-1 text-xs text-success"><CheckCircle size={12} /> Realizada</span>
                            : <span className="text-xs text-warning font-semibold">Agendada</span>}
                        </div>
                      </div>

                      {pauta.length > 0 && (
                        <div className="border-t border-bege pt-3 mt-3">
                          <p className="text-label text-marrom/40 mb-2">Pauta</p>
                          <ul className="space-y-1">
                            {pauta.map((item: string, i: number) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-marrom/70">
                                <span className="w-1 h-1 rounded-full bg-bronze flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {!isRealizada && r.video_url && (
                        <div className="mt-4">
                          <a
                            href={r.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5"
                          >
                            <Video size={12} /> Entrar na Reunião
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}
