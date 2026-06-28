'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { CompassIcon } from '@/components/ui/CompassIcon'
import { CheckCircle, Circle, Clock, Star, TrendingUp, Zap } from 'lucide-react'

const MILESTONES = [
  {
    mes: 'Janeiro 2025',
    status: 'concluido',
    titulo: 'Diagnóstico & Onboarding',
    descricao: 'Levantamento completo da marca, posicionamento, públicos e histórico de campanhas.',
    entregaveis: ['Briefing completo', 'Análise de concorrentes', 'Mapa de oportunidades', 'Acesso a todas as plataformas'],
    resultado: null,
  },
  {
    mes: 'Fevereiro 2025',
    status: 'concluido',
    titulo: 'Estruturação do Tráfego',
    descricao: 'Criação da estrutura de campanhas no Meta Ads com segmentações, criativos e testes A/B.',
    entregaveis: ['Estrutura de campanhas', 'Primeiros criativos', 'Pixel configurado', 'Primeiros testes A/B'],
    resultado: 'ROAS 4,2 → 6,8',
  },
  {
    mes: 'Março 2025',
    status: 'concluido',
    titulo: 'Otimização & Escala',
    descricao: 'Escalada dos criativos vencedores, expansão de públicos e otimização de CPV.',
    entregaveis: ['10 criativos vencedores', 'Públicos lookalike', 'Redução CPV em 23%', 'Aumento budget em 40%'],
    resultado: 'ROAS 6,8 → 8,2',
  },
  {
    mes: 'Abril 2025',
    status: 'concluido',
    titulo: 'Identidade Visual & Conteúdo',
    descricao: 'Revisão da identidade de marca e criação de calendário de conteúdo orgânico.',
    entregaveis: ['Manual de marca atualizado', 'Calendário editorial', 'Templates Canva', '30 posts produzidos'],
    resultado: '+847 seguidores orgânicos',
  },
  {
    mes: 'Maio 2025',
    status: 'concluido',
    titulo: 'CRM & Retenção',
    descricao: 'Implementação de fluxos de retenção, WhatsApp automatizado e programa de fidelidade.',
    entregaveis: ['Fluxo WhatsApp', 'Programa de pontos', 'Email marketing', 'Taxa de recompra +12%'],
    resultado: 'Recompra 14% → 26%',
  },
  {
    mes: 'Junho 2025',
    status: 'em_andamento',
    titulo: 'Performance & Resultados',
    descricao: 'Consolidação dos resultados, relatórios mensais e planejamento do próximo trimestre.',
    entregaveis: ['Relatório mensal', 'Planejamento Q3', 'Análise de sazonalidade', 'Projeção de crescimento'],
    resultado: null,
  },
  {
    mes: 'Julho 2025',
    status: 'futuro',
    titulo: 'Expansão Multicanal',
    descricao: 'Expansão para Google Ads, TikTok e integração de dados de e-commerce.',
    entregaveis: ['Google Ads ativo', 'TikTok Ads', 'Dashboard unificado', 'API e-commerce'],
    resultado: null,
  },
  {
    mes: 'Agosto 2025',
    status: 'futuro',
    titulo: 'Placa do Milhão',
    descricao: 'Meta de R$ 1.000.000 em vendas acumuladas atribuídas ao tráfego pago.',
    entregaveis: ['R$ 1M em vendas', 'Case de sucesso documentado', 'Estratégia de PR', 'Expansão de equipe'],
    resultado: null,
  },
]

const STATUS_MAP = {
  concluido:    { icon: CheckCircle, color: 'text-success', bg: 'bg-green-50',  line: 'bg-success',  label: 'Concluído' },
  em_andamento: { icon: Zap,         color: 'text-bronze',  bg: 'bg-amber-50',  line: 'bg-bronze',   label: 'Em andamento' },
  futuro:       { icon: Circle,      color: 'text-marrom/30',bg: 'bg-areia/60', line: 'bg-bege',     label: 'Planejado' },
}

export default function TimelinePage() {
  const concluidos = MILESTONES.filter(m => m.status === 'concluido').length
  const total = MILESTONES.length
  const pct = Math.round((concluidos / total) * 100)

  return (
    <div className="min-h-screen bg-areia map-texture">
      <Sidebar />
      <main className="ml-[200px]">
        <div className="max-w-[1180px] mx-auto px-8 py-8">

          <TopBar
            title="Jornada da Marca"
            subtitle="Linha do tempo da sua evolução"
            userName="Givo"
            userRole="Cliente"
          />

          {/* Progresso geral */}
          <div className="card p-5 mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CompassIcon size={14} variant="bronze" />
                <span className="text-[11px] font-semibold text-marrom/60 uppercase tracking-wider">Progresso Geral</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-marrom/50">{concluidos} de {total} etapas concluídas</span>
                <span className="text-lg font-display font-bold text-bronze">{pct}%</span>
              </div>
            </div>
            <div className="w-full bg-bege rounded-full h-2.5">
              <div className="h-2.5 rounded-full bg-bronze transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center gap-6 mt-3">
              {Object.entries(STATUS_MAP).map(([key, val]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <val.icon size={12} className={val.color} />
                  <span className="text-[11px] text-marrom/50">{val.label}: {MILESTONES.filter(m => m.status === key).length}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Linha vertical */}
            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-bege" />

            <div className="flex flex-col gap-6">
              {MILESTONES.map((m, i) => {
                const cfg = STATUS_MAP[m.status as keyof typeof STATUS_MAP]
                const IconComp = cfg.icon
                return (
                  <div key={i} className="flex gap-6">
                    {/* Ícone */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`w-[56px] h-[56px] rounded-full ${cfg.bg} border-2 ${m.status === 'em_andamento' ? 'border-bronze' : m.status === 'concluido' ? 'border-success/30' : 'border-bege'} flex items-center justify-center`}>
                        <IconComp size={22} className={cfg.color} />
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className={`flex-1 card p-5 ${m.status === 'em_andamento' ? 'border-bronze/30 shadow-card' : ''}`}>
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <p className="text-[10px] text-marrom/40 uppercase tracking-wider mb-0.5">{m.mes}</p>
                          <h3 className="font-display font-bold text-darkest text-base">{m.titulo}</h3>
                        </div>
                        {m.resultado && (
                          <div className="flex items-center gap-1.5 bg-green-50 text-success text-[11px] font-bold px-2.5 py-1 rounded-pill">
                            <TrendingUp size={11} />
                            {m.resultado}
                          </div>
                        )}
                        {m.status === 'em_andamento' && (
                          <span className="flex items-center gap-1 bg-amber-50 text-bronze text-[10px] font-semibold px-2 py-0.5 rounded-pill">
                            <Clock size={10} /> Em andamento
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-marrom/60 mt-1 mb-3">{m.descricao}</p>
                      <div className="flex flex-wrap gap-2">
                        {m.entregaveis.map((e, j) => (
                          <span key={j} className={`text-[10px] px-2 py-0.5 rounded-pill border ${
                            m.status === 'concluido'
                              ? 'bg-green-50 border-green-200 text-green-700'
                              : m.status === 'em_andamento'
                              ? 'bg-amber-50 border-amber-200 text-amber-700'
                              : 'bg-areia border-bege text-marrom/40'
                          }`}>
                            {m.status === 'concluido' ? '✓ ' : ''}{e}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
        <Footer />
      </main>
    </div>
  )
}

function Footer() {
  return (
    <footer className="px-8 py-4 border-t border-bege/50 mt-8">
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
