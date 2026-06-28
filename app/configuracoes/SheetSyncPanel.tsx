'use client'

import { useState } from 'react'
import { RefreshCw, ExternalLink, FileSpreadsheet, Plus, CheckCircle, AlertCircle } from 'lucide-react'

interface ClientRow {
  id: string
  name: string
  google_sheet_id: string | null
  google_sheet_last_sync: string | null
}

interface Toast {
  type: 'success' | 'error'
  message: string
}

export function SheetSyncPanel({ clients }: { clients: ClientRow[] }) {
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<Toast | null>(null)
  const [clientData, setClientData] = useState<ClientRow[]>(clients)

  function showToast(type: Toast['type'], message: string) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  async function handleCreate(clientId: string) {
    setLoading(l => ({ ...l, [clientId + '_create']: true }))
    try {
      const res = await fetch('/api/sheets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setClientData(prev =>
        prev.map(c => c.id === clientId ? { ...c, google_sheet_id: json.sheetId } : c)
      )
      showToast('success', 'Planilha criada com sucesso! Já pode preenchê-la no Google Sheets.')
      window.open(json.sheetUrl, '_blank')
    } catch (e: any) {
      showToast('error', e.message)
    } finally {
      setLoading(l => ({ ...l, [clientId + '_create']: false }))
    }
  }

  async function handleSync(clientId: string) {
    setLoading(l => ({ ...l, [clientId + '_sync']: true }))
    try {
      const res = await fetch('/api/sheets/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      const now = new Date().toISOString()
      setClientData(prev =>
        prev.map(c => c.id === clientId ? { ...c, google_sheet_last_sync: now } : c)
      )
      const c = json.counts
      showToast(
        'success',
        `Sincronizado! ${c.oportunidades} oportunidades · ${c.timeline} timeline · ${c.reunioes} reuniões · ${c.materiais} materiais · ${c.calendario} calendário · ${c.planejamento} planejamento`
      )
    } catch (e: any) {
      showToast('error', e.message)
    } finally {
      setLoading(l => ({ ...l, [clientId + '_sync']: false }))
    }
  }

  function formatSync(dateStr: string | null) {
    if (!dateStr) return 'Nunca sincronizado'
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(dateStr))
  }

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl max-w-md text-sm ${
          toast.type === 'success'
            ? 'bg-success/10 border border-success/30 text-success'
            : 'bg-danger/10 border border-danger/30 text-danger'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
            : <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-bege flex items-center gap-2">
          <FileSpreadsheet size={18} className="text-bronze" />
          <h2 className="font-display font-semibold text-darkest">Planilhas por Cliente</h2>
          <span className="text-xs text-marrom/50 ml-auto">
            Cada cliente tem uma planilha Google Sheets vinculada. Preencha e sincronize para atualizar o dashboard.
          </span>
        </div>

        <div className="divide-y divide-bege/60">
          {clientData.map(client => {
            const sheetUrl = client.google_sheet_id
              ? `https://docs.google.com/spreadsheets/d/${client.google_sheet_id}/edit`
              : null
            const isCreating = loading[client.id + '_create']
            const isSyncing = loading[client.id + '_sync']

            return (
              <div key={client.id} className="px-6 py-5 flex items-center gap-4">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-bronze/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-bronze font-bold text-sm">{client.name[0]}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-darkest text-sm">{client.name}</p>
                  <p className="text-xs text-marrom/50 mt-0.5">
                    {client.google_sheet_id
                      ? `Última sync: ${formatSync(client.google_sheet_last_sync)}`
                      : 'Nenhuma planilha vinculada'}
                  </p>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {sheetUrl && (
                    <a
                      href={sheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost text-xs flex items-center gap-1.5 py-1.5 px-3"
                    >
                      <ExternalLink size={13} />
                      Abrir planilha
                    </a>
                  )}

                  {!client.google_sheet_id ? (
                    <button
                      onClick={() => handleCreate(client.id)}
                      disabled={isCreating}
                      className="btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3"
                    >
                      {isCreating
                        ? <RefreshCw size={13} className="animate-spin" />
                        : <Plus size={13} />}
                      {isCreating ? 'Criando…' : 'Criar planilha'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSync(client.id)}
                      disabled={isSyncing}
                      className="btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3"
                    >
                      <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                      {isSyncing ? 'Sincronizando…' : 'Sincronizar'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {clientData.length === 0 && (
            <div className="px-6 py-10 text-center text-marrom/40 text-sm">
              Nenhum cliente ativo encontrado.
            </div>
          )}
        </div>
      </div>

      {/* Instruções */}
      <div className="mt-6 card p-6 space-y-3">
        <h3 className="font-display font-semibold text-darkest text-sm flex items-center gap-2">
          <FileSpreadsheet size={16} className="text-bronze" />
          Como funciona
        </h3>
        <ol className="text-sm text-marrom/70 space-y-2 list-decimal list-inside">
          <li>Clique em <strong className="text-darkest">Criar planilha</strong> para gerar uma planilha Google Sheets com as abas já formatadas para o cliente.</li>
          <li>Preencha as abas da planilha: <strong className="text-darkest">Oportunidades</strong>, <strong className="text-darkest">Timeline</strong>, <strong className="text-darkest">Reuniões</strong>, <strong className="text-darkest">Materiais</strong>, <strong className="text-darkest">Calendário</strong> e <strong className="text-darkest">Planejamento</strong>.</li>
          <li>Clique em <strong className="text-darkest">Sincronizar</strong> para enviar os dados ao dashboard do cliente.</li>
          <li>O dashboard atualiza automaticamente — o cliente verá os dados em tempo real após a sincronização.</li>
        </ol>
        <p className="text-xs text-marrom/40 pt-1">
          A sincronização substitui os dados existentes pelos da planilha. As métricas de Meta Ads continuam sendo puxadas automaticamente.
        </p>
      </div>
    </>
  )
}
