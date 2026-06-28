'use client'

import { TopBar } from '@/components/layout/TopBar'
import { TrendingUp, TrendingDown, Eye, Users, ShoppingCart, Target, MousePointer, Play, Clock } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { CompassIcon } from '@/components/ui/CompassIcon'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { formatCurrency, formatNumber } from '@/lib/types'

// ── Mock data fiel ao PDF ────────────────────────────
const DAILY_SALES = [
  { date: '01/06', vendas: 12400, compras: 18 },
  { date: '02/06', vendas: 16800, compras: 23 },
  { date: '03/06', vendas: 14200, compras: 21 },
  { date: '04/06', vendas: 19600, compras: 28 },
  { date: '05/06', vendas: 17100, compras: 24 },
  { date: '06/06', vendas: 22300, compras: 31 },
  { date: '07/06', vendas: 26000, compras: 36 },
]

const INVESTMENT_DATA = [
  { date: '01/06', investido: 1600, cpc: 1.05, cpv: 13.11 },
  { date: '02/06', investido: 1900, cpc: 1.12, cpv: 12.07 },
  { date: '03/06', investido: 1800, cpc: 1.01, cpv: 11.36 },
  { date: '04/06', investido: 2300, cpc: 1.09, cpv: 11.45 },
  { date: '05/06', investido: 2300, cpc: 1.06, cpv: 11.72 },
  { date: '06/06', investido: 2300, cpc: 1.11, cpv: 11.20 },
  { date: '07/06', investido: 2300, cpc: 1.13, cpv: 10.89 },
]

const GENDER_DATA = [
  { name: 'Feminino', value: 62, color: '#B8864B' },
  { name: 'Masculino', value: 34, color: '#4A2E1F' },
  { name: 'Não identificado', value: 4, color: '#E9D2B6' },
]

const AGE_DATA = [
  { faixa: '18-24', value: 17200, pct: 13.4 },
  { faixa: '25-34', value: 50800, pct: 39.6 },
  { faixa: '35-44', value: 35700, pct: 27.8 },
  { faixa: '45-54', value: 17300, pct: 13.5 },
  { faixa: '55+',   value: 7500,  pct: 5.7 },
]

const TOP_ADS = [
  { rank: 1, title: 'Combo do Dia', campaign: 'Tráfego | Conj.: Interesse Açaí', roas: 11.24, ctr: 3.45, purchases: 68, cpv: 8.17, color: '#B8864B' },
  { rank: 2, title: 'Açaí 500ml',   campaign: 'Conversão | Conj.: Remarketing',  roas: 9.32,  ctr: 2.81, purchases: 54, cpv: 9.61, color: '#8B6235' },
  { rank: 3, title: 'Promoção da Semana', campaign: 'Vendas | Conj.: Público Amplo', roas: 7.85, ctr: 2.34, purchases: 42, cpv: 10.93, color: '#6B4A25' },
]

const WEEKLY_SALES = [
  { day: 'Seg', value: 15900 },
  { day: 'Ter', value: 16700 },
  { day: 'Qua', value: 17600 },
  { day: 'Qui', value: 18300 },
  { day: 'Sex', value: 22100 },
  { day: 'Sáb', value: 21400 },
  { day: 'Dom', value: 16400 },
]

// ── KPIs ─────────────────────────────────────────────
const KPIS_TOP = [
  { label: 'Valor das Vendas',  value: 'R$ 128.450,72', delta: '+32,4%', up: true,  icon: ShoppingCart },
  { label: 'Valor Investido',   value: 'R$ 14.286,90',  delta: '+8,7%',  up: true,  icon: Target },
  { label: 'Impressões',        value: '1.840.220',      delta: '+21,8%', up: true,  icon: Eye },
  { label: 'Alcance',           value: '612.430',        delta: '+18,3%', up: true,  icon: Users },
]

const KPIS_MID = [
  { label: 'ROAS',           value: '8,99',       delta: '+17,1%', up: true  },
  { label: 'Custo por Venda',value: 'R$ 11,42',   delta: '-9,6%',  up: false },
  { label: 'CPM',            value: 'R$ 7,31',    delta: '+4,2%',  up: true  },
  { label: 'CPC',            value: 'R$ 1,08',    delta: '-6,8%',  up: false },
  { label: 'CTR',            value: '2,94%',      delta: '+11,5%', up: true  },
]

const KPIS_VIDEO = [
  { label: 'Video Plays',          value: '324.580', delta: '+26,7%', up: true  },
  { label: '3-Second Video Views', value: '145.320', delta: '+19,4%', up: true  },
  { label: 'ThruPlays',            value: '42.910',  delta: '+14,8%', up: true  },
  { label: 'Custo por ThruPlay',   value: 'R$ 0,33', delta: '-7,2%',  up: false },
]

const RESUMO = [
  { label: 'Compras',           value: '181',     delta: '+25,2%', up: true, icon: ShoppingCart },
  { label: 'Novos Clientes',    value: '93',      delta: '+19,4%', up: true, icon: Users },
  { label: 'Taxa de Conversão', value: '3,12%',   delta: '+0,41pp',up: true, icon: Target },
  { label: 'Ticket Médio',      value: 'R$ 709,95',delta: null,    up: true, icon: null },
  { label: '% de Recompra',     value: '26,7%',   delta: '+3,6pp', up: true, icon: null },
  { label: 'Qualidade da Camp.',value: 'Excelente',delta: 'Melhorando', up: true, icon: null },
]

const TOOLTIP_STYLE = {
  contentStyle: { background: '#FDFAF6', border: '1px solid #E9D2B6', borderRadius: '10px', fontSize: '12px', color: '#4A2E1F' },
  cursor: { fill: 'rgba(184,134,75,0.06)' },
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-areia map-texture">
      <Sidebar />
      <main className="ml-[200px]">
        <div className="max-w-[1180px] mx-auto px-8 py-8">

          {/* Header */}
          <TopBar
            title="Dashboard"
            subtitle="Visão geral da sua conta"
            userName="Givo"
            userRole="Cliente"
            refreshedAt="há 5 min"
          >
            {/* Seletor de período */}
            <button className="flex items-center gap-2 text-xs bg-surface border border-bege rounded-[10px] px-3 py-2 text-marrom/70 hover:border-bronze/40 transition-colors">
              <Clock size={13} />
              1 de jun. de 2026 – 8 de jun. de 2026
              <ChevronDown size={13} />
            </button>
          </TopBar>

          {/* KPIs topo */}
          <div className="grid grid-cols-4 gap-3 mb-3">
            {KPIS_TOP.map(k => (
              <KpiCard key={k.label} {...k} large />
            ))}
          </div>

          {/* KPIs meio */}
          <div className="grid grid-cols-5 gap-3 mb-3">
            {KPIS_MID.map(k => (
              <KpiCard key={k.label} {...k} />
            ))}
          </div>

          {/* KPIs vídeo */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {KPIS_VIDEO.map(k => (
              <KpiCard key={k.label} {...k} />
            ))}
          </div>

          {/* Gráficos principais */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Evolução de vendas */}
            <div className="card p-5">
              <SectionTitle icon>Evolução das Vendas por Dia</SectionTitle>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={DAILY_SALES} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E9D2B6" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9B7B5E' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#9B7B5E' }} axisLine={false} tickLine={false}
                    tickFormatter={v => `R$${(v/1000).toFixed(0)}mil`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#9B7B5E' }} axisLine={false} tickLine={false} />
                  <Tooltip {...TOOLTIP_STYLE} formatter={(v: number, name: string) =>
                    name === 'vendas' ? [formatCurrency(v), 'Valor das Vendas'] : [v, 'Compras']
                  } />
                  <Bar yAxisId="left" dataKey="vendas" fill="#B8864B" radius={[4,4,0,0]} />
                  <Line yAxisId="right" type="monotone" dataKey="compras" stroke="#4A2E1F" strokeWidth={2} dot={{ r: 3, fill: '#4A2E1F' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Evolução de investimento */}
            <div className="card p-5">
              <SectionTitle icon>Evolução do Investimento, CPC e Custo por Venda</SectionTitle>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={INVESTMENT_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E9D2B6" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9B7B5E' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9B7B5E' }} axisLine={false} tickLine={false} />
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Line type="monotone" dataKey="investido" stroke="#B8864B" strokeWidth={2} dot={{ r: 3 }} name="Valor Investido (R$)" />
                  <Line type="monotone" dataKey="cpc"       stroke="#4A2E1F" strokeWidth={1.5} strokeDasharray="4 2" dot={{ r: 2 }} name="CPC (R$)" />
                  <Line type="monotone" dataKey="cpv"       stroke="#9B7B5E" strokeWidth={1.5} strokeDasharray="4 2" dot={{ r: 2 }} name="Custo por Venda (R$)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Resumo do período */}
          <div className="card p-5 mb-4">
            <SectionTitle icon>Resumo do Período</SectionTitle>
            <div className="grid grid-cols-6 gap-3 mt-3">
              {RESUMO.map(r => (
                <div key={r.label} className="text-center">
                  <p className="text-display-sm font-display text-darkest tabular-nums">{r.value}</p>
                  <p className="text-[10px] text-marrom/50 mt-0.5">{r.label}</p>
                  {r.delta && (
                    <p className={`text-[10px] font-semibold mt-0.5 ${r.up ? 'text-success' : 'text-danger'}`}>
                      {r.up ? '↑' : '↓'} {r.delta}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Gráficos secundários */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Vendas por dia da semana */}
            <div className="card p-5">
              <SectionTitle icon>Vendas por Dia da Semana</SectionTitle>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={WEEKLY_SALES}>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9B7B5E' }} axisLine={false} tickLine={false} />
                  <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [formatCurrency(v), 'Vendas']} />
                  <Bar dataKey="value" fill="#B8864B" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* % Gênero */}
            <div className="card p-5">
              <SectionTitle icon>% de Vendas por Gênero</SectionTitle>
              <div className="flex items-center justify-center gap-4 mt-2">
                <ResponsiveContainer width="50%" height={140}>
                  <PieChart>
                    <Pie data={GENDER_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={60}
                      dataKey="value" stroke="none">
                      {GENDER_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2">
                  {GENDER_DATA.map(g => (
                    <div key={g.name} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: g.color }} />
                      <span className="text-xs text-marrom/70">{g.name}</span>
                      <span className="text-xs font-semibold text-marrom ml-auto">{g.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Faixa etária */}
            <div className="card p-5">
              <SectionTitle icon>Vendas por Faixa de Idade</SectionTitle>
              <div className="flex flex-col gap-2 mt-3">
                {AGE_DATA.map(a => (
                  <div key={a.faixa} className="flex items-center gap-2">
                    <span className="text-[10px] text-marrom/50 w-10 flex-shrink-0">{a.faixa}</span>
                    <div className="flex-1 bg-bege/60 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-bronze transition-all"
                        style={{ width: `${(a.value / 55000) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-marrom/70 w-8 text-right">{a.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Melhores anúncios */}
          <div className="card p-5 mb-6">
            <SectionTitle icon>Melhores Anúncios</SectionTitle>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {TOP_ADS.map(ad => (
                <div key={ad.rank} className="border border-bege rounded-card p-4 hover:shadow-card transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-pill text-surface"
                      style={{ background: ad.color }}
                    >TOP {ad.rank}</span>
                    <span className="text-xs text-marrom/50 truncate">{ad.campaign}</span>
                  </div>
                  <p className="font-semibold text-sm text-darkest mb-3">{ad.title}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Metric label="ROAS" value={ad.roas.toFixed(2)} color="text-success" />
                    <Metric label="CTR"  value={`${ad.ctr}%`} />
                    <Metric label="Compras" value={String(ad.purchases)} />
                    <Metric label="Custo/Venda" value={`R$ ${ad.cpv.toFixed(2)}`} />
                  </div>
                  <button className="mt-3 text-[11px] text-bronze hover:text-marrom transition-colors flex items-center gap-1">
                    Ver detalhes do anúncio →
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="px-8 py-4 border-t border-bege/50">
          <div className="max-w-[1180px] mx-auto flex items-center justify-between">
            <p className="text-marrom/30 text-xs italic">
              &ldquo;O presente certo no momento certo transforma cliente em fã.&rdquo;
            </p>
            <div className="flex items-center gap-1.5 text-marrom/30">
              <CompassIcon size={12} variant="bronze" />
              <span className="text-xs tracking-wider">Estratégia. Execução.</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

// ── Sub-componentes ──────────────────────────────────

function KpiCard({ label, value, delta, up, icon: Icon, large }: {
  label: string; value: string; delta?: string | null
  up?: boolean; icon?: any; large?: boolean
}) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-2">
        <p className="text-label text-marrom/45 uppercase tracking-wider leading-tight">{label}</p>
        {Icon && <Icon size={14} className="text-nude mt-0.5" />}
      </div>
      <p className={`font-display font-bold text-darkest tabular-nums ${large ? 'text-xl' : 'text-lg'}`}>
        {value}
      </p>
      {delta && (
        <p className={`text-[11px] font-semibold mt-1 ${up ? 'text-success' : 'text-danger'}`}>
          {up ? '↑' : '↓'} {delta}
        </p>
      )}
    </div>
  )
}

function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      {icon && <CompassIcon size={14} variant="bronze" />}
      <h2 className="text-[11px] font-semibold text-marrom/60 uppercase tracking-wider">{children}</h2>
    </div>
  )
}

function Metric({ label, value, color = 'text-darkest' }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p className="text-[9px] text-marrom/40 uppercase tracking-wider">{label}</p>
      <p className={`text-sm font-semibold ${color}`}>{value}</p>
    </div>
  )
}

function ChevronDown({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
