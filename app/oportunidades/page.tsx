import { requireProfile, createServerClient } from '@/lib/server/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Target, TrendingUp, Clock, CheckCircle, FileSpreadsheet } from 'lucide-react'

export default async function OportunidadesPage() {
  const profile = await requireProfile()
  const supabase = createServerClient()

  const { data: oportunidades = [] } = await supabase
    .from('opportunities')
    .select('*')
    .eq('client_id', profile.client_id)
    .eq('status', 'active')
    .order('order_position')

  const prioridadeClass: Record<string, string> = {
    alta: 'badge-alta',
    media: 'badge-media',
    baixa: 'badge-baixa',
  }

  const statusIcon: Record<string, React.ReactNode> = {
    nova: <Clock size={14} className="text-nude" />,
    em_analise: <TrendingUp size={14} className="text-warning" />,
    aprovada: <CheckCircle size={14} className="text-success" />,
  }

  const statusLabel: Record<string, string> = {
    nova: 'Nova',
    em_analise: 'Em análise',
    aprovada: 'Aprovada',
  }

  const total = oportunidades?.length ?? 0
  const altaPrioridade = oportunidades?.filter(o => o.priority === 'alta').length ?? 0
  const aprovadas = oportunidades?.filter(o => o.workflow_status === 'aprovada').length ?? 0

  return (
    <div className="flex h-screen bg-areia overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Oportunidades" subtitle="Ações estratégicas identificadas para o seu negócio" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="kpi-card">
                <span className="kpi-label">Total</span>
                <span className="kpi-value">{total}</span>
                <span className="text-xs text-marrom/50">oportunidades mapeadas</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">Alta prioridade</span>
                <span className="kpi-value text-danger">{altaPrioridade}</span>
                <span className="text-xs text-marrom/50">ações urgentes</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">Aprovadas</span>
                <span className="kpi-value text-success">{aprovadas}</span>
                <span className="text-xs text-marrom/50">prontas para executar</span>
              </div>
            </div>

            {/* Lista */}
            <div className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-bege flex items-center gap-2">
                <Target size={18} className="text-bronze" />
                <h2 className="font-display font-semibold text-darkest">Oportunidades Estratégicas</h2>
              </div>

              {total === 0 ? (
                <div className="px-6 py-16 flex flex-col items-center gap-3 text-center">
                  <FileSpreadsheet size={32} className="text-nude" />
                  <p className="text-sm font-medium text-darkest">Nenhuma oportunidade cadastrada</p>
                  <p className="text-xs text-marrom/50 max-w-xs">
                    Preencha a aba <strong>Oportunidades</strong> na planilha do cliente e clique em Sincronizar nas Configurações.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-bege/60">
                  {oportunidades!.map((op, idx) => (
                    <div key={op.id} className="px-6 py-4 flex items-center gap-4 hover:bg-areia/40 transition-colors">
                      <span className="text-bronze/40 font-mono text-xs w-6 text-center">{idx + 1}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-darkest">{op.title}</p>
                        <p className="text-xs text-marrom/50 mt-0.5">
                          {op.deadline ? `Prazo: ${op.deadline}` : op.description}
                        </p>
                      </div>
                      {op.impact_label && (
                        <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-pill">
                          {op.impact_label}
                        </span>
                      )}
                      <div className="flex items-center gap-1.5">
                        {statusIcon[op.workflow_status ?? 'nova']}
                        <span className="text-xs text-marrom/60">
                          {statusLabel[op.workflow_status ?? 'nova']}
                        </span>
                      </div>
                      <span className={prioridadeClass[op.priority ?? 'media']}>
                        {(op.priority ?? 'media').charAt(0).toUpperCase() + (op.priority ?? 'media').slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
