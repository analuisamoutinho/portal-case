import { requireProfile, createServerClient } from '@/lib/server/supabase'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { FileText, Download, Eye, FileSpreadsheet } from 'lucide-react'

export default async function MateriaisPage() {
  const profile = await requireProfile()
  const supabase = createServerClient()

  const { data: materiais = [] } = await supabase
    .from('materials')
    .select('*')
    .eq('client_id', profile.client_id)
    .order('submitted_at', { ascending: false })

  const statusClass: Record<string, string> = {
    aprovado: 'status-aprovado',
    pendente: 'status-pendente',
    alteracoes_solicitadas: 'status-alteracoes',
  }

  const statusLabel: Record<string, string> = {
    aprovado: 'Aprovado',
    pendente: 'Aguardando',
    alteracoes_solicitadas: 'Com alterações',
  }

  return (
    <div className="flex h-screen bg-areia overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="Materiais" subtitle="Arquivos e entregas da sua conta" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            <div className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-bege flex items-center gap-2">
                <FileText size={18} className="text-bronze" />
                <h2 className="font-display font-semibold text-darkest">Todos os Materiais</h2>
                <span className="ml-auto text-label text-marrom/40">{materiais?.length ?? 0} arquivos</span>
              </div>

              {!materiais || materiais.length === 0 ? (
                <div className="px-6 py-16 flex flex-col items-center gap-3 text-center">
                  <FileSpreadsheet size={32} className="text-nude" />
                  <p className="text-sm font-medium text-darkest">Nenhum material cadastrado</p>
                  <p className="text-xs text-marrom/50 max-w-xs">
                    Preencha a aba <strong>Materiais</strong> na planilha do cliente e clique em Sincronizar nas Configurações.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-bege/60">
                  {materiais.map(m => (
                    <div key={m.id} className="px-6 py-4 flex items-center gap-4 hover:bg-areia/40 transition-colors">
                      <div className="w-9 h-9 rounded-input bg-areia flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-bronze" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-darkest truncate">{m.title}</p>
                        <p className="text-xs text-marrom/40 mt-0.5">
                          {[m.category, m.submitted_at ? new Date(m.submitted_at).toLocaleDateString('pt-BR') : null, m.file_size]
                            .filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      {m.type && (
                        <span className="text-xs font-mono text-marrom/40 uppercase">{m.type}</span>
                      )}
                      <span className={statusClass[m.status] ?? 'status-pendente'}>
                        {statusLabel[m.status] ?? m.status}
                      </span>
                      <div className="flex gap-2">
                        {m.preview_url && (
                          <a href={m.preview_url} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-input hover:bg-bege text-marrom/40 hover:text-marrom transition-colors">
                            <Eye size={14} />
                          </a>
                        )}
                        {m.file_url && (
                          <a href={m.file_url} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-input hover:bg-bege text-marrom/40 hover:text-marrom transition-colors">
                            <Download size={14} />
                          </a>
                        )}
                      </div>
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
