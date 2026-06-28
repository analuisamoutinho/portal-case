import { requireAuth } from '@/lib/server/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Instagram } from 'lucide-react'

export default async function PlanejamentoPage() {
  const profile = await requireAuth()
  const posts = [
    { semana:1, dia:'Seg 07', formato:'Reels 30s', tema:'Ritual do Acai Premium', copy:'O verao pode acabar, mas o ritual do acai e para sempre', hashtags:'#givoacao #acaibh #premium', status:'aprovado' },
    { semana:1, dia:'Qua 09', formato:'Carrossel', tema:'Beneficios do Acai', copy:'5 razoes para incluir acai na sua rotina', hashtags:'#saudeebem #acai #fitness', status:'aprovado' },
    { semana:1, dia:'Sex 11', formato:'Stories Quiz', tema:'Qual sabor combina com voce?', copy:'Responde nosso quiz e descubra!', hashtags:'', status:'aprovado' },
    { semana:2, dia:'Seg 14', formato:'Feed foto', tema:'Colecao Inverno', copy:'Acai quentinho de coracao - Conheca nossa linha inverno', hashtags:'#acaiinverno #givoacao', status:'pendente' },
    { semana:2, dia:'Qua 16', formato:'Reels 15s', tema:'Bastidores producao', copy:'Por tras de cada tigela, muito amor e cuidado', hashtags:'#bastidores #artesanal', status:'pendente' },
    { semana:2, dia:'Sex 18', formato:'Collab', tema:'Ativacao Influenciadoras', copy:'Parceria fitness - treino mais acai igual combinacao perfeita', hashtags:'#parceria #fitness', status:'alteracoes' },
    { semana:3, dia:'Seg 21', formato:'Carrossel', tema:'Cardapio Julho', copy:'Vem conhecer as novidades de julho', hashtags:'#menu #julho #novidade', status:'pendente' },
    { semana:3, dia:'Qui 24', formato:'Reels 30s', tema:'Campanha Sazonalidade', copy:'Inverno pede um acai especial - oferta por tempo limitado', hashtags:'#oferta #inverno #acai', status:'pendente' },
  ]
  const statusClass: Record<string,string> = { aprovado:'status-aprovado', pendente:'status-pendente', alteracoes:'status-alteracoes' }
  const statusLabel: Record<string,string> = { aprovado:'Aprovado', pendente:'Aguardando', alteracoes:'Com alteracoes' }
  const semanas = [1, 2, 3]
  return (
    <div className="flex h-screen bg-areia overflow-hidden">
      <Sidebar role={profile.role} clientName="Givo Acai" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Planejamento Instagram" subtitle="Grade editorial - Julho 2026" clientName="Givo Acai" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {semanas.map(s => {
              const postsSemana = posts.filter(p => p.semana === s)
              return (
                <div key={s}>
                  <h2 className="label-overline mb-4 flex items-center gap-2">
                    <Instagram size={14} /> Semana {s}
                  </h2>
                  <div className="grid gap-4">
                    {postsSemana.map((post, i) => (
                      <div key={i} className="card p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-bronze bg-bronze/10 px-2.5 py-1 rounded-pill">{post.dia}</span>
                            <span className="text-xs text-marrom/50 font-medium">{post.formato}</span>
                            <span className="text-xs font-semibold text-darkest">{post.tema}</span>
                          </div>
                          <span className={statusClass[post.status]}>{statusLabel[post.status]}</span>
                        </div>
                        <p className="text-sm text-marrom/70 mb-2">"{post.copy}"</p>
                        {post.hashtags && <p className="text-xs text-bronze/60">{post.hashtags}</p>}
                      </div>
                    ))}
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
