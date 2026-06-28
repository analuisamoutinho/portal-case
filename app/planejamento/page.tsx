'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { CompassIcon } from '@/components/ui/CompassIcon'
import { Instagram, Plus, Grid, List, Sparkles, Hash, Image, Video, FileText, MoreHorizontal } from 'lucide-react'

const SEMANAS = [
  {
    semana: 'Semana 1 — 1 a 7 de julho',
    posts: [
      { dia: 'Seg 01', tipo: 'Feed',    formato: 'Carrossel', titulo: 'Top 3 combinações de açaí',   status: 'aprovado',  legenda: 'Qual é o seu combo favorito? 🍓 Escolha o seu e comente aqui!', hashtags: '#açaí #combinações #givo' },
      { dia: 'Qua 03', tipo: 'Reels',   formato: 'Vídeo 30s', titulo: 'BTS: Como fazemos o açaí',  status: 'aprovado',  legenda: 'Do preparo ao pote — veja como garantimos qualidade em cada etapa 🎬', hashtags: '#bastidores #processo #qualidade' },
      { dia: 'Sex 05', tipo: 'Stories', formato: 'Enquete',   titulo: 'Sabor da semana: vote!',    status: 'pendente',  legenda: null, hashtags: null },
      { dia: 'Sáb 06', tipo: 'Feed',    formato: 'Imagem',    titulo: 'Promoção fim de semana',    status: 'aprovado',  legenda: 'Só este fim de semana: 10% OFF no combo família! 🏠', hashtags: '#promoção #fimdesemana #oferta' },
    ],
  },
  {
    semana: 'Semana 2 — 8 a 14 de julho',
    posts: [
      { dia: 'Seg 08', tipo: 'Feed',    formato: 'Carrossel', titulo: 'Benefícios do açaí',        status: 'aprovado',  legenda: 'Rico em antioxidantes, energia e sabor. Descubra os 5 benefícios! 💪', hashtags: '#saúde #benefícios #açaí' },
      { dia: 'Ter 09', tipo: 'Reels',   formato: 'Vídeo 15s', titulo: 'Depoimento cliente',        status: 'rascunho',  legenda: null, hashtags: null },
      { dia: 'Qui 11', tipo: 'Stories', formato: 'Quiz',      titulo: 'Você conhece o açaí?',     status: 'pendente',  legenda: null, hashtags: null },
      { dia: 'Sáb 13', tipo: 'Feed',    formato: 'Imagem',    titulo: 'Novo produto: açaí 1L',    status: 'rascunho',  legenda: null, hashtags: null },
    ],
  },
  {
    semana: 'Semana 3 — 15 a 21 de julho',
    posts: [
      { dia: 'Seg 15', tipo: 'Feed',    formato: 'Carrossel', titulo: 'Receitas com açaí',        status: 'planejado', legenda: null, hashtags: null },
      { dia: 'Qua 17', tipo: 'Reels',   formato: 'Vídeo 30s', titulo: 'Produto em ação',          status: 'planejado', legenda: null, hashtags: null },
      { dia: 'Sex 19', tipo: 'Stories', formato: 'Contagem',  titulo: 'Promo exclusiva em 3 dias',status: 'planejado', legenda: null, hashtags: null },
      { dia: 'Dom 21', tipo: 'Feed',    formato: 'Imagem',    titulo: 'Domingo é dia de açaí',    status: 'planejado', legenda: null, hashtags: null },
    ],
  },
]

const STATUS_MAP = {
  aprovado:  { label: 'Aprovado',  color: 'text-success   bg-green-50',  dot: 'bg-success' },
  pendente:  { label: 'Pendente',  color: 'text-amber-600 bg-amber-50',  dot: 'bg-amber-500' },
  rascunho:  { label: 'Rascunho', color: 'text-marrom/50 bg-bege',      dot: 'bg-marrom/30' },
  planejado: { label: 'Planejado', color: 'text-blue-600  bg-blue-50',   dot: 'bg-blue-400' },
}

const TIPO_ICON: Record<string, React.ElementType> = {
  Feed:    Image,
  Reels:   Video,
  Stories: FileText,
}

export default function PlanejamentoPage() {
  const totalPosts = SEMANAS.flatMap(s => s.posts).length
  const aprovados = SEMANAS.flatMap(s => s.posts).filter(p => p.status === 'aprovado').length

  return (
    <div className="min-h-screen bg-areia map-texture">
      <Sidebar />
      <main className="ml-[200px]">
        <div className="max-w-[1180px] mx-auto px-8 py-8">

          <TopBar
            title="Planejamento Instagram"
            subtitle="Calendário editorial de julho"
            userName="Ana"
            userRole="Gestor"
          >
            <button className="flex items-center gap-2 text-xs bg-bronze text-surface font-semibold px-3 py-2 rounded-[10px] hover:opacity-90 transition-opacity">
              <Sparkles size={13} />
              Gerar com IA
            </button>
          </TopBar>

          {/* Resumo */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <StatCard label="Total de Posts" value={String(totalPosts)} sub="Julho 2025" />
            <StatCard label="Aprovados" value={String(aprovados)} sub={`${Math.round(aprovados/totalPosts*100)}% do mês`} />
            <StatCard label="Feed" value={String(SEMANAS.flatMap(s=>s.posts).filter(p=>p.tipo==='Feed').length)} sub="posts no grid" />
            <StatCard label="Reels" value={String(SEMANAS.flatMap(s=>s.posts).filter(p=>p.tipo==='Reels').length)} sub="vídeos" />
          </div>

          {/* Semanas */}
          <div className="flex flex-col gap-6">
            {SEMANAS.map((semana, si) => (
              <div key={si} className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CompassIcon size={14} variant="bronze" />
                    <h2 className="text-[11px] font-semibold text-marrom/60 uppercase tracking-wider">{semana.semana}</h2>
                  </div>
                  <button className="flex items-center gap-1 text-[11px] text-bronze hover:text-marrom transition-colors">
                    <Plus size={12} /> Adicionar post
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {semana.posts.map((post, pi) => {
                    const st = STATUS_MAP[post.status as keyof typeof STATUS_MAP]
                    const TipoIcon = TIPO_ICON[post.tipo] ?? Image
                    return (
                      <div key={pi} className="border border-bege rounded-card p-3 hover:shadow-card transition-shadow cursor-pointer group">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-semibold text-marrom/40 uppercase tracking-wider">{post.dia}</span>
                          <button className="text-marrom/20 hover:text-marrom/60 transition-colors opacity-0 group-hover:opacity-100">
                            <MoreHorizontal size={13} />
                          </button>
                        </div>

                        {/* Tipo */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-[6px] flex items-center justify-center">
                            <TipoIcon size={12} className="text-white" />
                          </div>
                          <span className="text-[10px] font-semibold text-marrom/60">{post.tipo}</span>
                          <span className="text-[9px] text-marrom/30">· {post.formato}</span>
                        </div>

                        {/* Título */}
                        <p className="text-xs font-semibold text-darkest leading-snug mb-2">{post.titulo}</p>

                        {/* Legenda */}
                        {post.legenda && (
                          <p className="text-[10px] text-marrom/50 leading-relaxed mb-2 line-clamp-2">{post.legenda}</p>
                        )}

                        {/* Hashtags */}
                        {post.hashtags && (
                          <p className="text-[9px] text-bronze/70 mb-2">{post.hashtags}</p>
                        )}

                        {/* Status */}
                        <div className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-pill w-fit ${st.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {st.label}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>
        <Footer />
      </main>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="card p-4">
      <p className="text-label text-marrom/45 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xl font-display font-bold text-darkest">{value}</p>
      <p className="text-[11px] text-marrom/40 mt-0.5">{sub}</p>
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
