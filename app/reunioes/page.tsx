import { requireAuth } from '@/lib/server/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Video, Calendar, Clock, CheckCircle, Link } from 'lucide-react'

export default async function ReunioesPage() {
  const profile = await requireAuth()
  const reunioes = [
    { id:1, titulo:'Review Mensal Junho 2026', data:'08 Jul 2026', hora:'14:00', duracao:'60 min', tipo:'estrategica', status:'agendada', pauta:['Resultados Q2','Planejamento Q3','Novas oportunidades'] },
    { id:2, titulo:'Apresentacao Criativos Julho', data:'10 Jul 2026', hora:'10:00', duracao:'45 min', tipo:'operacional', status:'agendada', pauta:['Aprovacao de pecas','Ajustes de copy','Datas de publicacao'] },
    { id:3, titulo:'Alinhamento Campanha iFood', data:'15 Jul 2026', hora:'15:30', duracao:'30 min', tipo:'operacional', status:'agendada', pauta:['Briefing parceria','Cronograma de ativacao'] },
    { id:4, titulo:'Sessao de Planejamento Agosto', data:'22 Jul 2026', hora:'09:00', duracao:'90 min', tipo:'estrategica', status:'agendada', pauta:['Metas de crescimento','Expansao geografica','Budget Q3'] },
    { id:5, titulo:'Review Mensal Maio 2026', data:'10 Jun 2026', hora:'14:00', duracao:'60 min', tipo:'estrategica', status:'realizada', pauta:['Resultados Meta Ads','Aprovacao planejamento junho'] },
  ]
  const tipoColor: Record<string,string> = { estrategica:'text-bronze bg-bronze/10', operacional:'text-marrom/60 bg-bege' }
  return (
    <div className="flex h-screen bg-areia overflow-hidden">
      <Sidebar role={profile.role} clientName="Givo Acai" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Reunioes" subtitle="Agenda de encontros estrategicos" clientName="Givo Acai" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-4">
            {reunioes.map(r => (
              <div key={r.id} className={`card p-6 ${r.status === 'realizada' ? 'opacity-60' : 'card-hover'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-card flex items-center justify-center flex-shrink-0 ${r.status === 'realizada' ? 'bg-bege text-nude' : 'bg-bronze/10 text-bronze'}`}>
                    <Video size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-display font-semibold text-darkest">{r.titulo}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-marrom/50"><Calendar size={12} /> {r.data}</span>
                          <span className="flex items-center gap-1 text-xs text-marrom/50"><Clock size={12} /> {r.hora} - {r.duracao}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-pill ${tipoColor[r.tipo]}`}>{r.tipo}</span>
                        {r.status === 'realizada' ? <span className="flex items-center gap-1 text-xs text-success"><CheckCircle size={12} /> Realizada</span> : <span className="text-xs text-warning font-semibold">Agendada</span>}
                      </div>
                    </div>
                    <div className="border-t border-bege pt-3 mt-3">
                      <p className="text-label text-marrom/40 mb-2">Pauta</p>
                      <ul className="space-y-1">
                        {r.pauta.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-marrom/70">
                            <span className="w-1 h-1 rounded-full bg-bronze flex-shrink-0" />{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {r.status === 'agendada' && (
                      <div className="mt-4 flex gap-3">
                        <button className="btn-primary text-xs px-4 py-2"><Link size={12} /> Entrar na Reuniao</button>
                        <button className="btn-ghost text-xs px-4 py-2">Ver detalhes</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
