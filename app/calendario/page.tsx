'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { CompassIcon } from '@/components/ui/CompassIcon'
import { ChevronLeft, ChevronRight, Instagram, Target, Video, Image, FileText } from 'lucide-react'

const EVENTOS: Record<number, Array<{ tipo: string; titulo: string; cor: string }>> = {
  1:  [{ tipo: 'post', titulo: 'Feed — Combo do Dia', cor: 'bg-purple-100 text-purple-700' }],
  3:  [{ tipo: 'campanha', titulo: 'Meta Ads — Conversão ativa', cor: 'bg-amber-100 text-amber-700' }],
  5:  [{ tipo: 'post', titulo: 'Stories — Promo Fim de Semana', cor: 'bg-purple-100 text-purple-700' }],
  7:  [{ tipo: 'reuniao', titulo: 'Reunião de Planejamento', cor: 'bg-blue-100 text-blue-700' }],
  8:  [{ tipo: 'post', titulo: 'Reels — BTS Produção', cor: 'bg-purple-100 text-purple-700' }, { tipo: 'campanha', titulo: 'Meta Ads — Tráfego novo', cor: 'bg-amber-100 text-amber-700' }],
  10: [{ tipo: 'post', titulo: 'Carrossel — Produtos em Destaque', cor: 'bg-purple-100 text-purple-700' }],
  12: [{ tipo: 'campanha', titulo: 'Meta Ads — Remarketing ativo', cor: 'bg-amber-100 text-amber-700' }],
  14: [{ tipo: 'post', titulo: 'Feed — Depoimento cliente', cor: 'bg-purple-100 text-purple-700' }],
  15: [{ tipo: 'reuniao', titulo: 'Alinhamento Quinzenal', cor: 'bg-blue-100 text-blue-700' }],
  17: [{ tipo: 'post', titulo: 'Stories — Flash Promo', cor: 'bg-purple-100 text-purple-700' }],
  20: [{ tipo: 'post', titulo: 'Reels — Tutorial Açaí', cor: 'bg-purple-100 text-purple-700' }, { tipo: 'campanha', titulo: 'Meta Ads — Budget reforçado', cor: 'bg-amber-100 text-amber-700' }],
  22: [{ tipo: 'post', titulo: 'Feed — Comparativo de produtos', cor: 'bg-purple-100 text-purple-700' }],
  24: [{ tipo: 'post', titulo: 'Stories — Enquete do produto', cor: 'bg-purple-100 text-purple-700' }],
  25: [{ tipo: 'campanha', titulo: 'Meta Ads — Campanha sazonal', cor: 'bg-amber-100 text-amber-700' }],
  28: [{ tipo: 'reuniao', titulo: 'Planejamento Julho — Estratégia', cor: 'bg-blue-100 text-blue-700' }],
  29: [{ tipo: 'post', titulo: 'Feed — Mês novo, novidades', cor: 'bg-purple-100 text-purple-700' }],
}

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const PRIMEIRO_DIA = 0 // junho 2025 começa no domingo
const TOTAL_DIAS = 30

export default function CalendarioPage() {
  const cells: (number | null)[] = [
    ...Array(PRIMEIRO_DIA).fill(null),
    ...Array.from({ length: TOTAL_DIAS }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const hoje = 28 // simulando hoje = dia 28

  return (
    <div className="min-h-screen bg-areia map-texture">
      <Sidebar />
      <main className="ml-[200px]">
        <div className="max-w-[1180px] mx-auto px-8 py-8">

          <TopBar
            title="Calendário"
            subtitle="Campanhas, posts e reuniões"
            userName="Ana"
            userRole="Gestor"
          />

          {/* Legenda */}
          <div className="flex items-center gap-4 mb-4">
            <LegendItem cor="bg-purple-100 text-purple-700" label="Post / Conteúdo" />
            <LegendItem cor="bg-amber-100 text-amber-700" label="Campanha Meta Ads" />
            <LegendItem cor="bg-blue-100 text-blue-700" label="Reunião" />
          </div>

          {/* Cabeçalho do mês */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <button className="w-7 h-7 rounded-full bg-areia hover:bg-bege transition-colors flex items-center justify-center">
                  <ChevronLeft size={14} className="text-marrom/60" />
                </button>
                <h2 className="font-display font-bold text-darkest text-lg">Junho 2025</h2>
                <button className="w-7 h-7 rounded-full bg-areia hover:bg-bege transition-colors flex items-center justify-center">
                  <ChevronRight size={14} className="text-marrom/60" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-marrom/50">
                  {Object.values(EVENTOS).flat().length} eventos este mês
                </span>
              </div>
            </div>

            {/* Grid dias da semana */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {DIAS_SEMANA.map(d => (
                <div key={d} className="text-center text-[10px] font-semibold text-marrom/40 uppercase tracking-wider py-1">{d}</div>
              ))}
            </div>

            {/* Grid calendário */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((dia, idx) => {
                if (!dia) return <div key={idx} className="min-h-[90px]" />
                const eventos = EVENTOS[dia] ?? []
                const isHoje = dia === hoje
                return (
                  <div
                    key={idx}
                    className={`min-h-[90px] rounded-[10px] p-2 ${
                      isHoje ? 'bg-bronze/10 border border-bronze/30' : 'bg-areia/40 hover:bg-areia/80 border border-transparent'
                    } transition-colors cursor-pointer`}
                  >
                    <p className={`text-xs font-bold mb-1 ${
                      isHoje ? 'text-bronze' : 'text-marrom/50'
                    }`}>{dia}</p>
                    <div className="flex flex-col gap-1">
                      {eventos.slice(0, 2).map((e, i) => (
                        <div key={i} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-[4px] leading-tight truncate ${e.cor}`}>
                          {e.titulo}
                        </div>
                      ))}
                      {eventos.length > 2 && (
                        <p className="text-[9px] text-marrom/30">+{eventos.length - 2} mais</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Próximos eventos */}
          <div className="card p-5 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <CompassIcon size={14} variant="bronze" />
              <h2 className="text-[11px] font-semibold text-marrom/60 uppercase tracking-wider">Próximos Eventos</h2>
            </div>
            <div className="flex flex-col gap-2">
              {[28, 29].map(dia => (
                (EVENTOS[dia] ?? []).map((e, i) => (
                  <div key={`${dia}-${i}`} className="flex items-center gap-3 py-2 border-b border-bege/50 last:border-0">
                    <div className="w-8 h-8 bg-areia rounded-[8px] flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-marrom/60">{dia}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-darkest">{e.titulo}</p>
                      <p className="text-[10px] text-marrom/40">Junho 2025</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-pill ${e.cor}`}>
                      {e.tipo === 'post' ? 'Post' : e.tipo === 'campanha' ? 'Campanha' : 'Reunião'}
                    </span>
                  </div>
                ))
              ))}
            </div>
          </div>

        </div>
        <Footer />
      </main>
    </div>
  )
}

function LegendItem({ cor, label }: { cor: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-pill ${cor}`}>{label}</span>
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
