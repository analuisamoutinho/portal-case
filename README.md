# Portal CASE Aceleradora

Portal do cliente da CASE Aceleradora. Construído com Next.js 14, Supabase e Tailwind CSS, seguindo o Guia de Identidade Visual oficial.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Banco de dados:** Supabase (PostgreSQL + Auth + RLS)
- **Estilo:** Tailwind CSS com design system customizado
- **Gráficos:** Recharts
- **Ícones:** Lucide React
- **Tipagem:** TypeScript

## Estrutura

```
portal-case/
├── app/
│   ├── login/page.tsx          ← Tela de login
│   ├── dashboard/
│   │   ├── layout.tsx          ← Layout com sidebar
│   │   └── page.tsx            ← Dashboard principal
│   ├── oportunidades/          ← Mural de oportunidades
│   ├── timeline/               ← Jornada da marca
│   ├── materiais/              ← Central de aprovação
│   ├── reunioes/               ← Registro de reuniões
│   ├── calendario/             ← Calendário
│   ├── planejamento/           ← Planejamento Instagram
│   └── lab/                    ← CASE Lab
├── components/
│   ├── ui/CompassIcon.tsx      ← Rosa-dos-ventos SVG
│   └── layout/
│       ├── Sidebar.tsx         ← Sidebar de navegação
│       └── TopBar.tsx          ← Header das páginas
├── lib/
│   ├── supabase.ts             ← Cliente Supabase
│   └── types.ts                ← Types + helpers
└── styles/globals.css          ← Design system (tokens, componentes)
```

## Identidade Visual

| Token       | Hex       | Uso                        |
|-------------|-----------|----------------------------|
| `areia`     | #F4E6D4   | Background principal       |
| `bege`      | #E9D2B6   | Bordas, superfícies suaves |
| `nude`      | #D9B794   | Muted, ícones secundários  |
| `bronze`    | #B8864B   | Acento principal, CTAs     |
| `marrom`    | #4A2E1F   | Texto primário             |
| `cafe`      | #1E120D   | Sidebar, textos escuros    |
| `surface`   | #FDFAF6   | Fundo de cards             |

**Fontes:** Mont (display/títulos) · Inter (corpo/UI)

## Setup

### 1. Instalar dependências

```bash
cd portal-case
npm install
```

### 2. Configurar variáveis de ambiente

Edite o `.env.local` com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://raeyqlzcraejhivenuge.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

> A anon key está em: Supabase → Settings → API

### 3. Configurar Supabase Auth

No painel do Supabase:
1. Authentication → Providers → Email → Enable
2. Authentication → URL Configuration → Site URL: `http://localhost:3000`

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

## Telas implementadas

| Tela           | Status | Dados        |
|----------------|--------|--------------|
| Login          | ✅     | Supabase Auth real |
| Dashboard      | ✅     | Mock (aguarda API Meta) |
| Oportunidades  | 🔧     | Em construção |
| Timeline       | 🔧     | Em construção |
| Materiais      | 🔧     | Em construção |
| Reuniões       | 🔧     | Em construção |
| Calendário     | 🔧     | Em construção |
| Planejamento   | 🔧     | Em construção |
| CASE Lab       | 🔧     | Em construção |

## Banco de dados

Projeto Supabase: `portal-case`  
URL: `https://raeyqlzcraejhivenuge.supabase.co`  
14 tabelas criadas com RLS habilitado.

## Próximos passos

1. Buscar `anon key` no Supabase e adicionar ao `.env.local`
2. Criar primeiro usuário admin no Supabase Auth
3. Conectar API do Meta Ads para puxar métricas reais
4. Implementar telas restantes
5. Deploy na Vercel

---

## Segurança

### Arquitetura de variáveis

| Variável | Vai ao browser? | Onde usar |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Sim | Browser + Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Sim | Browser + Server |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ Nunca | Somente `lib/server/` |
| `META_ACCESS_TOKEN` | ❌ Nunca | Somente `app/api/` |
| `ANTHROPIC_API_KEY` | ❌ Nunca | Somente `app/api/` |
| `GOOGLE_CLIENT_SECRET` | ❌ Nunca | Somente `app/api/` |

### Clientes Supabase

- `lib/supabase.ts` → browser client (anon key) — Client Components
- `lib/server/supabase.ts` → server client (anon key + cookies) — Server Components, API Routes
- `createAdminClient()` → service role — somente cron/webhooks/setup

### RBAC

| Papel | Acesso |
|---|---|
| `admin` | Tudo — gestão da CASE |
| `strategist` | Clientes atribuídos — leitura e edição |
| `client_owner` | Próprio negócio — aprova materiais, comenta |
| `client_viewer` | Próprio negócio — somente leitura |

### Storage

- Bucket `materials` deve ser **PRIVADO** (não público)
- Arquivos em `/{client_id}/materials/`
- URLs geradas via `/api/storage/signed-url` com expiração curta
- Nunca URLs permanentes para arquivos confidenciais

### Rodar migration de segurança no Supabase

```
Supabase Dashboard → SQL Editor → colar conteúdo de:
supabase/migrations/002_security.sql
```

### Checklist antes de produção

- [ ] Nenhuma `service_role_key` com prefixo `NEXT_PUBLIC_`
- [ ] Nenhuma chave de API no código frontend
- [ ] `.env.local` no `.gitignore` ✅
- [ ] Migration `002_security.sql` executada
- [ ] Bucket `materials` criado como privado
- [ ] Policies de storage configuradas no dashboard
- [ ] Teste com dois usuários de clientes diferentes tentando cruzar dados
- [ ] Audit log funcionando (tabela `audit_logs` com registros)
- [ ] Rate limiting ativo nas rotas de IA
- [ ] Ambiente de produção separado do desenvolvimento
