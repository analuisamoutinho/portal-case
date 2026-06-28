-- ============================================================
-- MIGRATION: Segurança e Audit Log
-- Portal CASE Aceleradora
-- ============================================================

-- ── 1. Tabela de audit log ───────────────────────────────────
create table if not exists audit_logs (
  id            uuid primary key default uuid_generate_v4(),
  action        text not null,
  user_id       uuid references auth.users(id) on delete set null,
  client_id     uuid references clients(id) on delete set null,
  resource_id   text,
  resource_type text,
  metadata      jsonb default '{}',
  ip_address    text,
  user_agent    text,
  created_at    timestamptz default now()
);

-- Índices para consulta eficiente
create index audit_logs_user_id_idx     on audit_logs(user_id);
create index audit_logs_client_id_idx   on audit_logs(client_id);
create index audit_logs_action_idx      on audit_logs(action);
create index audit_logs_created_at_idx  on audit_logs(created_at desc);

-- Apenas admins leem audit logs; inserção via service_role (backend)
alter table audit_logs enable row level security;

create policy "admins_read_audit_logs"
  on audit_logs for select
  to authenticated
  using (
    (select role from profiles where id = auth.uid()) = 'admin'
  );

-- ── 2. Adicionar coluna 'role' mais granular em profiles ─────
-- Expande de ('admin','client') para ('admin','strategist','client_owner','client_viewer')
alter table profiles
  drop constraint if exists profiles_role_check;

alter table profiles
  add constraint profiles_role_check
  check (role in ('admin', 'strategist', 'client_owner', 'client_viewer'));

-- ── 3. Remover políticas antigas e recriar com RBAC correto ──

-- clients
drop policy if exists "admins_all"         on clients;
drop policy if exists "client_own_metrics" on metrics_snapshots;
drop policy if exists "client_own_ads"     on ad_performance;

-- Admins e strategists veem todos os clientes
create policy "case_team_read_clients"
  on clients for select
  to authenticated
  using (
    (select role from profiles where id = auth.uid()) in ('admin', 'strategist')
  );

-- Clientes veem apenas seu próprio registro
create policy "client_read_own"
  on clients for select
  to authenticated
  using (
    id = (select client_id from profiles where id = auth.uid())
  );

-- Somente admins escrevem em clients
create policy "admins_write_clients"
  on clients for all
  to authenticated
  using (
    (select role from profiles where id = auth.uid()) = 'admin'
  );

-- ── 4. metrics_snapshots — clientes leem só os próprios ──────
create policy "case_team_read_metrics"
  on metrics_snapshots for select
  to authenticated
  using (
    (select role from profiles where id = auth.uid()) in ('admin', 'strategist')
  );

create policy "client_read_own_metrics"
  on metrics_snapshots for select
  to authenticated
  using (
    client_id = (select client_id from profiles where id = auth.uid())
  );

-- ── 5. ad_performance — mesma lógica ─────────────────────────
create policy "case_team_read_ads"
  on ad_performance for select
  to authenticated
  using (
    (select role from profiles where id = auth.uid()) in ('admin', 'strategist')
  );

create policy "client_read_own_ads"
  on ad_performance for select
  to authenticated
  using (
    client_id = (select client_id from profiles where id = auth.uid())
  );

-- ── 6. materials — client_owner pode aprovar, viewer só lê ───
drop policy if exists "client_own_materials" on materials;

create policy "case_team_all_materials"
  on materials for all
  to authenticated
  using (
    (select role from profiles where id = auth.uid()) in ('admin', 'strategist')
  );

create policy "client_owner_manage_materials"
  on materials for all
  to authenticated
  using (
    client_id = (select client_id from profiles where id = auth.uid())
    and (select role from profiles where id = auth.uid()) = 'client_owner'
  );

create policy "client_viewer_read_materials"
  on materials for select
  to authenticated
  using (
    client_id = (select client_id from profiles where id = auth.uid())
    and (select role from profiles where id = auth.uid()) = 'client_viewer'
  );

-- ── 7. Storage: bucket privado com política por cliente ───────
-- Rodar no dashboard do Supabase > Storage após criar bucket 'materials' como PRIVADO

-- Política de upload (só CASE team e client_owner)
-- insert into storage.policies (name, bucket_id, definition) values (...)
-- Atenção: políticas de storage são criadas via dashboard ou API admin do Supabase,
-- não via SQL direto nesta migration. Veja README para instruções.

-- ── 8. Função helper: verifica se user pertence ao client_id ──
create or replace function user_belongs_to_client(p_client_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from profiles
    where id = auth.uid()
      and client_id = p_client_id
  )
$$;

-- ── 9. Rate limiting básico via pg na tabela de audit_logs ────
-- Conta requests da última hora por user_id + action
create or replace function check_rate_limit(
  p_user_id  uuid,
  p_action   text,
  p_max_reqs integer default 100
)
returns boolean
language sql
security definer
stable
as $$
  select count(*) < p_max_reqs
  from audit_logs
  where user_id  = p_user_id
    and action   = p_action
    and created_at > now() - interval '1 hour'
$$;
