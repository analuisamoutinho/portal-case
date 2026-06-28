import { requireAuth } from '@/lib/server/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { CheckCircle, Circle, Clock, Zap } from 'lucide-react'

export default async function TimelinePage() {
  const profile = await requireAuth()

  const etapas = [
    { mes: 'Março 2026', titulo: 'Diagnóstico Inicial', status: 'concluido', descricao: 'Análise completa do negócio, público-alvo e posicionamento de marca.' },
    { mes: 'Abril 2026', titulo: 'Estrutura Digital', status: 'concluido', descricao: 'Site, perfis de redes sociais e identidade visual alinhados.' },
    { mes: 'Maio 2026', titulo: 'Primeiras Campanhas Meta Ads', status: 'concluido', descricao: 'Lançamento das campanhas de tráfego pago com testes A/B.' },
    { mes: 'Junho 2026', titulo: 'Otimização e Escala', status: 'ativo', descricao: 'Campanhas otimizadas atingindo ROAS 8,99. Início do plano de expansão.' },
    { mes: 'Julho 2026', titulo: 'Novos Canais de Aquisição', status: 'proximo', descricao: 'Google Ads, influenciadores locais e programa de indicação.' },
    { mes: 'Agosto 2026', titulo: 'Fidelização e Retenção', status: 'futuro', descricao: 'Programa de fidelidade digital e CRM de clientes ativos.' },
    { mes: 'Setembro 2026', titulo: 'Expansão Geográfica', status: 'futuro', descricao: 'Abertura de novos pontos de venda com suporte de marketing local.' },
    { mes: 'Outubro 2026', titulo: 'Review Anual e Planejamento 2027', status: 'futuro', descricao: 'Análise de resultados e definição de metas para o próximo ciclo.' },
  ]

  const statusConfig: Record<string, { icon: React.ReactNode, color: string, label: string }> = {
    concluido: { icon: <CheckCircle size={20} />, color: 'text-success', label: 'Concluído' },
    ativo:     { icon: <Zap size={20} />, color: 'text-bronze', label: 'Em andamento' },
    proximo:   { icon: <Clock size={20} />, color: 'text-warning', label: 'Próximo' },
    futuro:    { icon: <Circle size={20} />, color: 'text-nude', label: 'Planejado' },
  }

  return (
    <div className="flex h-screen bg-areia overflow-hidden">
      <Sidebar role={profile.role} clientName="Givo Açaí" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Timeline / Jornada" subtitle="Evolução estratégica do seu negócio" clientName="Givo Açaí" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Linha vertical */}
              <div className="absolute left-[28px] top-0 bottom-0 w-px bg-bege" />
              <div className="space-y-8">
                {etapas.map((etapa, i) => {
                  const cfg = statusConfig[etapa.status]
                  return (
                    <div key={i} className="flex gap-6 relative">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center z-10 ${etapa.status === 'concluido' ? 'bg-success/10' : etapa.status === 'ativo' ? 'bg-bronze/10' : 'bg-bege'} ${cfg.color}`}>
                        {cfg.icon}
                      </div>
                      <div className={`flex-1 card p-5 ${etapa.status === 'ativo' ? 'border-bronze/40 shadow-card-hover' : ''}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-label text-bronze/60 mb-1">{etapa.mes}</p>
                            <h3 className="font-display font-semibold text-darkest">{etapa.titulo}</h3>
                          </div>
                          <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                        </div>
                        <p className="text-sm text-marrom/60">{etapa.descricao}</p>
                        {etapa.status === 'ativo' && (
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
          </div>
        </main>
      </div>
    </div>
  )
}
