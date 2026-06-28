import { requireAuth } from '@/lib/server/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Target, TrendingUp, Clock, CheckCircle } from 'lucide-react'

export default async function OportunidadesPage() {
  const profile = await requireAuth()

  const oportunidades = [
    { id: 1, titulo: 'Expandir linha de açaí premium', prioridade: 'Alta', status: 'Em análise', prazo: '15 Jul 2026', impacto: '+R$ 45k/mês' },
    { id: 2, titulo: 'Parceria com academias da região', prioridade: 'Alta', status: 'Nova', prazo: '30 Jul 2026', impacto: '+R$ 28k/mês' },
    { id: 3, titulo: 'Programa de fidelidade digital', prioridade: 'Média', status: 'Em análise', prazo: '10 Ago 2026', impacto: '+22% recompra' },
    { id: 4, titulo: 'Delivery via iFood premium', prioridade: 'Alta', status: 'Nova', prazo: '20 Jul 2026', impacto: '+R$ 18k/mês' },
    { id: 5, titulo: 'Kit presente corporativo', prioridade: 'Média', status: 'Aprovada', prazo: '01 Ago 2026', impacto: '+R$ 12k/mês' },
    { id: 6, titulo: 'Campanha sazonalidade inverno', prioridade: 'Baixa', status: 'Aprovada', prazo: '25 Jul 2026', impacto: '+15% vendas' },
    { id: 7, titulo: 'Influenciadores fitness locais', prioridade: 'Alta', status: 'Nova', prazo: '18 Jul 2026', impacto: '+R$ 32k/mês' },
    { id: 8, titulo: 'Otimização checkout mobile', prioridade: 'Alta', status: 'Em análise', prazo: '12 Jul 2026', impacto: '+8% conversão' },
    { id: 9, titulo: 'Linha low-carb para dietas', prioridade: 'Média', status: 'Nova', prazo: '05 Ago 2026', impacto: '+R$ 22k/mês' },
    { id: 10, titulo: 'Google Ads para buscas locais', prioridade: 'Alta', status: 'Aprovada', prazo: '08 Jul 2026', impacto: '+R$ 25k/mês' },
    { id: 11, titulo: 'Stories interativos com quiz', prioridade: 'Baixa', status: 'Nova', prazo: '22 Ago 2026', impacto: '+18% engajamento' },
    { id: 12, titulo: 'Plano assinatura mensal açaí', prioridade: 'Alta', status: 'Em análise', prazo: '01 Set 2026', impacto: '+R$ 55k/mês' },
  ]

  const prioridadeClass: Record<string, string> = {
    Alta: 'badge-alta',
    Média: 'badge-media',
    Baixa: 'badge-baixa',
  }

  const statusIcon: Record<string, React.ReactNode> = {
    Nova: <Clock size={14} className="text-nude" />,
    'Em análise': <TrendingUp size={14} className="text-warning" />,
    Aprovada: <CheckCircle size={14} className="text-success" />,
  }

  return (
    <div className="flex h-screen bg-areia overflow-hidden">
      <Sidebar role={profile.role} clientName="Givo Açaí" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Oportunidades" subtitle="Ações estratégicas identificadas para o seu negócio" clientName="Givo Açaí" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="kpi-card">
                <span className="kpi-label">Total</span>
                <span className="kpi-value">{oportunidades.length}</span>
                <span className="text-xs text-marrom/50">oportunidades mapeadas</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">Alta prioridade</span>
                <span className="kpi-value text-danger">{oportunidades.filter(o => o.prioridade === 'Alta').length}</span>
                <span className="text-xs text-marrom/50">ações urgentes</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">Aprovadas</span>
                <span className="kpi-value text-success">{oportunidades.filter(o => o.status === 'Aprovada').length}</span>
                <span className="text-xs text-marrom/50">prontas para executar</span>
              </div>
            </div>

            {/* Lista */}
            <div className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-bege flex items-center gap-2">
                <Target size={18} className="text-bronze" />
                <h2 className="font-display font-semibold text-darkest">Oportunidades Estratégicas</h2>
              </div>
              <div className="divide-y divide-bege/60">
                {oportunidades.map(op => (
                  <div key={op.id} className="px-6 py-4 flex items-center gap-4 hover:bg-areia/40 transition-colors">
                    <span className="text-bronze/40 font-mono text-xs w-6 text-center">{op.id}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-darkest">{op.titulo}</p>
                      <p className="text-xs text-marrom/50 mt-0.5">Prazo: {op.prazo}</p>
                    </div>
                    <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-pill">{op.impacto}</span>
                    <div className="flex items-center gap-1.5">
                      {statusIcon[op.status]}
                      <span className="text-xs text-marrom/60">{op.status}</span>
                    </div>
                    <span className={prioridadeClass[op.prioridade]}>{op.prioridade}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
