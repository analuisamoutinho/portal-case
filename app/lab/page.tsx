'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { CompassIcon } from '@/components/ui/CompassIcon'
import { BookOpen, Play, Lock, CheckCircle, Clock, Star, Zap, TrendingUp, Users } from 'lucide-react'

const TRILHAS = [
  {
    id: 1,
    titulo: 'Fundamentos do Tráfego Pago',
    descricao: 'Do zero ao Meta Ads: estrutura de campanhas, públicos e criativos.',
    nivel: 'Iniciante',
    aulas: 12,
    duracao: '3h 20min',
    progresso: 100,
    cor: 'from-green-400 to-emerald-600',
    modulos: [
      { titulo: 'Por que o tráfego pago?', duracao: '15min', feito: true },
      { titulo: 'Estrutura do Meta Ads',   duracao: '22min', feito: true },
      { titulo: 'Públicos e segmentações', duracao: '28min', feito: true },
      { titulo: 'Criativos que convertem', duracao: '35min', feito: true },
    ],
  },
  {
    id: 2,
    titulo: 'ROAS: Como escalar campanhas',
    descricao: 'Aprenda a escalar criativos vencedores sem perder eficiência.',
    nivel: 'Intermediário',
    aulas: 8,
    duracao: '2h 10min',
    progresso: 62,
    cor: 'from-amber-400 to-orange-500',
    modulos: [
      { titulo: 'O que é ROAS e como ler',       duracao: '18min', feito: true },
      { titulo: 'Identificando vencedores',       duracao: '25min', feito: true },
      { titulo: 'Escala horizontal vs vertical',  duracao: '30min', feito: false },
      { titulo: 'Automatizando regras de escala', duracao: '22min', feito: false },
    ],
  },
  {
    id: 3,
    titulo: 'Instagram Orgânico + Pago',
    descricao: 'Estratégia integrada de conteúdo orgânico e tráfego pago no Instagram.',
    nivel: 'Intermediário',
    aulas: 10,
    duracao: '2h 45min',
    progresso: 20,
    cor: 'from-pink-400 to-purple-600',
    modulos: [
      { titulo: 'O algoritmo do Instagram',         duracao: '20min', feito: true },
      { titulo: 'Tipos de conteúdo e quando usar', duracao: '25min', feito: false },
      { titulo: 'Integrando orgânico com Ads',     duracao: '35min', feito: false },
      { titulo: 'Métricas que importam',           duracao: '18min', feito: false },
    ],
  },
  {
    id: 4,
    titulo: 'CRM & Retenção de Clientes',
    descricao: 'Como transformar compradores em clientes recorrentes com automação.',
    nivel: 'Avançado',
    aulas: 9,
    duracao: '2h 30min',
    progresso: 0,
    cor: 'from-blue-400 to-indigo-600',
    modulos: [
      { titulo: 'Mapeando a jornada do cliente', duracao: '22min', feito: false },
      { titulo: 'WhatsApp: fluxos de automação', duracao: '30min', feito: false },
      { titulo: 'Email marketing que vende',     duracao: '28min', feito: false },
      { titulo: 'Programa de fidelidade',        duracao: '25min', feito: false },
    ],
    bloqueado: true,
  },
]

const NIVEL_COLOR: Record<string, string> = {
  'Iniciante':    'bg-green-50 text-green-700',
  'Intermediário':'bg-amber-50 text-amber-700',
  'Avançado':     'bg-purple-50 text-purple-700',
}

export default function LabPage() {
  const totalAulas = TRILHAS.reduce((a, t) => a + t.aulas, 0)
  const concluidas = TRILHAS.filter(t => t.progresso === 100).length

  return (
    <div className="min-h-screen bg-areia map-texture">
      <Sidebar />
      <main className="ml-[200px]">
        <div className="max-w-[1180px] mx-auto px-8 py-8">

          <TopBar
            title="CASE Lab"
            subtitle="Aprenda e evolua com a CASE"
            userName="Givo"
            userRole="Cliente"
          />

          {/* Hero */}
          <div className="card p-6 mb-6 bg-gradient-to-r from-darkest to-marrom/80 text-areia border-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={16} className="text-bronze" />
                  <span className="text-[11px] font-bold text-bronze uppercase tracking-wider">CASE Lab — Beta</span>
                </div>
                <h2 className="font-display font-bold text-2xl text-areia mb-1">Aprenda o que move seu negócio</h2>
                <p className="text-areia/60 text-sm">Trilhas exclusivas sobre tráfego pago, conteúdo e CRM para o seu mercado.</p>
                <div className="flex items-center gap-6 mt-4">
                  <Stat icon={BookOpen} value={String(totalAulas)} label="aulas" />
                  <Stat icon={CheckCircle} value={String(concluidas)} label="trilhas concluídas" />
                  <Stat icon={Clock} value="10h 45min" label="conteúdo total" />
                </div>
              </div>
              <CompassIcon size={80} variant="bronze" />
            </div>
          </div>

          {/* Trilhas */}
          <div className="grid grid-cols-2 gap-4">
            {TRILHAS.map(trilha => (
              <div key={trilha.id} className={`card p-5 relative overflow-hidden ${trilha.bloqueado ? 'opacity-60' : ''}`}>
                {trilha.bloqueado && (
                  <div className="absolute inset-0 bg-areia/60 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-card">
                    <div className="flex flex-col items-center gap-2">
                      <Lock size={20} className="text-marrom/40" />
                      <p className="text-xs font-semibold text-marrom/40">Disponível em breve</p>
                    </div>
                  </div>
                )}

                {/* Banner colorido */}
                <div className={`h-1.5 rounded-full bg-gradient-to-r ${trilha.cor} mb-4`} />

                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-pill ${NIVEL_COLOR[trilha.nivel]}`}>
                        {trilha.nivel}
                      </span>
                      <span className="text-[10px] text-marrom/40">{trilha.aulas} aulas · {trilha.duracao}</span>
                    </div>
                    <h3 className="font-display font-bold text-darkest">{trilha.titulo}</h3>
                    <p className="text-xs text-marrom/50 mt-0.5">{trilha.descricao}</p>
                  </div>
                </div>

                {/* Progresso */}
                <div className="mt-3 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-marrom/40">Progresso</span>
                    <span className="text-[10px] font-semibold text-marrom/60">{trilha.progresso}%</span>
                  </div>
                  <div className="w-full bg-bege rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full bg-gradient-to-r ${trilha.cor} transition-all`}
                      style={{ width: `${trilha.progresso}%` }}
                    />
                  </div>
                </div>

                {/* Módulos */}
                <div className="flex flex-col gap-1.5 mb-4">
                  {trilha.modulos.map((mod, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {mod.feito
                        ? <CheckCircle size={13} className="text-success flex-shrink-0" />
                        : <div className="w-3 h-3 rounded-full border border-bege flex-shrink-0" />}
                      <span className={`text-xs flex-1 ${mod.feito ? 'text-marrom/40 line-through' : 'text-marrom/70'}`}>{mod.titulo}</span>
                      <span className="text-[10px] text-marrom/30">{mod.duracao}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button className={`w-full flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-[10px] transition-opacity ${
                  trilha.progresso === 100
                    ? 'bg-green-50 text-success border border-green-200'
                    : trilha.progresso > 0
                    ? 'bg-bronze text-surface hover:opacity-90'
                    : 'bg-darkest text-surface hover:opacity-80'
                }`}>
                  {trilha.progresso === 100 ? (
                    <><CheckCircle size={13} /> Concluída</>
                  ) : trilha.progresso > 0 ? (
                    <><Play size={13} /> Continuar</>
                  ) : (
                    <><Play size={13} /> Começar Trilha</>
                  )}
                </button>
              </div>
            ))}
          </div>

        </div>
        <Footer />
      </main>
    </div>
  )
}

function Stat({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={13} className="text-bronze" />
      <span className="text-sm font-bold text-areia">{value}</span>
      <span className="text-xs text-areia/50">{label}</span>
    </div>
  )
}

function Footer() {
  return (
    <footer className="px-8 py-4 border-t border-bege/50 mt-4">
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
