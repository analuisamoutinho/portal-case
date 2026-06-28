'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Target, GitBranch, FileImage,
  Users, Calendar, BarChart2, BookOpen, ChevronRight, LogOut, Settings
} from 'lucide-react'
import { CompassIcon } from '@/components/ui/CompassIcon'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

const NAV = [
  { href: '/dashboard',      label: 'Dashboard',    icon: LayoutDashboard, badge: null },
  { href: '/oportunidades',  label: 'Oportunidades',icon: Target,          badge: null },
  { href: '/timeline',       label: 'Timeline',     icon: GitBranch,       badge: null },
  { href: '/materiais',      label: 'Materiais',    icon: FileImage,       badge: null },
  { href: '/reunioes',       label: 'Reuniões',     icon: Users,           badge: null },
  { href: '/calendario',     label: 'Calendário',   icon: Calendar,        badge: null },
  { href: '/planejamento',   label: 'Planejamento', icon: BarChart2,       badge: null, tag: 'NOVO' },
  { href: '/lab',            label: 'CASE Lab',     icon: BookOpen,        badge: null, tag: 'BETA' },
  { href: '/configuracoes',  label: 'Configurações',icon: Settings,        badge: null },
]

interface SidebarProps {
  clientName?: string
  clientInitial?: string
}

export function Sidebar({ clientName = 'CASE', clientInitial = 'C' }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="fixed inset-y-0 left-0 w-[200px] flex flex-col bg-dark-gradient z-40 select-none">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 pt-8 pb-6 px-4">
        <CompassIcon size={48} variant="bronze" />
        <div className="text-center">
          <p className="text-areia font-display font-bold text-xl tracking-[0.15em]">CASE</p>
          <p className="text-areia/40 text-[10px] tracking-[0.2em] uppercase">Aceleradora</p>
        </div>
      </div>

      {/* Divisor */}
      <div className="mx-5 h-px bg-white/10 mb-4" />

      {/* Navegação */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon, badge, tag }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}>
              <span className={clsx('sidebar-item', active && 'sidebar-item-active')}>
                <Icon size={16} className="flex-shrink-0" />
                <span className="flex-1 truncate">{label}</span>
                {badge && (
                  <span className="text-[10px] bg-bronze/25 text-bronze font-semibold px-1.5 py-0.5 rounded-pill">
                    {badge}
                  </span>
                )}
                {tag && (
                  <span className="text-[9px] bg-white/10 text-areia/50 font-semibold px-1.5 py-0.5 rounded-pill tracking-wider">
                    {tag}
                  </span>
                )}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Divisor */}
      <div className="mx-5 h-px bg-white/10 mt-4 mb-4" />

      {/* Rodapé */}
      <div className="px-3 pb-6 flex flex-col gap-1">
        <button
          onClick={handleLogout}
          className="sidebar-item w-full text-left"
        >
          <LogOut size={15} />
          <span>Sair</span>
        </button>

        <div className="mt-3 px-1">
          <p className="text-areia/25 text-[9px] leading-relaxed tracking-wider">
            CASE Aceleradora<br />
            Estratégia. Direção.<br />
            Expansão. Legado.
          </p>
        </div>
      </div>
    </aside>
  )
}
