import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Rotas que não precisam de autenticação
const PUBLIC_ROUTES = ['/login', '/esqueci-senha', '/redefinir-senha']

// Rotas de API internas (validadas pelo próprio handler)
const API_ROUTES = ['/api/']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const { pathname } = request.nextUrl

  // Passa sem verificar rotas de API (cada handler valida internamente)
  if (API_ROUTES.some(r => pathname.startsWith(r))) {
    return response
  }

  // Cria cliente Supabase para o middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Renova a sessão se expirada
  const { data: { user } } = await supabase.auth.getUser()

  // Rota pública: se já logado, manda pro dashboard
  if (PUBLIC_ROUTES.some(r => pathname.startsWith(r))) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return response
  }

  // Rota protegida: sem usuário → manda pro login
  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Aplica em todas as rotas exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagem)
     * - favicon.ico
     * - arquivos com extensão (png, svg, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
