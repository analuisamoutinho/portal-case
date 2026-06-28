'use client'
import { useState } from 'react'
import { Zap, Sparkles, Send, Bot } from 'lucide-react'

const SUGESTOES = [
  'Crie 5 copies para anúncio de açaí premium no Instagram',
  'Qual a melhor estratégia para aumentar o ROAS acima de 10?',
  'Sugira títulos criativos para campanha de inverno',
  'Como usar UGC para reduzir o CPM das campanhas?',
]

export function LabWidget() {
  const [prompt, setPrompt] = useState('')
  const [resposta, setResposta] = useState('')
  const [loading, setLoading] = useState(false)

  async function gerarConteudo() {
    if (!prompt.trim()) return
    setLoading(true)
    setResposta('')
    try {
      const res = await fetch('/api/ai/content-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, clientName: 'Givo Açaí', clientSegment: 'Food & Beverage' }),
      })
      const data = await res.json()
      setResposta(data.content || data.error || 'Sem resposta.')
    } catch {
      setResposta('Erro ao conectar com a IA. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="card p-6 border-bronze/20" style={{ background: 'linear-gradient(135deg, rgba(184,134,75,0.05) 0%, rgba(244,230,212,0.5) 100%)' }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-card bg-bronze/10 flex items-center justify-center">
            <Sparkles size={20} className="text-bronze" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-darkest">IA Estratégica</h2>
            <p className="text-xs text-marrom/50">Powered by Claude · Anthropic</p>
          </div>
        </div>
        <p className="text-sm text-marrom/60">Use a inteligência artificial para gerar copies, planos de conteúdo, análises estratégicas e muito mais, personalizado para o Givo Açaí.</p>
      </div>

      {/* Sugestões rápidas */}
      <div>
        <p className="label-overline mb-3">Sugestões rápidas</p>
        <div className="grid grid-cols-2 gap-2">
          {SUGESTOES.map((s, i) => (
            <button key={i} onClick={() => setPrompt(s)}
              className="text-left p-3 rounded-input border border-bege bg-surface hover:border-bronze/40 hover:bg-areia transition-all text-xs text-marrom/70 hover:text-marrom">
              <Zap size={10} className="text-bronze inline mr-1.5" />
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div>
        <p className="label-overline mb-3">Sua pergunta ou solicitação</p>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Ex: Crie um plano de conteúdo para o Instagram de julho com foco em conversão..."
          className="input-base resize-none"
          style={{ minHeight: '120px' }}
        />
        <button
          onClick={gerarConteudo}
          disabled={loading || !prompt.trim()}
          className="btn-primary mt-3 w-full"
        >
          {loading ? (
            <span className="animate-pulse">Gerando com IA...</span>
          ) : (
            <><Send size={14} /> Gerar com IA</>
          )}
        </button>
      </div>

      {/* Resposta */}
      {resposta && (
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-bege">
            <Bot size={16} className="text-bronze" />
            <span className="label-overline">Resposta da IA</span>
          </div>
          <p className="text-sm text-marrom/80 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{resposta}</p>
        </div>
      )}
    </div>
  )
}
