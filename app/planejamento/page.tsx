import { requireProfile, createServerClient } from '@/lib/server/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Instagram, FileSpreadsheet } from 'lucide-react'

export default async function PlanejamentoPage() {
  const profile = await requireProfile()
  const supabase = createServerClient()

  // Busca os planos mais recentes do cliente
  const { data: plans = [] } = await supabase
    .from('content_plans')
    .select('*, items:content_items(*)')
    .eq('client_id', profile.client_id)
    .order('week_start', { ascending: false })
    .limit(4)

  const statusClass: Record<string, string> = {
    publicado: 'status-aprovado',
    produzido: 'status-aprovado',
    planejado: 'status-pendente',
  }

  const statusLabel: Record<string, string> = {
    publicado: 'Publicado',
    produzido: 'Produzido',
    planejado: 'Aguardando',
  }

  // Coleta todos os itens de todos os planos, agrupados por week_label
  const allItems = plans?.flatMap(p => p.items ?? []) ?? []
  const weekGroups = new Map<string, typeof allItems>()
  allItems.forEach((item: any) => {
    const label = item.week_label || 'Semana'
    if (!weekGroups.has(label)) weekGroups.set(label, [])
    weekGroups.get(label)!.push(item)
  })

  return (
    <div className="flex h-screen bg-areia overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Planejamento Instagram" subtitle="Grade editorial de conteúdo" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {weekGroups.size === 0 ? (
              <div className="card px-6 py-16 flex flex-col items-center gap-3 text-center">
                <FileSpreadsheet size={32} className="text-nude" />
                <p className="text-sm font-medium text-darkest">Nenhum conteúdo planejado</p>
                <p className="text-xs text-marrom/50 max-w-xs">
                  Preencha a aba <strong>Planejamento</strong> na planilha do cliente e clique em Sincronizar nas Configurações.
                </p>
              </div>
            ) : (
              Array.from(weekGroups.entries()).map(([weekLabel, posts]) => (
                <div key={weekLabel}>
                  <h2 className="label-overline mb-4 flex items-center gap-2">
                    <Instagram size={14} /> {weekLabel}
                  </h2>
                  <div className="grid gap-4">
                    {posts.map((post: any) => (
                      <div key={post.id} className="card p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs font-semibold text-bronze bg-bronze/10 px-2.5 py-1 rounded-pill">
                              {post.post_date
                                ? new Date(post.post_date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
                                : '—'}
                            </span>
                            <span className="text-xs text-marrom/50 font-medium">{post.format}</span>
                            <span className="text-xs font-semibold text-darkest">{post.theme ?? post.title}</span>
                          </div>
                          <span className={statusClass[post.status] ?? 'status-pendente'}>
                            {statusLabel[post.status] ?? post.status}
                          </span>
                        </div>
                        {post.copy && (
                          <p className="text-sm text-marrom/70 mb-2">"{post.copy}"</p>
                        )}
                        {post.hashtags && (
                          <p className="text-xs text-bronze/60">{post.hashtags}</p>
                        )}
                        {post.daily_goal && (
                          <p className="text-xs text-marrom/40 mt-1">Objetivo: {post.daily_goal}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
