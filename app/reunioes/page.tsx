'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { CompassIcon } from '@/components/ui/CompassIcon'
import { Users, Calendar, Clock, Video, FileText, Plus, CheckSquare } from 'lucide-react'

const REUNIOES = [
  {
    id: 1,
    titulo: 'Alinhamento Mensal — Junho',
    data: '05/06/2025',
    hora: '14:00',
    duracao: '45 min',
    tipo: 'video',
    participantes: ['Ana', 'Lucas', 'Givo'],
    status: 'realizada',
    pauta: ['Resultados de Maio', 'Planejamento de Junho', 'Novos criativos aprovados'],
    ata: 'ROAS mantido acima de 8,5. Aprovado aumento de budget em R$ 2.000. Foco em vídeos curtos para Reels.',
    acoes: [
      { texto: 'Criar 5 novos criativos de vídeo', responsavel: 'Lucas', prazo: '10/06', feito: true },
      { texto: 'Aumentar budget das campanhas de conversão', responsavel: 'Ana', prazo: '07/06', feito: true },
      { texto: 'Enviar relatório de performance semanal', responsavel: 'Ana', prazo: '12/06', feito: false },
    ],
  },
  {
    id: 2,
    titulo: 'Review de Criativos — Q2',
    data: '12/06/2025',
    hora: '10:00',
    duracao: '30 min',
    tipo: 'video',
    participantes: ['Ana', 'Givo', 'Designer'],
    status: 'realizada',
    pauta: ['Revisão dos criativos aprovados', 'Novos formatos para Julho'],
    ata: 'Aprovados 8 de 10 criativos. Reprovado banner por logo desatualizada. Novos formatos: carrossel e stories com countdown.',
    acoes: [
      { texto: 'Atualizar banner com logo 2024', responsavel: 'Designer', prazo: '14/06', feito: true },
      { texto: 'Criar template de stories com countdown', responsavel: 'Designer', prazo: '18/06', feito: false },
    ],
  },
  {
    id: 3,
    titulo: 'Planejamento Julho — Estratégia',
    data: '28/06/2025',
    hora: '15:00',
    duracao: '60 min',
    tipo: 'video',
    participantes: ['Ana', 'Lucas', 'Givo'],
    status: 'agendada',
    pauta: ['Planejamento de campanhas para Julho', 'Sazonalidade e datas comemorativas', 'Meta de faturamento Q3'],
    ata: null,
    acoes: [],
  },
  {
    id: 4,
    titulo: 'Alinhamento Mensal — Julho',
    data: '07/07/2025',
    hora: '14:00',
    duracao: '45 min',
    tipo: 'video',
    participantes: ['Ana', 'Lucas', 'Givo'],
    status: 'agendada',
    pauta: ['Resultados de Junho', 'Planejamento de Julho', 'Revisão de metas'],
    ata: null,
    acoes: [],
  },
]

export default function ReunioesPage() {
  const proxima = REUNIOES.find(r => r.status === 'agendada')

  return (
    <div className="min-h-screen bg-areia map-texture">
      <Sidebar />
      <main className="ml-[200px]">
        <div className="max-w-[1180px] mx-auto px-8 py-8">

          <TopBar
            title="Reuniões"
            subtitle="Histórico e agendamentos"
            userName="Givo"
            userRole="Cliente"
          >
            <button className="flex items-center gap-2 text-xs bg-bronze text-surface font-semibold px-3 py-2 rounded-[10px] hover:opacity-90 transition-opacity">
              <Plus size={13} />
              Agendar Reunião
            </button>
          </TopBar>

          {/* Próxima reunião destaque */}
          {proxima && (
            <div className="card p-6 mb-6 border-bronze/20 bg-gradient-to-r from-amber-50/60 to-surface">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-bronze uppercase tracking-wider bg-bronze/10 px-2 py-0.5 rounded-pill">Próxima reunião</span>
                  </div>
                  <h3 className="font-display font-bold text-darkest text-lg mt-1">{proxima.titulo}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-xs text-marrom/60"><Calendar size={12} /> {proxima.data}</span>
                    <span className="flex items-center gap-1.5 text-xs text-marrom/60"><Clock size={12} /> {proxima.hora} — {proxima.duracao}</span>
                    <span className="flex items-center gap-1.5 text-xs text-marrom/60"><Users size={12} /> {proxima.participantes.join(', ')}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {proxima.pauta.map((p, i) => (
                      <span key={i} className="text-[10px] bg-areia border border-bege text-marrom/60 px-2 py-0.5 rounded-pill">{p}</span>
                    ))}
                  </div>
                </div>
                <button className="flex items-center gap-2 text-xs bg-darkest text-surface font-semibold px-4 py-2.5 rounded-[10px] hover:opacity-80 transition-opacity">
                  <Video size={13} /> Entrar na Reunião
                </button>
              </div>
            </div>
          )}

          {/* Lista de reuniões */}
          <div className="flex flex-col gap-4">
            {REUNIOES.map(r => (
              <div key={r.id} className={`card p-5 ${r.status === 'agendada' ? 'opacity-70' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-pill ${
                        r.status === 'realizada' ? 'bg-green-50 text-success' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {r.status === 'realizada' ? 'Realizada' : 'Agendada'}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-marrom/40">
                        <Video size={10} /> Videochamada
                      </span>
                    </div>
                    <h3 className="font-semibold text-darkest">{r.titulo}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1 text-xs text-marrom/50"><Calendar size={11} /> {r.data}</span>
                      <span className="flex items-center gap-1 text-xs text-marrom/50"><Clock size={11} /> {r.hora} ({r.duracao})</span>
                      <span className="flex items-center gap-1 text-xs text-marrom/50"><Users size={11} /> {r.participantes.join(', ')}</span>
                    </div>
                  </div>
                  <button className="text-[11px] text-bronze hover:text-marrom transition-colors flex items-center gap-1">
                    <FileText size={12} /> {r.ata ? 'Ver ATA' : 'Ver pauta'}
                  </button>
                </div>

                {/* Pauta */}
                <div className="mb-3">
                  <p className="text-[10px] font-semibold text-marrom/40 uppercase tracking-wider mb-1.5">Pauta</p>
                  <div className="flex flex-wrap gap-2">
                    {r.pauta.map((p, i) => (
                      <span key={i} className="text-[10px] bg-areia border border-bege text-marrom/60 px-2 py-0.5 rounded-pill">{i+1}. {p}</span>
                    ))}
                  </div>
                </div>

                {/* ATA */}
                {r.ata && (
                  <div className="bg-areia/60 rounded-[10px] p-3 mb-3">
                    <p className="text-[10px] font-semibold text-marrom/40 uppercase tracking-wider mb-1">Resumo da ATA</p>
                    <p className="text-xs text-marrom/70">{r.ata}</p>
                  </div>
                )}

                {/* Ações */}
                {r.acoes.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold text-marrom/40 uppercase tracking-wider mb-1.5">Ações</p>
                    <div className="flex flex-col gap-1.5">
                      {r.acoes.map((a, i) => (
                        <div key={i} className={`flex items-center gap-2 text-xs ${a.feito ? 'text-marrom/30 line-through' : 'text-marrom/70'}`}>
                          <CheckSquare size={12} className={a.feito ? 'text-success' : 'text-bronze'} />
                          <span className="flex-1">{a.texto}</span>
                          <span className="text-[10px] text-marrom/40">{a.responsavel}</span>
                          <span className="text-[10px] text-marrom/30">{a.prazo}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
        <Footer />
      </main>
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
