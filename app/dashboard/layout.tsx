import { Sidebar } from '@/components/layout/Sidebar'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-areia map-texture">
      <Sidebar />
      <main className="ml-[200px] min-h-screen">
        <div className="max-w-[1180px] mx-auto px-8 py-8">
          {children}
        </div>
      </main>
      {/* Frase de rodapé */}
      <footer className="ml-[200px] px-8 py-4 border-t border-bege/50">
        <div className="max-w-[1180px] mx-auto flex items-center justify-between">
          <p className="text-marrom/30 text-xs italic">
            &ldquo;O presente certo no momento certo transforma cliente em fã.&rdquo;
          </p>
          <div className="flex items-center gap-1.5 text-marrom/30">
            <span className="text-xs text-bronze/60">✦</span>
            <span className="text-xs tracking-wider">Estratégia. Execução.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
