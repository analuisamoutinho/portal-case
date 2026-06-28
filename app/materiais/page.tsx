'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { CompassIcon } from '@/components/ui/CompassIcon'
import { FileImage, Upload, CheckCircle, XCircle, Clock, Eye, Download, MessageSquare, Filter } from 'lucide-react'

const STATS = [
  { label: 'Aguardando Aprovação', value: '8',  color: 'text-amber-600',  bg: 'bg-amber-50',  icon: Clock },
  { label: 'Aprovados',            value: '34', color: 'text-success',    bg: 'bg-green-50',  icon: CheckCircle },
  { label: 'Reprovados',           value: '3',  color: 'text-danger',     bg: 'bg-red-50',    icon: XCircle },
  { label: 'Total de Arquivos',    value: '45', color: 'text-bronze',     bg: 'bg-amber-50',  icon: FileImage },
]

const MATERIAIS = [
  { id: 1, nome: 'Criativo_Combo_Dia_v3.mp4',  tipo: 'Vídeo',  campanha: 'Tráfego | Açaí',     tamanho: '18,4 MB', status: 'aprovado',  data: '05/06', comentario: null },
  { id: 2, nome: 'Story_Promo_Sabado.jpg',     tipo: 'Imagem', campanha: 'Engajamento',        tamanho: '2,1 MB',  status: 'pendente',  data: '07/06', comentario: null },
  { id: 3, nome: 'Carrossel_Produtos_Jun.pdf', tipo: 'PDF',    campanha: 'Conteúdo Orgânico',  tamanho: '4,8 MB',  status: 'pendente',  data: '07/06', comentario: null },
  { id: 4, nome: 'Banner_Oferta_500ml.jpg',    tipo: 'Imagem', campanha: 'Conversão',          tamanho: '1,3 MB',  status: 'reprovado', data: '04/06', comentario: 'Ajustar logo para versão 2024' },
  { id: 5, nome: 'Reels_BTS_Producao.mp4',    tipo: 'Vídeo',  campanha: 'Conteúdo Orgânico',  tamanho: '42,6 MB', status: 'aprovado',  data: '03/06', comentario: null },
  { id: 6, nome: 'Post_Depoimento_Cliente.jpg',tipo: 'Imagem', campanha: 'Prova Social',       tamanho: '0,9 MB',  status: 'aprovado',  data: '02/06', comentario: null },
  { id: 7, nome: 'Feed_Grid_Template.psd',     tipo: 'PSD',    campanha: 'Identidade Visual',  tamanho: '87,2 MB', status: 'pendente',  data: '08/06', comentario: null },
  { id: 8, nome: 'Copy_Anuncio_Remarketing.txt',tipo:'Texto',  campanha: 'Remarketing',       tamanho: '0,1 MB',  status: 'aprovado',  data: '01/06', comentario: null },
]

const STATUS_MAP = {
  aprovado:  { label: 'Aprovado',  color: 'text-success',    bg: 'bg-green-50',  icon: CheckCircle },
  pendente:  { label: 'Pendente',  color: 'text-amber-600',  bg: 'bg-amber-50',  icon: Clock },
  reprovado: { label: 'Reprovado', color: 'text-danger',     bg: 'bg-red-50',    icon: XCircle },
}

const TIPO_COLOR: Record<string, string> = {
  'Vídeo':  'text-purple-600 bg-purple-50',
  'Imagem': 'text-blue-600 bg-blue-50',
  'PDF':    'text-red-600 bg-red-50',
  'PSD':    'text-pink-600 bg-pink-50',
  'Texto':  'text-gray-600 bg-gray-100',
}

export default function MateriaisPage() {
  return (
    <div className="min-h-screen bg-areia map-texture">
      <Sidebar />
      <main className="ml-[200px]">
        <div className="max-w-[1180px] mx-auto px-8 py-8">

          <TopBar
            title="Central de Materiais"
            subtitle="Aprovação e gestão de criativos"
            userName="Ana"
            userRole="Gestor"
          >
            <button className="flex items-center gap-2 text-xs bg-bronze text-surface font-semibold px-3 py-2 rounded-[10px] hover:opacity-90 transition-opacity">
              <Upload size={13} />
              Enviar Material
            </button>
          </TopBar>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {STATS.map(s => (
              <div key={s.label} className="card p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-[10px] ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <s.icon size={18} className={s.color} />
                </div>
                <div>
                  <p className="text-xl font-display font-bold text-darkest">{s.value}</p>
                  <p className="text-[10px] text-marrom/45 uppercase tracking-wider leading-tight">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Zona de upload */}
          <div className="card p-6 mb-6 border-2 border-dashed border-bege hover:border-bronze/40 transition-colors cursor-pointer">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 bg-areia rounded-full flex items-center justify-center">
                <Upload size={20} className="text-bronze" />
              </div>
              <div>
                <p className="text-sm font-semibold text-darkest">Arraste arquivos aqui ou clique para selecionar</p>
                <p className="text-xs text-marrom/40 mt-0.5">Suporta MP4, JPG, PNG, PDF, PSD — máx. 200 MB por arquivo</p>
              </div>
              <button className="text-xs text-bronze font-semibold border border-bronze/30 px-4 py-1.5 rounded-pill hover:bg-bronze/5 transition-colors">
                Selecionar arquivos
              </button>
            </div>
          </div>

          {/* Tabela */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CompassIcon size={14} variant="bronze" />
                <h2 className="text-[11px] font-semibold text-marrom/60 uppercase tracking-wider">Todos os Materiais</h2>
              </div>
              <div className="flex items-center gap-2">
                {(['aprovado','pendente','reprovado'] as const).map(s => (
                  <button key={s} className={`text-[10px] font-semibold px-2.5 py-1 rounded-pill border transition-colors ${STATUS_MAP[s].bg} ${STATUS_MAP[s].color} border-transparent`}>
                    {STATUS_MAP[s].label} ({MATERIAIS.filter(m => m.status === s).length})
                  </button>
                ))}
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-bege">
                  {['Arquivo','Tipo','Campanha','Tamanho','Status','Data','Ações'].map(h => (
                    <th key={h} className="text-left text-[10px] font-semibold text-marrom/40 uppercase tracking-wider pb-2 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATERIAIS.map(m => {
                  const st = STATUS_MAP[m.status as keyof typeof STATUS_MAP]
                  return (
                    <tr key={m.id} className="border-b border-bege/50 hover:bg-areia/40 transition-colors">
                      <td className="py-3 pr-4">
                        <p className="text-xs font-semibold text-darkest">{m.nome}</p>
                        {m.comentario && (
                          <p className="text-[10px] text-danger mt-0.5 flex items-center gap-1">
                            <MessageSquare size={9} /> {m.comentario}
                          </p>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-pill ${TIPO_COLOR[m.tipo] ?? 'text-marrom/50 bg-bege'}`}>{m.tipo}</span>
                      </td>
                      <td className="py-3 pr-4 text-xs text-marrom/60">{m.campanha}</td>
                      <td className="py-3 pr-4 text-xs text-marrom/40">{m.tamanho}</td>
                      <td className="py-3 pr-4">
                        <div className={`flex items-center gap-1 text-[10px] font-semibold ${st.color}`}>
                          <st.icon size={11} /> {st.label}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-xs text-marrom/40">{m.data}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-marrom/30 hover:text-bronze transition-colors"><Eye size={14} /></button>
                          <button className="text-marrom/30 hover:text-bronze transition-colors"><Download size={14} /></button>
                          {m.status === 'pendente' && (
                            <>
                              <button className="text-[10px] text-success font-semibold hover:underline">Aprovar</button>
                              <button className="text-[10px] text-danger font-semibold hover:underline">Reprovar</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
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
