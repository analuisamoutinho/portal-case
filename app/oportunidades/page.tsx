'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { CompassIcon } from '@/components/ui/CompassIcon'
import { Target, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, Plus, Search, Filter } from 'lucide-react'

const KPIS = [
  { label: 'Total de Oportunidades', value: '47', delta: '+12 este mês', up: true, icon: Target },
  { label: 'Em Negociação',          value: '18', delta: 'R$ 284.000 em aberto', up: true, icon: TrendingUp },
  { label: 'Fechadas no Mês',        value: '9',  delta: '+3 vs mês anterior', up: true, icon: CheckCircle },
  { label: 'Taxa de Conversão',      value: '38%', delta: '+5pp vs meta', up: true, icon: AlertCircle },
]

const OPORTUNIDADES = [
  { id: 1, cliente: 'Givo Açaí',       segmento: 'Alimentação',  valor: 'R$ 48.000', etapa: 'Proposta',      status: 'quente',  responsavel: 'Ana',    prazo: '10/07' },
  { id: 2, cliente: 'FitLife Studio',  segmento: 'Fitness',      valor: 'R$ 32.000', etapa: 'Reunião',       status: 'quente',  responsavel: 'Lucas',  prazo: '12/07' },
  { id: 3, cliente: 'Loja Bella',      segmento: 'Moda',         valor: 'R$ 18.500', etapa: 'Qualificação',  status: 'morno',   responsavel: 'Ana',    prazo: '15/07' },
  { id: 4, cliente: 'Clínica Estética',segmento: 'Saúde/Beleza', valor: 'R$ 26.000', etapa: 'Proposta',      status: 'morno',   responsavel: 'Carla',  prazo: '18/07' },
  { id: 5, cliente: 'Tech Imports',    segmento: 'E-commerce',   valor: 'R$ 54.000', etapa: 'Negociação',    status: 'quente',  responsavel: 'Lucas',  prazo: '08/07' },
  { id: 6, cliente: 'Padaria Artesanal',segmento: 'Alimentação', valor: 'R$ 12.000', etapa: 'Primeiro Contato', status: 'frio', responsavel: 'Ana',   prazo: '25/07' },
  { id: 7, cliente: 'Consultório Zen', segmento: 'Saúde',        valor: 'R$ 9.500',  etapa: 'Qualificação',  status: 'frio',    responsavel: 'Carla',  prazo: '30/07' },
  { id: 8, cliente: 'Casa das Flores', segmento: 'Varejo',       valor: 'R$ 15.000', etapa: 'Proposta',      status: 'morno',   responsavel: 'Lucas',  prazo: '20/07' },
]

const ETAPAS = ['Primeiro Contato', 'Qualificação', 'Reunião', 'Proposta', 'Negociação', 'Fechado']

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  quente: { label: 'Quente', color: 'text-orange-700', bg: 'bg-orange-100' },
  morno:  { label: 'Morno',  color: 'text-yellow-700', bg: 'bg-yellow-100' },
  frio:   { label: 'Frio',   color: 'text-blue-600',   bg: 'bg-blue-100'   },
}

export default function OportunidadesPage() {
  return (
    <div className="min-h-screen bg-areia map-texture">
      <Sidebar />
      <main className="ml-[200px]">
        <div className="max-w-[1180px] mx-auto px-8 py-8">

          <TopBar
            title="Oportunidades"
            subtitle="Pipeline de novos clientes"
            userName="Ana"
            userRole="Gestor"
          >
            <button className="flex items-center gap-2 text-xs bg-bronze text-surface font-semibold px-3 py-2 rounded-[10px] hover:opacity-90 transition-opacity">
              <Plus size={13} />
              Nova Oportunidade
            </button>
          </TopBar>

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {KPIS.map(k => (
              <div key={k.label} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-label text-marrom/45 uppercase tracking-wider">{k.label}</p>
                  <k.icon size={14} className="text-nude mt-0.5" />
                </div>
                <p className="text-xl font-display font-bold text-darkest">{k.value}</p>
                <p className={`text-[11px] font-semibold mt-1 ${k.up ? 'text-success' : 'text-danger'}`}>{k.delta}</p>
              </div>
            ))}
          </div>

          {/* Kanban por etapa */}
          <div className="card p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CompassIcon size={14} variant="bronze" />
                <h2 className="text-[11px] font-semibold text-marrom/60 uppercase tracking-wider">Pipeline por Etapa</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-surface border border-bege rounded-[8px] px-2 py-1.5">
                  <Search size={12} className="text-marrom/40" />
                  <input placeholder="Buscar cliente..." className="text-xs text-marrom bg-transparent outline-none w-32 placeholder:text-marrom/30" />
                </div>
                <button className="flex items-center gap-1 text-xs text-marrom/50 border border-bege rounded-[8px] px-2 py-1.5 hover:border-bronze/40 transition-colors">
                  <Filter size={12} />
                  Filtrar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3">
              {ETAPAS.map(etapa => {
                const items = OPORTUNIDADES.filter(o => o.etapa === etapa)
                return (
                  <div key={etapa} className="bg-areia/60 rounded-card p-3">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-semibold text-marrom/60 uppercase tracking-wider">{etapa}</p>
                      <span className="text-[10px] bg-bege text-marrom/50 font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                        {items.length}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {items.map(op => (
                        <div key={op.id} className="bg-surface rounded-[8px] p-2.5 border border-bege/80 hover:shadow-card transition-shadow cursor-pointer">
                          <p className="text-[11px] font-semibold text-darkest leading-tight mb-1">{op.cliente}</p>
                          <p className="text-[10px] text-marrom/40 mb-2">{op.segmento}</p>
                          <p className="text-xs font-bold text-bronze">{op.valor}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-pill ${STATUS_CONFIG[op.status].bg} ${STATUS_CONFIG[op.status].color}`}>
                              {STATUS_CONFIG[op.status].label}
                            </span>
                            <span className="text-[9px] text-marrom/30">{op.prazo}</span>
                          </div>
                        </div>
                      ))}
                      {items.length === 0 && (
                        <div className="border border-dashed border-bege rounded-[8px] p-3 text-center">
                          <p className="text-[10px] text-marrom/25">Nenhuma</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tabela detalhada */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <CompassIcon size={14} variant="bronze" />
              <h2 className="text-[11px] font-semibold text-marrom/60 uppercase tracking-wider">Todas as Oportunidades</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-bege">
                  {['Cliente','Segmento','Valor','Etapa','Status','Responsável','Prazo',''].map(h => (
                    <th key={h} className="text-left text-[10px] font-semibold text-marrom/40 uppercase tracking-wider pb-2 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {OPORTUNIDADES.map(op => (
                  <tr key={op.id} className="border-b border-bege/50 hover:bg-areia/40 transition-colors">
                    <td className="py-3 pr-4 text-sm font-semibold text-darkest">{op.cliente}</td>
                    <td className="py-3 pr-4 text-xs text-marrom/50">{op.segmento}</td>
                    <td className="py-3 pr-4 text-xs font-bold text-bronze">{op.valor}</td>
                    <td className="py-3 pr-4 text-xs text-marrom/70">{op.etapa}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-pill ${STATUS_CONFIG[op.status].bg} ${STATUS_CONFIG[op.status].color}`}>
                        {STATUS_CONFIG[op.status].label}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-xs text-marrom/60">{op.responsavel}</td>
                    <td className="py-3 pr-4 text-xs text-marrom/50">{op.prazo}</td>
                    <td className="py-3">
                      <button className="text-[11px] text-bronze hover:text-marrom transition-colors">Ver →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
        <Footer />
      </main>
    </div>
  )
}

function Footer() {
  return (
    <footer className="px-8 py-4 border-t border-bege/50">
      <div className="max-w-[1180px] mx-auto flex items-center justify-between">
        <p className="text-marrom/30 text-xs italic">&ldquo;O presente certo no momento certo transforma cliente em fã.&rdquo;</p>
        <div className="flex items-center gap-1.5 text-marrom/30">
          <CompassIcon size={12} variant="bronze" />
          <span className="text-xs tracking-wider">Estratégia. Execução.</span>
        </div>
      </div>
    </footer>
  )
}
