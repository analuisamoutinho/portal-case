import { requireAuth } from '@/lib/server/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { FileText, Download, Eye } from 'lucide-react'

export default async function MateriaisPage() {
  const profile = await requireAuth()
  const materiais = [
    { id:1, nome:'Identidade Visual CASE Aceleradora', tipo:'PDF', tamanho:'4.2 MB', status:'aprovado', data:'10 Jun 2026', categoria:'Branding' },
    { id:2, nome:'Criativos Campanha Junho Stories', tipo:'ZIP', tamanho:'18.5 MB', status:'aprovado', data:'05 Jun 2026', categoria:'Midia Paga' },
    { id:3, nome:'Copy Anuncios Meta Ads Q2', tipo:'DOCX', tamanho:'1.1 MB', status:'aprovado', data:'01 Jun 2026', categoria:'Copywriting' },
    { id:4, nome:'Planejamento Instagram Julho', tipo:'PDF', tamanho:'2.8 MB', status:'pendente', data:'20 Jun 2026', categoria:'Social Media' },
    { id:5, nome:'Video Reels Acai Premium 30s', tipo:'MP4', tamanho:'85 MB', status:'aprovado', data:'15 Jun 2026', categoria:'Video' },
    { id:6, nome:'Relatorio Meta Ads Maio 2026', tipo:'PDF', tamanho:'3.4 MB', status:'aprovado', data:'08 Jun 2026', categoria:'Relatorio' },
    { id:7, nome:'Briefing Campanha Julho', tipo:'DOCX', tamanho:'0.9 MB', status:'alteracoes', data:'22 Jun 2026', categoria:'Planejamento' },
    { id:8, nome:'Fotos Produto Alta Resolucao', tipo:'ZIP', tamanho:'142 MB', status:'aprovado', data:'12 Jun 2026', categoria:'Fotografia' },
  ]
  const statusClass: Record<string,string> = { aprovado:'status-aprovado', pendente:'status-pendente', alteracoes:'status-alteracoes' }
  const statusLabel: Record<string,string> = { aprovado:'Aprovado', pendente:'Aguardando', alteracoes:'Com alteracoes' }
  return (
    <div className="flex h-screen bg-areia overflow-hidden">
      <Sidebar role={profile.role} clientName="Givo Acai" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Materiais" subtitle="Arquivos e entregas da sua conta" clientName="Givo Acai" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            <div className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-bege flex items-center gap-2">
                <FileText size={18} className="text-bronze" />
                <h2 className="font-display font-semibold text-darkest">Todos os Materiais</h2>
                <span className="ml-auto text-label text-marrom/40">{materiais.length} arquivos</span>
              </div>
              <div className="divide-y divide-bege/60">
                {materiais.map(m => (
                  <div key={m.id} className="px-6 py-4 flex items-center gap-4 hover:bg-areia/40 transition-colors">
                    <div className="w-9 h-9 rounded-input bg-areia flex items-center justify-center flex-shrink-0">
                      <FileText size={16} className="text-bronze" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-darkest truncate">{m.nome}</p>
                      <p className="text-xs text-marrom/40 mt-0.5">{m.categoria} - {m.data} - {m.tamanho}</p>
                    </div>
                    <span className="text-xs font-mono text-marrom/40 uppercase">{m.tipo}</span>
                    <span className={statusClass[m.status]}>{statusLabel[m.status]}</span>
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-input hover:bg-bege text-marrom/40 hover:text-marrom transition-colors"><Eye size={14} /></button>
                      <button className="p-1.5 rounded-input hover:bg-bege text-marrom/40 hover:text-marrom transition-colors"><Download size={14} /></button>
                    </div>
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
