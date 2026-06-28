'use client'

import { ChevronDown, RefreshCw } from 'lucide-react'
import { CompassIcon } from '@/components/ui/CompassIcon'

interface TopBarProps {
  title: string
  subtitle?: string
  userName?: string
  userRole?: string
  userInitial?: string
  onRefresh?: () => void
  refreshedAt?: string
  children?: React.ReactNode
}

export function TopBar({
  title,
  subtitle,
  userName = 'Usuário',
  userRole = 'Cliente',
  userInitial,
  onRefresh,
  refreshedAt,
  children,
}: TopBarProps) {
  const initial = userInitial || userName.charAt(0).toUpperCase()

  return (
    <header className="flex items-start justify-between mb-8">
      {/* Título da página */}
      <div className="flex items-center gap-3">
        <CompassIcon size={22} variant="bronze" className="mt-0.5 flex-shrink-0" />
        <div>
          <h1 className="text-display-md text-darkest font-display leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-marrom/50 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {/* Direita */}
      <div className="flex items-center gap-3">
        {/* Refresh */}
        {(onRefresh || refreshedAt) && (
          <div className="flex items-center gap-2 text-xs text-marrom/40">
            {refreshedAt && <span>Dados atualizados {refreshedAt}</span>}
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-1 rounded-[6px] hover:bg-bege/50 transition-colors"
                title="Atualizar dados"
              >
                <RefreshCw size={13} />
              </button>
            )}
          </div>
        )}

        {/* Slot customizável */}
        {children}

        {/* Avatar do usuário */}
        <button className="flex items-center gap-2 py-1.5 px-2.5 rounded-[10px] hover:bg-bege/50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-bronze flex items-center justify-center text-surface text-sm font-semibold flex-shrink-0">
            {initial}
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-marrom leading-none">{userName}</p>
            <p className="text-[10px] text-marrom/50 leading-none mt-0.5">{userRole}</p>
          </div>
          <ChevronDown size={13} className="text-marrom/40" />
        </button>
      </div>
    </header>
  )
}
