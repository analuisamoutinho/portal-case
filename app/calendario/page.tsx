import { requireAuth } from '@/lib/server/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Instagram, Megaphone, Video, FileText } from 'lucide-react'

export default async function CalendarioPage() {
  const profile = await requireAuth()
  const eventos = [
    { dia:'07', mes:'Jul', titulo:'Publicacao Reels Acai Premium', tipo:'social', hora:'09:00', descricao:'Video 30s produto hero da linha premium' },
    { dia:'08', mes:'Jul', titulo:'Review Mensal Reuniao', tipo:'reuniao', hora:'14:00', descricao:'Apresentacao de resultados e planejamento Q3' },
    { dia:'10', mes:'Jul', titulo:'Lancamento Campanha Google Ads', tipo:'campanha', hora:'08:00', descricao:'Go-live das campanhas de busca local' },
    { dia:'10', mes:'Jul', titulo:'Aprovacao Criativos Julho', tipo:'reuniao', hora:'10:00', descricao:'Review e aprovacao das pecas de midia paga' },
    { dia:'14', mes:'Jul', titulo:'Stories Quiz Interativo', tipo:'social', hora:'11:00', descricao:'Sequencia de stories com quiz sobre sabores' },
    { dia:'15', mes:'Jul', titulo:'Publicacao Feed Colecao Inverno', tipo:'social', hora:'12:00', descricao:'Carrossel 6 fotos produto outono inverno' },
    { dia:'18', mes:'Jul', titulo:'Ativacao Influenciadoras Fitness', tipo:'campanha', hora:'09:00', descricao:'Inicio das publicacoes com parceiras fitness' },
    { dia:'22', mes:'Jul', titulo:'Sessao Planejamento Agosto', tipo:'reuniao', hora:'09:00', descricao:'Definicao de metas e estrategias para agosto' },
    { dia:'25', mes:'Jul', titulo:'Reels Campanha Inverno', tipo:'social', hora:'10:00', descricao:'Video 15s campanha sazonal com oferta especial' },
    { dia:'28', mes:'Jul', titulo:'Relatorio Mensal Meta Ads', tipo:'relatorio', hora:'17:00', descricao:'Entrega do relatorio completo de julho' },
  ]
  const tipoConfig: Record<string,{ color:string, bg:string, icon:React.ReactNode }> = {
    social:    { color:'text-bronze',  bg:'bg-bronze/10',  icon:<Instagram size={14}/> },
    campanha:  { color:'text-warning', bg:'bg-warning/10', icon:<Megaphone size={14}/> },
    reuniao:   { color:'text-marrom',  bg:'bg-bege',       icon:<Video size={14}/> },
    relatorio: { color:'text-success', bg:'bg-success/10', icon:<FileText size={14}/> },
  }
  return (
    <div className="flex h-screen bg-areia overflow-hidden">
      <Sidebar role={profile.role} clientName="Givo Acai" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Calendario" subtitle="Agenda editorial e de campanhas - Julho 2026" clientName="Givo Acai" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4 mb-6 flex-wrap">
              {Object.entries(tipoConfig).map(([tipo, cfg]) => (
                <span key={tipo} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-pill ${cfg.bg} ${cfg.color}`}>
                  {cfg.icon} {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </span>
              ))}
            </div>
            <div className="space-y-3">
              {eventos.map((ev, i) => {
                const cfg = tipoConfig[ev.tipo]
                return (
                  <div key={i} className="card card-hover p-4 flex items-start gap-4">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-card ${cfg.bg} flex flex-col items-center justify-center`}>
                      <span className={`text-xl font-display font-bold ${cfg.color}`}>{ev.dia}</span>
                      <span className={`text-[10px] uppercase tracking-wider ${cfg.color}`}>{ev.mes}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-darkest text-sm">{ev.titulo}</h3>
                        <span className={`flex items-center gap-1 text-xs font-semibold ${cfg.color}`}>{cfg.icon} {ev.hora}</span>
                      </div>
                      <p className="text-xs text-marrom/50 mt-1">{ev.descricao}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
