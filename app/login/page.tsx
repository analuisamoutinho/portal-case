'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { CompassIcon } from '@/components/ui/CompassIcon'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('E-mail ou senha incorretos. Verifique suas credenciais.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-areia map-texture flex items-center justify-center p-4 relative overflow-hidden">

      {/* Rosa-dos-ventos decorativa de fundo */}
      <div className="absolute right-[-60px] top-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none">
        <CompassIcon size={520} variant="bronze" />
      </div>

      {/* Grid cartográfico de fundo */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(74,46,31,1) 1px, transparent 1px), linear-gradient(90deg, rgba(74,46,31,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Card de login */}
      <div className="relative w-full max-w-[420px]">
        {/* Bordas decorativas nos cantos — estilo do PDF */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-bronze/40 rounded-tl-[4px]" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-bronze/40 rounded-tr-[4px]" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-bronze/40 rounded-bl-[4px]" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-bronze/40 rounded-br-[4px]" />

        <div className="bg-surface rounded-card shadow-modal px-10 py-10">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <CompassIcon size={56} variant="bronze" />
            <div className="mt-3 text-center">
              <p className="font-display font-bold text-2xl tracking-[0.2em] text-darkest">CASE</p>
              <p className="text-[11px] tracking-[0.25em] text-marrom/40 uppercase mt-0.5">Aceleradora</p>
            </div>
          </div>

          {/* Divisor com ícone */}
          <div className="flex items-center gap-3 mb-7">
            <div className="flex-1 h-px bg-bege" />
            <CompassIcon size={14} variant="bronze" />
            <div className="flex-1 h-px bg-bege" />
          </div>

          {/* Título */}
          <div className="text-center mb-7">
            <h1 className="text-display-sm text-darkest font-display">Portal do Cliente</h1>
            <p className="text-sm text-marrom/50 mt-1.5">
              Acesse sua conta e acompanhe o que move o seu crescimento.
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {/* Campo e-mail */}
            <div>
              <label className="label-overline block mb-2 text-[10px]">E-mail</label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-nude pointer-events-none"
                />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                  className="input-base pl-10"
                />
              </div>
            </div>

            {/* Campo senha */}
            <div>
              <label className="label-overline block mb-2 text-[10px]">Senha</label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-nude pointer-events-none"
                />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  required
                  autoComplete="current-password"
                  className="input-base pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-nude hover:text-marrom transition-colors p-0.5"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Lembrar + Esqueci */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  onClick={() => setRemember(v => !v)}
                  className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all cursor-pointer
                    ${remember ? 'bg-bronze border-bronze' : 'border-nude bg-transparent'}`}
                >
                  {remember && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-xs text-marrom/60 group-hover:text-marrom transition-colors select-none">
                  Lembrar meu acesso
                </span>
              </label>
              <button type="button" className="text-xs text-bronze hover:text-marrom transition-colors">
                Esqueci minha senha
              </button>
            </div>

            {/* Erro */}
            {error && (
              <div className="bg-danger/8 border border-danger/20 rounded-input px-4 py-3 text-xs text-danger animate-fade-in">
                {error}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-1 py-3.5"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-surface/30 border-t-surface rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CompassIcon size={16} variant="light" />
                  Entrar no Portal
                </span>
              )}
            </button>
          </form>

          {/* Rodapé seguro */}
          <div className="flex items-center justify-center gap-2 mt-6 text-marrom/35">
            <ShieldCheck size={13} />
            <span className="text-[11px]">Ambiente seguro e criptografado</span>
          </div>
        </div>

        {/* Tagline abaixo do card */}
        <p className="text-center mt-6 text-[11px] tracking-[0.2em] text-marrom/30 uppercase">
          Estratégia. Direção. Expansão. Legado.
        </p>
      </div>
    </div>
  )
}
